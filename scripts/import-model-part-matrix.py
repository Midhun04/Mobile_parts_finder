"""Import data/model_part_matrix.csv into catalog CSVs.

Skips 'Not researched yet' and default-assumption pouches.
Creates shared part groups via union-find; researched standalones get model-specific parts.
Preserves existing seed rows. Idempotent for matrix-created parts keyed by type+model-set.

Usage: python scripts/import-model-part-matrix.py
"""
from __future__ import annotations

import csv
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

PART_COLS = [
    ("Display_Combo", "Display"),
    ("Battery", "Battery"),
    ("OCA_Glass", "OCA Glass"),
    ("Pouch_BackPanel", "Pouch"),
    ("Charging_Board", "Charging Board"),
    ("Tempered_Glass", "Tempered Glass"),
    ("UV_Glass", "UV Glass"),
]

KNOWN_BRANDS = [
    "Samsung", "Apple", "Xiaomi", "Redmi", "Realme", "Oppo", "Vivo", "OnePlus",
    "Nokia", "Motorola", "Google", "Huawei", "Honor", "Infinix", "Tecno", "Lava",
    "Nothing", "Asus", "Sony", "Lenovo", "Poco", "POCO", "Itel", "Micromax",
    "iQOO", "IQOO", "HTC", "ZTE",
]

class UnionFind:
    def __init__(self) -> None:
        self.parent: dict[int, int] = {}

    def add(self, x: int) -> None:
        if x not in self.parent:
            self.parent[x] = x

    def find(self, x: int) -> int:
        self.add(x)
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.parent[rb] = ra

    def components(self) -> dict[int, list[int]]:
        groups: dict[int, list[int]] = defaultdict(list)
        for x in list(self.parent):
            groups[self.find(x)].append(x)
        return groups


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, str]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        w.writeheader()
        for row in rows:
            w.writerow({k: row.get(k, "") for k in fieldnames})


def normalize_label(label: str) -> tuple[str, str, str | None]:
    s = re.sub(r"\s+", " ", label.strip())
    model_number = None
    m = re.search(r"\(([^)]+)\)\s*$", s)
    if m:
        model_number = m.group(1).strip()
        s = s[: m.start()].strip()

    brand = None
    model = s
    for p in sorted(KNOWN_BRANDS, key=len, reverse=True):
        if s.lower().startswith(p.lower() + " "):
            brand = "Poco" if p.lower() == "poco" else p
            model = s[len(p) :].strip()
            break
        if s.lower() == p.lower():
            brand = "Poco" if p.lower() == "poco" else p
            model = s
            break

    if brand is None:
        if s.lower().startswith("iphone"):
            brand, model = "Apple", s
        else:
            brand, model = "Unknown", s

    if brand == "Xiaomi" and model.lower().startswith("redmi "):
        brand = "Redmi"
        model = model[6:].strip()
    elif brand == "Xiaomi" and model.lower() == "redmi":
        brand = "Redmi"

    if brand == "Huawei" and model.lower().startswith("honor"):
        brand = "Honor"
        rest = model[5:].strip()
        model = rest if rest else model

    if brand == "Motorola" and model.lower().startswith("moto "):
        model = model[5:].strip()

    if brand.lower() in ("iqoo",):
        brand = "iQOO"

    if brand == "Samsung":
        if not model.lower().startswith("galaxy "):
            model = f"Galaxy {model}"

    # Catalog-friendly aliases
    model = re.sub(r"\b(Y\d+)S\b", lambda mm: mm.group(1) + "s", model)
    aliases = {
        ("Redmi", "Note 11s 4G"): "Note 11s",
        ("Redmi", "Note 10 4G"): "Note 10",
        ("Redmi", "12 4G"): "12",
        ("Samsung", "Galaxy A53 5G"): "Galaxy A53",
        ("Honor", "4A"): "4A",
    }
    model = aliases.get((brand, model), model)
    return brand, model, model_number


def should_skip(shared: str) -> bool:
    s = (shared or "").strip()
    if not s or s == "-":
        return True
    if s.startswith("Not researched yet"):
        return True
    if "default assumption" in s:
        return True
    return False


def is_standalone(shared: str) -> bool:
    return shared.strip() == "Not shared — model-specific part"


def main() -> None:
    matrix_path = DATA / "model_part_matrix.csv"
    matrix = read_csv(matrix_path)
    if len(matrix) < 50:
        raise SystemExit(f"Matrix too small ({len(matrix)} rows): {matrix_path}")

    brands = read_csv(DATA / "brands.csv")
    models = read_csv(DATA / "mobile_models.csv")
    part_types = read_csv(DATA / "part_types.csv")
    parts = read_csv(DATA / "parts.csv")
    comps = read_csv(DATA / "compatibility.csv")

    brand_by_name = {b["name"].lower(): b for b in brands}
    next_brand = max(int(b["id"]) for b in brands) + 1

    def ensure_brand(name: str) -> dict[str, str]:
        nonlocal next_brand
        key = name.lower()
        if key in brand_by_name:
            return brand_by_name[key]
        row = {"id": str(next_brand), "name": name}
        next_brand += 1
        brands.append(row)
        brand_by_name[key] = row
        return row

    for extra in ("Poco", "Itel", "Micromax", "iQOO", "HTC", "ZTE"):
        ensure_brand(extra)

    type_by_name = {t["name"]: t for t in part_types}

    def ensure_type(name: str) -> dict[str, str]:
        if name not in type_by_name:
            raise SystemExit(f"Missing part type in catalog: {name}")
        return type_by_name[name]

    model_index: dict[tuple[str, str], dict[str, str]] = {}
    for m in models:
        bname = next(b["name"] for b in brands if b["id"] == m["brand_id"])
        model_index[(bname.lower(), m["model"].lower())] = m

    next_model = max(int(m["id"]) for m in models) + 1

    def ensure_model(brand: str, name: str, model_number: str | None) -> dict[str, str]:
        nonlocal next_model
        b = ensure_brand(brand)
        key = (b["name"].lower(), name.lower())
        if key in model_index:
            existing = model_index[key]
            if model_number and not existing.get("model_number"):
                existing["model_number"] = model_number
            return existing
        row = {
            "id": str(next_model),
            "brand_id": b["id"],
            "model": name,
            "model_number": model_number or "",
            "release_year": "",
        }
        next_model += 1
        models.append(row)
        model_index[key] = row
        return row

    def resolve_label(label: str, fallback_brand: str | None = None) -> dict[str, str]:
        brand, name, num = normalize_label(label)
        if brand == "Unknown" and fallback_brand:
            brand = "Poco" if fallback_brand.upper() == "POCO" else fallback_brand
            if name.lower().startswith(brand.lower()):
                name = name[len(brand) :].strip()
        if brand == "Unknown":
            raise ValueError(f"Cannot resolve brand for label: {label}")
        return ensure_model(brand, name, num)

    for row in matrix:
        resolve_label(row["Model"], row["Brand"])

    next_part = max(int(p["id"]) for p in parts) + 1
    next_compat = max(int(c["id"]) for c in comps) + 1
    existing_compat = {(c["mobile_model_id"], c["part_id"]) for c in comps}

    # Existing matrix parts: name starts with marker
    MARKER = "[matrix]"
    matrix_part_keys: dict[tuple[str, frozenset[str]], str] = {}
    # Rebuild keys from existing matrix parts via their compat links
    for p in parts:
        if MARKER not in p["part_name"]:
            continue
        linked = frozenset(
            c["mobile_model_id"] for c in comps if c["part_id"] == p["id"]
        )
        type_name = next(t["name"] for t in part_types if t["id"] == p["part_type_id"])
        matrix_part_keys[(type_name, linked)] = p["id"]

    def add_part(type_name: str, part_name: str, manufacturer: str) -> dict[str, str]:
        nonlocal next_part
        t = ensure_type(type_name)
        row = {
            "id": str(next_part),
            "part_type_id": t["id"],
            "part_name": part_name,
            "part_number": "",
            "manufacturer": manufacturer,
        }
        next_part += 1
        parts.append(row)
        return row

    def link(model_id: str, part_id: str, notes: str) -> None:
        nonlocal next_compat
        key = (str(model_id), str(part_id))
        if key in existing_compat:
            return
        existing_compat.add(key)
        comps.append(
            {
                "id": str(next_compat),
                "mobile_model_id": str(model_id),
                "part_id": str(part_id),
                "verified": "FALSE",
                "notes": notes,
            }
        )
        next_compat += 1

    ufs: dict[str, UnionFind] = {t: UnionFind() for _, t in PART_COLS}
    standalone: list[tuple[str, dict[str, str], str]] = []

    for row in matrix:
        self_model = resolve_label(row["Model"], row["Brand"])
        manufacturer = "Poco" if row["Brand"].upper() == "POCO" else row["Brand"]
        for col_prefix, type_name in PART_COLS:
            shared = row.get(f"{col_prefix}_SharedWith", "")
            if should_skip(shared):
                continue
            if is_standalone(shared):
                standalone.append((type_name, self_model, manufacturer))
                continue
            labels = [x.strip() for x in shared.split(";") if x.strip()]
            ufs[type_name].add(int(self_model["id"]))
            for lab in labels:
                try:
                    other = resolve_label(lab, row["Brand"])
                except ValueError:
                    other = resolve_label(lab)
                ufs[type_name].add(int(other["id"]))
                ufs[type_name].union(int(self_model["id"]), int(other["id"]))

    added_parts = 0
    for type_name, uf in ufs.items():
        for _root, member_ids in uf.components().items():
            if len(member_ids) < 2:
                continue
            key = (type_name, frozenset(str(i) for i in member_ids))
            if key in matrix_part_keys:
                part_id = matrix_part_keys[key]
            else:
                names = []
                for mid in sorted(member_ids):
                    m = next(x for x in models if int(x["id"]) == mid)
                    b = next(x for x in brands if x["id"] == m["brand_id"])
                    names.append(f"{b['name']} {m['model']}")
                short = "; ".join(names[:3])
                if len(names) > 3:
                    short += f" (+{len(names) - 3})"
                mfr = names[0].split()[0] if names else "Generic"
                part = add_part(
                    type_name,
                    f"{MARKER} {type_name} shared ({short})",
                    mfr,
                )
                matrix_part_keys[key] = part["id"]
                part_id = part["id"]
                added_parts += 1
            notes = (
                f"From model_part_matrix | {type_name} shared across "
                f"{len(member_ids)} models"
            )
            for mid in member_ids:
                link(str(mid), part_id, notes)

    for type_name, model, manufacturer in standalone:
        key = (type_name, frozenset([model["id"]]))
        if key in matrix_part_keys:
            part_id = matrix_part_keys[key]
        else:
            b = next(x for x in brands if x["id"] == model["brand_id"])
            part = add_part(
                type_name,
                f"{MARKER} {b['name']} {model['model']} {type_name}",
                manufacturer,
            )
            matrix_part_keys[key] = part["id"]
            part_id = part["id"]
            added_parts += 1
        link(model["id"], part_id, "From model_part_matrix | model-specific")

    write_csv(DATA / "brands.csv", ["id", "name"], brands)
    write_csv(
        DATA / "mobile_models.csv",
        ["id", "brand_id", "model", "model_number", "release_year"],
        models,
    )
    write_csv(DATA / "part_types.csv", ["id", "name"], part_types)
    write_csv(
        DATA / "parts.csv",
        ["id", "part_type_id", "part_name", "part_number", "manufacturer"],
        parts,
    )
    write_csv(
        DATA / "compatibility.csv",
        ["id", "mobile_model_id", "part_id", "verified", "notes"],
        comps,
    )

    print(
        f"OK matrix_rows={len(matrix)} brands={len(brands)} models={len(models)} "
        f"parts={len(parts)} compat={len(comps)} new_parts={added_parts}"
    )


if __name__ == "__main__":
    main()
