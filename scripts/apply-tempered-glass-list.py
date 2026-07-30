"""Parse Universal Tempered Glass list into model_part_matrix.csv.

Adds Tempered_Glass_* columns. Each model is assigned to at most one group
(first listing wins) so overlapping supplier lists do not union-find merge.
"""
from __future__ import annotations

import csv
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
MATRIX = DATA / "model_part_matrix.csv"

# Source groups from supplier "Universal Tempered Glass List".
# Keys are stable group ids (list numbers; duplicates disambiguated).
RAW_GROUPS: dict[str, str] = {
    "2": "Vivo Y91 = Samsung A10 = Samsung A10S = Samsung M10 = Samsung M01S = Oppo A5S = Oppo A7 = Oppo A7N = Oppo A12 = Oppo A11K = Oppo A12S = Vivo Y90 = Vivo Y91C = Vivo Y91i = Vivo Y93 = Vivo Y93S = Vivo Y95 = Vivo Y97 = Vivo Y1S = Vivo V11 = Vivo V11i = Vivo Z3 = Vivo Z3i = Realme 3 = Realme 3i",
    "3": "Redmi 9 = Redmi 9A = Redmi 9C = Redmi 10A = Samsung F13 = Samsung M13 = Poco C3 = Poco C31 = Realme C31 = Redmi A2 = Samsung F23 5G = Samsung M23 = Samsung A23 = Samsung A13 = Realme C20 = Realme C21 = Redmi A2 Plus = Redmi A1 = Redmi A1 plus = Moto E13 = Poco C50 = Poco C51",
    "4": "Redmi 10C = Redmi 10 2022 = Redmi 11A = Redmi 10 POWER = Redmi 12C = Redmi A3 4G = Redmi A3 5G = Redmi A3X 4G = Redmi A3X 5G = Poco C40 = Poco C55 = Poco C61",
    "5": "Redmi 14C = Redmi 14R = Redmi A3 PRO = Redmi A4 = Redmi A5 4G = Poco C71 = Poco C75 = Poco M7",
    "6": "Vivo Y11 = Vivo Y12 = Vivo Y15 = Vivo Y17 = Vivo U10 = Vivo Y3",
    "7": "Realme C2 = Realme C2s = Oppo A1k = Itel A48",
    "8a": "Realme C11 = Realme 5 = Realme 5S = Realme 5i = Realme C20 = Realme C21 = Realme C3 = Realme C11 2021 = Realme C12 = Realme C15 = Realme C25S = Realme C25 = Realme C25Y = Realme C21Y = Realme C20A = Realme C30 = Realme C30S = Realme C31 = Realme C33 = Realme C35 = Realme 10 5G = Realme 10T = Realme 10S = Samsung M02S = Samsung F02S = Samsung A02 = Samsung M02 = Samsung A02S = Samsung A03S = Samsung A30 5G = Oppo A5 2020 = Oppo A9 2020 = Oppo A11 5G = Oppo A15 = Oppo A15S = Oppo A16 = Oppo A16S = Oppo A16K = Oppo A16E = Oppo A17 = Oppo A17K = Oppo A31 = Oppo A53S 5G = Oppo A55 5G = Oppo A54S = Oppo A56 5G = Oppo A57 = Oppo A57S = Oppo A58 = Oppo A77 = Oppo A77S = Oppo A78 = Oppo A1X = Oppo K10 5G = Infinix HOT 11 = Infinix HOT 12i = Infinix HOT 30i = Redmi 10A = Redmi 10 5G = Redmi A1 = Redmi A1+ = Redmi A2 = Redmi A2+ = Redmi NOTE 11E = Redmi NOTE 11R = Vivo Y01 = Vivo Y11 2023 = Vivo Y02A = Vivo Y02 = Vivo Y20 = Vivo Y20A = Vivo Y20G = Vivo Y20i = Vivo Y20T = Vivo Y22 5G = Vivo Y52 = Vivo Y55 5G = Vivo Y55S = Vivo Y56 = Vivo Y55 5G = Vivo Y56 5G = Vivo Y7E = Vivo Y22 = Vivo Y16 = Vivo Y02S = Realme Narzo 10 = Realme Narzo 10A = Realme Narzo 20 = Realme Narzo 20A = Realme Narzo 30A = Realme Narzo 50A = Realme Narzo 50A Prime = Vivo Y31 2020 = Vivo Y51 2020 = Vivo Y51A = Vivo Y12S = Vivo Y15S = Vivo Y31S = Vivo Y33 = Vivo Y33S = Vivo Y33T = Vivo Y33E = Vivo Y35 = Vivo Y21 2021 = Vivo Y21T = Vivo Y21e = Vivo Y53S = Vivo T1 5G = Vivo T1X = Vivo T2X = Samsung A32 5G = Samsung M32 5G = Samsung M33 = Samsung A12 = Samsung M12 = Samsung F12 = Samsung A13 = Samsung A13 5G = Samsung A23 5G = Samsung F23 5G = Samsung F13 = Samsung M13 = Samsung M13 5G = Samsung M23 = Samsung A03 = Samsung A03 CORE = Samsung A04 = Samsung A04S = Samsung A04 CORE = Tecno SPARK 6 GO = Tecno SPARK GO 2020 = Tecno Spark GO 2022 = Tecno Spark GO 2023 = Tecno SPARK 7 = Tecno Spark 8 = POCO M4 5G = POCO M5 = POCO C50 = Oneplus NORD N20 SE = Tecno SPARK 10C = Oppo A38 = Oppo A18 = Oppo A35 = Oppo A17S = Oppo A2X = Oppo A59 = Vivo Y03 = Vivo Y28 5G = Vivo Y18 = Vivo Y33 = Redmi 11 PRIME = Vivo Y18E = Vivo T3 LITE",
    "8b": "Redmi Note 8 Pro = Oppo F9 = Oppo F11 = Realme X2 Pro = Oneplus 7T = Samsung F34 5G = Samsung M34 5G = Samsung A24 = Samsung A25 5G",
    "9": "Redmi Note 7 = Redmi Note 7s = Redmi Note 7 Pro = Vivo S1 = Vivo S1 Pro = Vivo V11 = Vivo V11 Pro = Vivo X23 = Vivo Y7s = Vivo Y9s = Vivo Z1x",
    "10": "Realme C53 = Realme Narzo N53 = Realme Narzo N61 = Realme Narzo N63 = Realme C51 = Realme C51S = Realme C61 = Realme C63 4G = Realme NOTE 50 = Realme NOTE 60 = Realme NOTE 60X = Vivo Y04 = Vivo Y19 5G = Vivo Y19E = Vivo Y29S = Vivo T4 LITE = iQOO Z10 LITE = Vivo Y37C = Huawei NOVA Y70",
    "11": "Redmi 13c 4g = Redmi 13c 5g = Redmi 13R = Poco C65 = Poco M6 5g = Samsung F05 = Samsung M05 = Samsung A06s",
    "12": "Samsung F22 4G = Samsung M32 4G = Samsung A22 4G = Samsung A32 4G = Samsung A31 4G = Samsung M22 4G = Samsung A33 5G = Vivo Y100 = Vivo Y100A 4G = Vivo Y100A 5G = Vivo T2 5G = Vivo iQOO Z7 5G = Vivo Z7S 5G = Vivo V20 = Vivo V20SE = Vivo V21E = Vivo V21E 5G = Vivo V23E = Vivo V23E 5G = Vivo S10E = Vivo Y73 = Vivo Y73S = Vivo Y75 4G = Vivo Y71T = Vivo T1 = Vivo T1 44W = Vivo iQOO Z6 44W = Oppo A91 = Oppo F17 = Oppo A73 = Oppo F15 = Oppo Reno 3",
    "13": "Oppo F9 = Oppo F9 Pro = Oppo R17 = Oppo K1 = Oppo RX17 Pro = Realme XT = Realme X2 = Realme 2 Pro = Realme 3 Pro = Realme 5 Pro = Redmi 9 = Redmi 9 Lite = Xiaomi Mi CC9 = Oneplus 6T = Oneplus 7",
    "14": "Samsung A31 = Samsung A32 4G = Samsung A22 4G = Samsung F22 = Samsung M32 4G = Samsung M22 = Samsung A33 5G",
    "15": "Samsung A14 = Samsung A14 5G = Samsung F14 = Samsung M14",
    "16": "Infinix Hot 10S = Infinix Hot 10T = Infinix Hot 9 PLAY = Infinix Hot 10 PLAY = Infinix Hot 11 PLAY = Infinix Smart 5 = Infinix Smart 6 Pro = Infinix Smart 4 Plus = Infinix X688 = Tecno Pova NEO = Infinix Spark 7P = Poco C40 = Itel Vision 2 Plus = Infinix Hot 10S NFC = Infinix Hot 10T = Infinix Hot 11 PLAY",
    "17": "Tecno Spark 6 AIR = Tecno Spark 5 AIR = Tecno Spark Power 2 = Tecno Spark Power 2 AIR = Tecno Pouvoir 4 = Tecno LC7 = Tecno LC7S = Tecno Pouvoir 4 Pro",
    "18": "Oppo A3s = Oppo A5 = Realme 2 = Realme C1 = Oppo AX5 = Oppo A12e",
    "19": "Redmi 6a = Redmi 6 = Redmi 7a",
    "20": "Vivo Y71 = Vivo V7 Plus = Vivo Y79 = Oppo F5 = Oppo F5 Plus = Realme 1",
    "21": "Redmi Note 5 PRO = Redmi S2 = Redmi Y2 = Redmi Note 5 = Redmi 5 PLUS = Redmi A2 = Redmi 6X = Samsung A6 Plus = Samsung A605 = Samsung A7 2018 = Samsung A750 = Samsung A8 Plus = Samsung A730 = Samsung J4 Plus = Samsung J415 = Samsung J6 Plus = Samsung J4 CORE = Samsung J4 PRIME = Samsung J6 PRIME = Samsung J8 = Samsung J810 = Samsung J8 Plus = Samsung ON8 = Tecno Pop 2 Plus = Tecno Pop 4 = Infinix Hot 6 Pro = Infinix X608 = Huawei Y7 Pro 2018 = Honor 7C = Asus Zenfone MAX Pro M1",
    "22": "Redmi 5a = Redmi Go = Redmi 4x",
    "23": "Samsung M01 = Samsung A01",
    "24": "Samsung M01 Core = Samsung A01 Core",
    "25": "Redmi 6 Pro = Redmi A2 Lite",
    "26": "Samsung J6 = Samsung ON6 = Samsung A6 2018 = Samsung A8 = Samsung A530",
    "27": "Samsung J7 = Samsung J7 2016 = Samsung J7 2018 = Samsung J701F = Samsung J7 Core = Samsung J7 Neo = Samsung J7 NXT = Samsung J7 Prime = Samsung J7 Prime 2 = Vivo V5 Plus",
    "28": "Realme C55 = Realme 11x 5G = Oppo F23 5G = Oppo A58 4G = Realme Narzo N55 = Oppo A98 5G = OnePlus Nord CE3 Lite 5G = Realme 11 5G = Realme C67 5G = Oppo K11x = Oppo A1 5G = Realme Narzo 60x 5G = Oppo A79 5G = Realme 13 Pro Plus 5G = OnePlus Nord CE4 Lite = Realme 12 4G = Oppo A60 = Oppo A80 = Realme C65 4G = Realme C65 5G = Realme C63 5G = Oppo A40m = Realme Narzo N65 5G = Oppo A3 5G = Oppo A3x = Oppo A3x 5G = Oppo A3 Pro 5G = Oppo Reno 12x 5G = Oppo Reno 14x 5G = Realme 12 Lite = Realme Narzo 70X 5G = Vivo Y38 = Vivo T3X = Realme 12X = Realme 12 5G = Realme C65 = IQOO Z9X = Vivo Y58 = Oppo A3 Pro = Oppo K12X 5G = Realme 13 5G = Realme C75 = Oppo A3 = Realme 14X 5G = Vivo Y29 = Vivo Y19S = Realme V60 Pro = Realme P3X = Oppo A5 Pro 4G = Vivo T4X = Vivo Y39 5G = Realme Narzo 80X 5G = iQOO Z10X = Vivo Y19S PRO = Oppo A5 4G = Oppo A5 5G = Realme C73 5G = Realme Narzo 80 LITE = Oppo A5X 4G = Oppo A5X 5G = Oppo K13X = Oppo F23 = Oppo F23 Pro = OnePlus Nord N30 = OnePlus Nord N30 SE = Moto G35 5G = Moto G75",
    "29": "Oppo F19 = Oppo F19S = Oppo F19 PRO = Oppo F19 Pro Plus 5G = Oppo F21 Pro 4G = Oppo F21 Pro 5G = Oppo A74 4G = Oppo A94 4G = Oppo A94 5G = Oppo A95 4G = Oppo A95 5G = Realme 7 Pro = Realme X7 = Realme V15 5G = Realme Q2 Pro = Realme 8 = Realme 8 Pro = Realme 9 Pro Plus = Realme 9 4G = Oppo Reno 8 5G = Oppo Reno 8 Lite = Oppo Reno 7 4G = Oppo Reno 7 5G = Oppo Reno 7 SE 5G = Oppo Reno 7Z 5G = Oppo Reno 7 Lite = Oppo Reno 6Z = Oppo Reno 6 Lite = Oppo Reno 5 Lite = Oppo Reno 4 Lite = Oppo Reno 5Z = Oppo Reno 5F = Oppo Reno 4SE = Oppo Reno 4F = Oppo Reno 4 4G = Oppo Reno 4 5G = Oppo Reno 2 = Oppo A93 = Oppo F17 Pro = Oneplus Nord CE2 = Oppo Find X5 Lite 5G = Realme Narzo 50 Pro 5G = Realme A96 5G",
    "30": "Tecno Camon 16 = Tecno Camon 16 Pro = Tecno Spark 6 = Infinix Hot 10 = Infinix Hot 12 = Infinix Hot 12 Play = Infinix Hot 12 Play NFC = Infinix Hot 20 = Infinix Hot 20 Play = Tecno Pova = Tecno Pova 4 = Tecno Pova Neo 2 = Infinix Note 8i = Infinix X683 = Infinix Note 12i",
    "31": "Redmi 12 4G 2023 = Redmi 12 5G 2023 = Redmi 13 4G = Redmi 13 5G = Redmi 13X 4G = Redmi Note 12R 4G = Redmi Note 13R 4G = Poco M6 4G = Poco M6 Pro 5G = Poco M6 Plus",
    "32": "Infinix Hot 9 = Infinix Hot 40i = Tecno Spark 5 = Tecno Spark 5 Pro = Tecno Spark 7 Pro = Tecno Spark 20 = Tecno Spark 20C = Tecno Spark GO 2024 = Infinix Smart 8 = Infinix Smart 8 HD = Infinix X6525 = Infinix Smart 8 Pro = Infinix Smart 8 Plus = Tecno Camon 15 = Tecno Camon 16S = Tecno Camon 17 = Tecno Camon 18 Premier = Tecno Pop 8 = Samsung F52 5G = Samsung A21S = Moto E14 = Moto G04 = Moto G04S = Moto G24 = Moto G24 Power = Itel S24 = Itel RS4",
    "33": "Realme 6i = Oppo Reno 2Z = Oppo Reno 2F = Oppo K7X = Oppo A52 = Oppo A72 = Oppo A92 = Oppo A53 5G = Oppo A54 5G = Oppo A72 4G = Oppo A72 5G = Oppo A73 5G = Oppo A74 5G = Oppo A93 5G = Realme 6 = Realme 6S = Realme 7 4G = Realme 7 5G = Realme 8 5G = Realme X7 Pro = Realme Narzo 20 Pro = Realme Narzo 30 5G = Realme Narzo 30 Pro 5G = Redmi Note 10 5G = Redmi 10T 5G = Poco M3 Pro 4G = Poco M3 Pro 5G = Huawei Nova 7 5G = Huawei Nova 7 SE = Huawei Nova 10Z = Huawei P40 Lite 5G = Honor 30 = Honor 30S = Honor V30 = Realme 8S 5G = Realme 9 5G India = Oppo A93S 5G = Realme V5 5G = Realme V13 5G = Realme Q2 = Realme Q3 5G = Realme Q3i 5G = Oppo K7X 5G = Oppo K9X 5G = Samsung A11 = Samsung M11",
    "34": "Realme 7i = Realme 8i = Realme 9i = Realme C17 = Realme 9 5G = Realme 9 5G Global = Realme 9 Pro = Realme 9 5G Speed = Realme 9 SE 5G = Realme V25 5G = Realme 6 Pro = Realme Q3S = Realme Q3T = Realme Q5 5G = Realme X50 5G = Realme X3 = Realme X3 Super Zoom = Oppo K10 4G = Oppo K10 5G = Oppo K10X 5G = Oppo K9S = Oppo A11S = Oppo A32 = Oppo A33 2020 = Oppo A36 = Oppo A53 4G = Oppo A53S 4G = Oppo A54 4G = Oppo A55 4G = Oppo A76 = Oppo A92S = Oppo A96 = Oppo Reno 4Z 5G = Realme Narzo 50 4G = Samsung F52 5G = Oneplus Nord CE2 Lite 5G = Oneplus Ace Racing 5G",
    "35a": "Redmi Note 9 Pro = Redmi Note 9 Pro Max = Redmi Note 9S = Redmi Note 10 Lite = Redmi K30 = Redmi K30 5G = Redmi K30S = Redmi K30 Pro = Redmi K30 Pro Zoom = Poco X2 = Poco X3 = Poco X3 Pro = Poco X3 NFC = Poco M2 Pro = Poco F2 Pro = Redmi 10i 5G = Redmi 10T 5G = Redmi 10T Pro 5G = Redmi 10T Lite 5G = Redmi 11T = Redmi 11T Pro = iQOO Z5 = iQOO Z7X = iQOO Z8 = iQOO Z8X = iQOO Neo 5 = iQOO Neo 5 SE = Honor X10 Lite = Huawei P Smart 2021 = Realme GT 3 = Realme GT Neo 5 = Samsung A72 = Samsung A80 = Samsung A90 = Samsung M55 = Samsung C55 = Samsung F55 = Vivo Y100i = Vivo Y100T",
    "35b": "Redmi Note 10 = Redmi Note 10S = Redmi Note 11 = Redmi Note 11S = Redmi Note 12S = Samsung A51 = Samsung A52 = Samsung A52 5G = Samsung A52S 5G = Samsung A53 5G = Samsung M31S = Samsung S20 FE = Samsung S20 FE 2022 = Oppo A74 = Oppo A78 4G = Oppo A93 = Oppo A94 = Oppo A95 = Oppo A95 5G = Oppo F17 Pro = Oppo F19 = Oppo F19 Pro = Oppo F19 Pro Plus = Oppo F19S = Oppo F21 Pro = Oppo F21 Pro 5G = Oppo F21S Pro = Oppo Reno 3 Pro = Oppo Reno 4 = Oppo Reno 4 Lite = Oppo Reno 4F = Oppo Reno 5 Lite = Oppo Reno 5Z = Oppo Reno 6Z = Oppo Reno 7Z 5G = Oppo Reno 8 5G = Oppo Reno 8Z 5G = Oppo Reno 8T 4G = Realme 8 = Realme 8 Pro = Realme 9 = Realme 9 Pro Plus = Realme 10 4G = Realme 11 = Realme 11 2023 = Realme V15 = Realme X7 Max 5G = Realme X7 5G = Realme Narzo 60 = Poco M4 Pro = Poco M4 Pro 5G",
    "36": "Oppo F11 Pro = Oppo K3 = Realme X = Realme Narzo 2Z = Realme Narzo 2F = Redmi Note 9T = Redmi Note 9 = Redmi Note 9 5G = Redmi Note 10X 4G = Vivo Y70S = Vivo Y70T = Vivo Y51S 5G = Vivo Y50T = Vivo V15 = Vivo Y30 = Vivo Y50 = Vivo Z1 Pro = Vivo Z5X",
    "37": "Oneplus Nord = Oneplus 6T = Realme X2 = Realme XT = Vivo V11 = Vivo V11 Pro = Vivo X21S = Vivo X23 = Redmi 9 = Redmi 9 Lite = Redmi 9 Pro 4G = Redmi 9 Pro 5G",
    "38": "Oppo Reno 6 = Oppo Reno 5 = Oppo Reno 5 4G = Oppo Reno 5 5G = Oppo Reno 5K = Realme GT 5G = Realme GT Master = Realme GT Neo = Realme GT Neo Flash = Realme GT Neo 2T = Realme Q3 Pro 5G = Realme X7 Max 5G = Oneplus Nord CE 5G = Oneplus Nord 2 5G = Oneplus Nord 2T 5G = Oneplus Nord = Oppo K9 5G = Oppo Find X3 Lite = Oppo Reno 7 5G",
    "39": "iPhone 13 = iPhone 13 Pro = iPhone 14",
    "4b": "Redmi 9 Prime = Poco M2 = Redmi 9 = Samsung A20s",
}

KNOWN_BRANDS = [
    "Samsung", "Apple", "Xiaomi", "Redmi", "Realme", "Oppo", "Vivo", "OnePlus",
    "Oneplus", "Nokia", "Motorola", "Google", "Huawei", "Honor", "Infinix", "Tecno",
    "Lava", "Nothing", "Asus", "Sony", "Lenovo", "Poco", "POCO", "Itel", "Micromax",
    "iQOO", "IQOO", "Moto", "iPhone", "IPhone",
]

SKIP_TOKENS = {
    "",
    "501",
    "=",
}


def clean_token(tok: str) -> str | None:
    s = re.sub(r"\s+", " ", tok.strip())
    s = s.strip(" =/")
    if not s or s in SKIP_TOKENS:
        return None
    # Drop obvious garbage / bare codes without brand context already handled
    if re.fullmatch(r"\d{2,4}", s):
        return None
    return s


def split_group(raw: str) -> list[str]:
    parts = re.split(r"\s*=\s*", raw)
    out: list[str] = []
    seen: set[str] = set()
    for p in parts:
        t = clean_token(p)
        if not t:
            continue
        key = t.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(t)
    return out


def infer_brand_model(label: str) -> tuple[str, str]:
    s = re.sub(r"\s+", " ", label.strip())
    # Typo / alias fixes
    aliases = {
        "realme 31": "Realme 3i",
        "realme 51": "Realme 5i",
        "oppo y17s": "Oppo A17s",
        "vivo 2 5g": "Vivo Y22 5G",
        "vivo 5 5g": "Vivo Y55 5G",
        "vivo 6 5g": "Vivo Y56 5G",
        "vivo 7e": "Vivo Y7E",
        "vivo y201": "Vivo Y20i",
        "oneplus nord 7": "OnePlus Nord",
        "oneplus nord 6t": "OnePlus 6T",
        "oppo reno reno 5": "Oppo Reno 5",
        "redmi m19 lite": "Redmi 9 Lite",
        "poco 11 lite 5g": "Poco M4 Pro 5G",
        "honor 3s": "Honor 30S",
        "huawei 7se": "Huawei Nova 7 SE",
        "huawei x10 lite": "Honor X10 Lite",
        "realme k7x 5g": "Oppo K7X 5G",
        "realme k9x 5g": "Oppo K9X 5G",
        "oppo narzo 50 4g": "Realme Narzo 50 4G",
        "oppo 12 5g": "Oppo Reno 12 5G",
        "oppo 12x 5g": "Oppo Reno 12x 5G",
        "oppo 14x 5g": "Oppo Reno 14x 5G",
        "vivo t15g": "Vivo T1 5G",
        "redmi 11prime": "Redmi 11 Prime",
        "vivo y2001": "Vivo Y200",
    }
    low = s.lower()
    if low in aliases:
        s = aliases[low]

    brand = None
    model = s
    for p in sorted(KNOWN_BRANDS, key=len, reverse=True):
        if s.lower().startswith(p.lower() + " "):
            brand = p
            model = s[len(p) :].strip()
            break
        if s.lower() == p.lower():
            brand = p
            model = s
            break

    if brand is None:
        if s.lower().startswith("iphone"):
            brand, model = "Apple", s
        else:
            brand, model = "Unknown", s

    # Canonical brand names
    brand_map = {
        "oneplus": "OnePlus",
        "poco": "Poco",
        "iqoo": "iQOO",
        "moto": "Motorola",
        "iphone": "Apple",
    }
    brand = brand_map.get(brand.lower(), brand)
    if brand == "Apple" and model.lower().startswith("iphone"):
        # keep iPhone casing
        model = "iPhone" + model[6:] if model.lower().startswith("iphone") else model
        model = re.sub(r"^i[Pp]hone", "iPhone", model)

    if brand == "Motorola" and model.lower().startswith("moto "):
        model = model[5:].strip()

    # Samsung catalog uses Galaxy prefix
    if brand == "Samsung":
        m = model
        if m.lower().startswith("galaxy "):
            m = m[7:].strip()
        model = f"Galaxy {m}"

    # Matrix convention: Xiaomi brand + "Xiaomi Redmi …" model string for Redmi
    if brand == "Redmi":
        display_brand = "Xiaomi"
        display_model = f"Xiaomi Redmi {model}"
        return display_brand, display_model

    if brand == "Poco":
        return "POCO", f"POCO {model}" if not model.upper().startswith("POCO") else model

    if brand == "Apple":
        return "Apple", model if model.lower().startswith("iphone") else f"iPhone {model}"

    # Default matrix style: Brand + "Brand Model"
    if not model.lower().startswith(brand.lower()):
        display_model = f"{brand} {model}"
    else:
        display_model = model
    return brand, display_model


def matrix_key(brand: str, model: str) -> tuple[str, str]:
    return brand.lower(), model.lower()


def main() -> None:
    parsed: dict[str, list[tuple[str, str, str]]] = {}
    for gid, raw in RAW_GROUPS.items():
        labels = split_group(raw)
        entries: list[tuple[str, str, str]] = []
        for lab in labels:
            brand, model = infer_brand_model(lab)
            if brand == "Unknown":
                print(f"WARN skip unknown brand: {lab!r} (group {gid})")
                continue
            entries.append((brand, model, lab))
        parsed[gid] = entries

    # Assign each matrix model to first group only
    assignment: dict[tuple[str, str], str] = {}
    group_members: dict[str, list[tuple[str, str]]] = defaultdict(list)
    conflicts: list[str] = []

    for gid, entries in parsed.items():
        for brand, model, _lab in entries:
            key = matrix_key(brand, model)
            if key in assignment:
                if assignment[key] != gid:
                    conflicts.append(
                        f"{brand} {model}: kept group {assignment[key]}, skipped {gid}"
                    )
                continue
            assignment[key] = gid
            group_members[gid].append((brand, model))

    # Deduplicate within group
    for gid in list(group_members):
        seen: set[tuple[str, str]] = set()
        uniq: list[tuple[str, str]] = []
        for b, m in group_members[gid]:
            k = matrix_key(b, m)
            if k in seen:
                continue
            seen.add(k)
            uniq.append((b, m))
        group_members[gid] = uniq

    with MATRIX.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
        fieldnames = list(rows[0].keys()) if rows else []

    for col in ("Tempered_Glass_Count", "Tempered_Glass_SharedWith"):
        if col not in fieldnames:
            fieldnames.append(col)

    index = {matrix_key(r["Brand"], r["Model"]): r for r in rows}

    not_researched = "Not researched yet — add from supplier catalog"

    # Ensure columns on existing rows
    for r in rows:
        r.setdefault("Tempered_Glass_Count", "-")
        r.setdefault("Tempered_Glass_SharedWith", not_researched)
        if not r.get("Tempered_Glass_SharedWith"):
            r["Tempered_Glass_SharedWith"] = not_researched
            r["Tempered_Glass_Count"] = "-"

    # Reset tempered columns then fill from groups
    for r in rows:
        r["Tempered_Glass_Count"] = "-"
        r["Tempered_Glass_SharedWith"] = not_researched

    added_models = 0
    updated = 0
    for gid, members in group_members.items():
        if len(members) < 2:
            print(f"WARN group {gid} has <2 models after cleanup: {members}")
            continue
        count = str(len(members))
        for brand, model in members:
            # SharedWith uses full Model strings (same style as existing matrix rows)
            shared = "; ".join(
                om
                for ob, om in members
                if matrix_key(ob, om) != matrix_key(brand, model)
            )
            key = matrix_key(brand, model)
            if key not in index:
                row = {c: "" for c in fieldnames}
                row["Brand"] = brand
                row["Model"] = model
                for prefix in (
                    "Display_Combo",
                    "Battery",
                    "OCA_Glass",
                    "Pouch_BackPanel",
                    "Charging_Board",
                ):
                    row[f"{prefix}_Count"] = "-"
                    row[f"{prefix}_SharedWith"] = not_researched
                # Default pouch assumption used elsewhere
                row["Pouch_BackPanel_Count"] = "1"
                row["Pouch_BackPanel_SharedWith"] = (
                    "Not shared — model-specific part (default assumption)"
                )
                rows.append(row)
                index[key] = row
                added_models += 1
            row = index[key]
            row["Tempered_Glass_Count"] = count
            row["Tempered_Glass_SharedWith"] = shared
            updated += 1

    # Sort for stability
    rows.sort(key=lambda r: (r["Brand"].lower(), r["Model"].lower()))

    with MATRIX.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in fieldnames})

    print(
        f"OK groups={len(group_members)} updated_rows={updated} "
        f"added_models={added_models} conflicts={len(conflicts)} "
        f"matrix_rows={len(rows)}"
    )
    if conflicts:
        print(f"--- first {min(40, len(conflicts))} conflicts ---")
        for line in conflicts[:40]:
            print(line)


if __name__ == "__main__":
    main()
