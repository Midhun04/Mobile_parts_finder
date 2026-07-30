"""One-shot builder: writes data/universal_pouch_groups.json from supplier Back Cover/Pouch lists."""
from __future__ import annotations

import json
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "data" / "universal_pouch_groups.json"

groups: list[dict[str, str]] = []


def add(gid: str, brand: str, models: str) -> None:
    models = " ".join(models.split())
    if models.strip("= +"):
        groups.append({"id": gid, "brand": brand, "models": models})


# ---- Oppo / Realme / OnePlus ----
add("oppo_1", "Oppo", "Oppo F19 = Oppo F19S = Oppo A74 4G = Oppo A94 4G = Oppo Reno 6 Lite")
add("oppo_2", "Realme", "Realme 2 = Oppo A5")
add("oppo_3", "Oppo", "Oppo F11 = Oppo A9")
add("oppo_4", "Realme", "Realme X = Oppo K3")
add("oppo_5", "Oppo", "Oppo A9 2020 = Oppo A5 2020")
add("oppo_6", "Oppo", "Oppo K10 4G = Realme 9i = Oppo A96")
add("oppo_7", "Oppo", "Oppo F19 = Oppo A94 4G")
add("oppo_8", "Oppo", "Oppo A53 2020 = Oppo A32")
add("oppo_9", "Oppo", "Oppo F17 = Oppo A93")
add("oppo_10", "Oppo", "Oppo A17 = Oppo A17K")
add("oppo_11", "Oppo", "Oppo A74 5G = Oppo A54 5G")
add("oppo_12", "Oppo", "Oppo A3 Pro 5G = Oppo K12X")
add("oppo_13", "Oppo", "Oppo A3S = Oppo A5 = Realme C1")
add("oppo_14", "Realme", "Realme C2 = Oppo A1K")
add("oppo_15", "Oppo", "Oppo K11X 5G = OnePlus Nord CE Lite 5G = OnePlus Nord N30 5G")
add("oppo_16", "Oppo", "Oppo A16K = Oppo A16E")
add("oppo_17", "Oppo", "Oppo A16 = Oppo A55 = Oppo A54")
add("oppo_18", "Oppo", "Oppo A15 = Oppo A15S")
add("oppo_19", "Oppo", "Oppo A52 = Oppo A72 = Oppo A92")
add("oppo_20", "Oppo", "Oppo A31 2020 = Oppo A8")
add("oppo_21", "Oppo", "Oppo F15 = Oppo A91 = Oppo Reno 3")
add("oppo_22", "Oppo", "Oppo A18 = Oppo A38")
add(
    "oppo_23",
    "Oppo",
    "Oppo A5S = Oppo A12 = Oppo A11K = Oppo A7 = Oppo F9 = Oppo F9 Pro = Realme 2 Pro",
)
add("oppo_24", "Oppo", "Oppo A57 = Oppo K10 5G = Oppo A77")
add("oppo_25", "OnePlus", "OnePlus Nord CE 2 = Oppo Reno 7 5G")
add("oppo_26", "Realme", "Realme 10 = Realme 10 Pro 5G")
add("oppo_27", "Realme", "Realme 3 = Realme 3i")
add("oppo_28", "Realme", "Realme X2 = Realme XT")
add("oppo_29", "Realme", "Realme 6 = Realme 6i")
add("oppo_30", "Realme", "Realme 9 Pro Plus = Realme Narzo 50 Pro = Realme 9 4G")
add("oppo_31", "Realme", "Realme C20 = Realme C11 2021 = Realme Narzo 50i")
add("oppo_32", "Realme", "Realme C55 = Realme Narzo N55")
add("oppo_33", "Realme", "Realme 8i = Realme Narzo 50")
add("oppo_34", "Realme", "Realme C21Y = Realme C25Y")
add("oppo_35", "Realme", "Realme 7i = Realme C17")
add("oppo_36", "Realme", "Realme 11 Pro = Realme 11 Pro Plus")
add(
    "oppo_37",
    "Realme",
    "Realme C53 4G = Realme C51 4G = Realme Narzo N53 = Realme Note 50 4G",
)
add("oppo_38", "Realme", "Realme C35 = Realme Narzo 50A Prime")
add("oppo_39", "Realme", "Realme C30 = Realme Narzo 50i Prime")
add(
    "oppo_40",
    "Realme",
    "Realme C65 5G = Realme Narzo N65 5G = Realme 12 5G = Realme 12X",
)
add("oppo_41", "Realme", "Realme 7 = Realme Narzo 20 Pro = Realme Narzo 30 4G")
add("oppo_42", "Realme", "Realme Narzo 10A = Realme Narzo 20A")
add("oppo_43", "Realme", "Realme 8 5G = Realme Narzo 30 5G = Realme 9 5G")
add("oppo_44", "Realme", "Realme 8 4G = Realme 8 Pro")
add(
    "oppo_45",
    "Realme",
    "Realme 5 = Realme 5i = Realme 5S = Realme Narzo 10 = Realme Narzo 10A = Realme Narzo 20A",
)
add("oppo_46", "Realme", "Realme 12 Plus 5G = Realme Narzo 70 Pro")
add("oppo_47", "Realme", "Realme 9 Pro = OnePlus Nord CE 2 Lite")
add("oppo_48", "Realme", "Realme GT Master = OnePlus Nord CE")
add(
    "oppo_49",
    "Realme",
    "Realme C12 = Realme C15 = Realme C25 = Realme Narzo 20 = Realme Narzo 30A = Realme Narzo 50A",
)
add(
    "oppo_50",
    "Realme",
    "Realme 11 5G = Realme 11X 5G = Realme C67 5G = Realme Narzo 60X 5G",
)
add("oppo_51", "Realme", "Realme 9i 4G = Oppo A76 = Oppo A96")
add("oppo_52", "Realme", "Realme 14 Pro 5G = Realme Narzo 80 Pro")
add("oppo_53", "Realme", "Realme 13 5G = Realme 12 5G = Realme 12X = Realme C65")

# ---- Redmi / Poco ----
add("redmi_1", "Redmi", "Redmi Note 13 Pro 5G = Poco X6 5G")
add("redmi_2", "Redmi", "Redmi 13C 5G = Poco M6 5G")
add("redmi_3", "Redmi", "Poco C65 4G = Redmi 13C 4G")
add("redmi_4", "Redmi", "Redmi 12 5G = Poco M6 Pro 5G")
add("redmi_5", "Redmi", "Redmi 12C 4G = Poco C55 4G = Redmi 11A")
add("redmi_6", "Redmi", "Redmi A1 2022 = Redmi A2 2023")
add("redmi_7", "Redmi", "Redmi A1 Plus = Redmi A2 Plus")
add("redmi_8", "Redmi", "Redmi 10C = Redmi 10 = Redmi 10 Power")
add("redmi_9", "Redmi", "Redmi Note 10 = Redmi Note 10S")
add("redmi_10", "Redmi", "Redmi 9 Prime = Poco M2")
add("redmi_11", "Redmi", "Redmi 9A = Redmi 9i")
add("redmi_12", "Redmi", "Redmi 9 = Redmi 9C = Redmi 10A = Poco C31")
add("redmi_13", "Redmi", "Redmi 10T = Redmi 10T Pro")
add("redmi_14", "Redmi", "Redmi Note 11 Pro = Redmi Note 11i = Redmi Note 11 Pro Plus")
add("redmi_15", "Redmi", "Redmi Note 11T = Poco M4 Pro 5G")
add("redmi_16", "Redmi", "Redmi Note 12 Pro = Poco X5 Pro")
add("redmi_17", "Redmi", "Redmi Note 9 Pro = Redmi Note 9 Pro Max = Poco M2 Pro")
add("redmi_18", "Redmi", "Redmi 7 = Redmi Y3")
add("redmi_19", "Redmi", "Redmi Note 7 = Redmi Note 7 Pro = Redmi Note 7S")
add("redmi_20", "Redmi", "Redmi Note 6 = Redmi Note 6 Pro")
add("redmi_21", "Redmi", "Redmi K20 = Redmi K20 Pro")
add("redmi_22", "Redmi", "Redmi A3 4G = Redmi A3X 4G = Poco C61 4G")
add("redmi_23", "Redmi", "Redmi K30 = Poco X2")
add("redmi_24", "Redmi", "Redmi Note 10 5G = Redmi Note 10T 5G = Poco M3 Pro 5G")
add("redmi_25", "Redmi", "Redmi 11X = Redmi 11X Pro = Redmi K40")
add("redmi_26", "Redmi", "Redmi Note 10 = Redmi Note 10 Pro Max")
add("redmi_27", "Redmi", "Poco X3 = Poco X3 Pro")
add("redmi_28", "Redmi", "Redmi 8 = Redmi 8A = Redmi 8A Dual")
add("redmi_29", "Redmi", "Redmi A3 2024 = Poco C61")

# ---- Samsung (deduped; list was pasted twice) ----
add("sam_1", "Samsung", "Samsung M55 5G = Samsung F55 5G")
add("sam_2", "Samsung", "Samsung F15 5G = Samsung M15 5G")
add("sam_3", "Samsung", "Samsung A35 5G = Samsung A55 5G")
add("sam_4", "Samsung", "Samsung A15 = Samsung A25 = Samsung A24")
add("sam_5", "Samsung", "Samsung F54 = Samsung M54")
add("sam_6", "Samsung", "Samsung A10 = Samsung M10")
add("sam_7", "Samsung", "Samsung A50 = Samsung A50S = Samsung A30S")
add("sam_8", "Samsung", "Samsung A22 4G = Samsung M22 = Samsung F22 = Samsung M32")
add("sam_9", "Samsung", "Samsung A42 5G = Samsung M42 5G = Samsung F42")
add("sam_10", "Samsung", "Samsung M02S = Samsung F02S = Samsung A03S")
add("sam_11", "Samsung", "Samsung M12 = Samsung A12 = Samsung F12")
add("sam_12", "Samsung", "Samsung A32 4G = Samsung M32 5G")
add("sam_13", "Samsung", "Samsung F62 = Samsung M62")
add("sam_14", "Samsung", "Samsung M14 5G = Samsung F23 5G = Samsung M13 4G")
add("sam_15", "Samsung", "Samsung A04E = Samsung M04 = Samsung F04")
add("sam_16", "Samsung", "Samsung A20 = Samsung A30 = Samsung M10S")
add("sam_17", "Samsung", "Samsung M30S = Samsung M21")
add("sam_18", "Samsung", "Samsung M11 = Samsung A11")
add("sam_19", "Samsung", "Samsung A01 = Samsung M01")
add("sam_20", "Samsung", "Samsung F41 = Samsung M31")
add("sam_21", "Samsung", "Samsung M40 = Samsung A60")
add("sam_22", "Samsung", "Samsung M40 = Samsung A22")
add("sam_23", "Samsung", "Samsung A03 = Samsung A04 Core")

# ---- Vivo ----
add(
    "vivo_1",
    "Vivo",
    "Vivo Y20 = Vivo Y20S = Vivo Y20L = Vivo Y12S = Vivo Y20i = Vivo Y11S = Vivo Y20A = iQOO U1x",
)
add("vivo_2", "Vivo", "Vivo Y11S = iQOO U1X")
add("vivo_3", "Vivo", "Vivo V40 = Vivo V40 Pro = Vivo T3 Ultra")
add("vivo_4", "Vivo", "Vivo Y12 = Vivo Y15 = Vivo Y17 = Vivo U10")
add("vivo_6", "Vivo", "Vivo Y91 = Vivo Y93 = Vivo Y95")
add("vivo_7", "Vivo", "Vivo Y18 = Vivo Y28S = Vivo Y18E = Vivo Y03 = Vivo T3 Lite")
add("vivo_8", "Vivo", "Vivo T3X = Vivo Y38 = Vivo Y58 5G = Vivo Y200T")
add("vivo_9", "Vivo", "Vivo T3 5G = Vivo Y200E")
add("vivo_10", "Vivo", "Vivo V23E = Vivo Y75 4G")
add("vivo_11", "Vivo", "Vivo V40E = iQOO Z9S")
add("vivo_12", "Vivo", "Vivo V30 = Vivo V30 Pro")
add("vivo_13", "Vivo", "Vivo Y28 5G = Vivo Y17S")
add("vivo_14", "Vivo", "Vivo T2 Pro = iQOO Z7 Pro")
add("vivo_15", "Vivo", "Vivo V15S = Vivo Y01")
add("vivo_16", "Vivo", "Vivo Y02 = Vivo Y02T")
add("vivo_17", "Vivo", "Vivo T1X = Vivo Y21 = Vivo Y33S")
add("vivo_18", "Vivo", "Vivo Y22 = Vivo Y35 = Vivo Y22S")
add("vivo_19", "Vivo", "Vivo Y30 = Vivo Y50")
add("vivo_20", "Vivo", "Vivo V5 = Vivo Y69")
add("vivo_21", "Vivo", "Vivo Y73S = Vivo V21E 4G = Vivo V20")
add("vivo_22", "Vivo", "Vivo Y36 = Vivo Y78")
add("vivo_23", "Vivo", "Vivo S1 = Vivo Z1X")
add("vivo_24", "Vivo", "Vivo Z1 Pro = Vivo Z5X")
add("vivo_25", "Vivo", "Vivo Y83 Pro = Vivo Y85 = Vivo V9")
add("vivo_26", "Vivo", "Vivo Y81 = Vivo Y83")
add("vivo_27", "Vivo", "Vivo Y19 = Vivo U20")
add("vivo_28", "Vivo", "Vivo Y90 = Vivo Y91C = Vivo Y91I")
add("vivo_29", "Vivo", "Vivo V20 = Vivo V20 Pro")
add("vivo_30", "Vivo", "Vivo V20 SE = Vivo Y70")
add("vivo_31", "Vivo", "Vivo V29 5G = Vivo V29 Pro 5G")
add("vivo_32", "Vivo", "Vivo Y72 5G = iQOO Z3 5G")
add("vivo_33", "Vivo", "Vivo T1 5G = Vivo Y75 5G = iQOO Z6 5G")
add("vivo_34", "Vivo", "Vivo Y100 = Vivo T2 5G")
add("vivo_35", "Vivo", "Vivo Y31 = Vivo Y51 = Vivo Y53S")
add("vivo_36", "Vivo", "Vivo Y77 5G = iQOO Z6 Lite")
add("vivo_37", "Vivo", "Vivo T2X = Vivo Y16 = Vivo Y56")
add("vivo_38", "Vivo", "Vivo V50 5G = Vivo V50E 5G")
add("vivo_39", "Vivo", "Vivo Y19S = Vivo Y29")
add("vivo_40", "Vivo", "Vivo Y12 = Vivo Y15 = Vivo Y17")
add("vivo_41", "Vivo", "Vivo Y93 = Vivo Y91 = Vivo Y95 = Vivo Y97")
add("vivo_42", "Vivo", "Vivo Y21 2021 = Vivo Y33S = Vivo T1X")
add("vivo_43", "Vivo", "Vivo Y17S = Vivo Y28S")
add("vivo_44", "Vivo", "Vivo V27 = Vivo V27 Pro")
add("vivo_45", "Vivo", "Vivo V29 = Vivo V29 Pro")
add("vivo_46", "Vivo", "Vivo T4R = iQOO Z10R = Vivo V50 = Vivo V50E")
add("vivo_47", "Vivo", "Vivo Y19E = Vivo T4 Lite = iQOO Z10 Lite")
add("vivo_48", "Vivo", "Vivo T4 5G = iQOO Z10 5G")
add("vivo_49", "Vivo", "Vivo T4X = iQOO Z10X = Vivo Y29 4G")
add("vivo_50", "Vivo", "Vivo Y29 = Vivo Y19S = Vivo Y19S Pro")
add("vivo_51", "Vivo", "Vivo Y85 = Vivo Y89 = Vivo Z3X = Vivo Z1 = Vivo Z1 Lite")

OUT.write_text(json.dumps(groups, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(groups)} groups -> {OUT}")
