"""One-shot builder: writes data/universal_oca_glass.json from supplier OCA lists."""
from __future__ import annotations

import json
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "data" / "universal_oca_glass.json"

groups: list[dict[str, str]] = []


def add(gid: str, brand: str, models: str) -> None:
    models = " ".join(models.split())
    if models.strip("= "):
        groups.append({"id": gid, "brand": brand, "models": models})


# ---- Moto / Micromax / Lava ----
add("moto_1", "Motorola", "Moto G22 = Moto G32 = Moto E32s")
add("mmx_2", "Micromax", "Micromax In 2b = Micromax Z32")
add(
    "lava_3",
    "Lava",
    "Lava LXX507 = Lava LZX415 = Lava Yuva 4 = Lava LZX417 = Lava 03 Pro = Lava Yuva 3 = Lava Blaze 2 5G",
)
add("moto_4", "Motorola", "Moto Edge 50 Fusion = Moto G85")
add("moto_5", "Motorola", "Moto G32 = Moto G73")
add("moto_6", "Motorola", "Moto G31 = Moto G41 = Moto G71")
add("moto_7", "Motorola", "Moto G14 = Moto G54 = Moto G64 = Moto G55 = Moto G54 5G")
add("moto_8", "Motorola", "Moto G60 = Moto G60s = Moto G51 5G = Moto G40 Fusion")
add("lava_9", "Lava", "Lava Z61 = Lava 88 = Lava Z61 2GB")
add("moto_10", "Motorola", "Moto G45 5G = Moto G34 = Moto G53 = Moto G23 = Moto G13")
add(
    "lava_11",
    "Lava",
    "Lava Storm Play = Lava Bold N1 = Lava LXX517 = Lava LXX522 = Lava LZG410 = Lava Yuva Star 2",
)
add("moto_12", "Motorola", "Moto E7 Power = Moto E7 = Moto E7i")
add("moto_13", "Motorola", "Moto G22 = Moto E32 = Moto E32s")
add(
    "lava_14",
    "Lava",
    "Lava Blaze 4G = Lava Blaze Nxt = Lava Blaze Pro 4G = Lava X3 = Lava Yuva = Lava LZX403 = Lava LZX407 = Lava LZX404 = Lava LZG403 = Lava LZG408",
)
add("moto_15", "Motorola", "Moto G52 = Moto G82 = Moto G71s")
add("moto_16", "Motorola", "Moto G10 = Moto G20 = Moto G30 = Moto G10 Power")
add("moto_17", "Motorola", "Moto G04 = Moto G24 = Moto G24 Power = Moto E14")
add("moto_18", "Motorola", "Moto E7 Plus = Moto G9 Play = Moto G9")
add("moto_19", "Motorola", "Moto Edge 30 Fusion = Moto S30 Pro")
add("moto_20", "Motorola", "Moto G13 = Moto G23")
add(
    "lava_21",
    "Lava",
    "Micromax In 1b = Lava Z2 = Lava Z3 = Lava Z4 = Lava Z2s = Lava Z3 Pro = Lava X2 = Lava Z2c = Lava X2 Pro",
)
add("moto_22", "Motorola", "Moto E30 = Moto E40")
add("moto_23", "Motorola", "Moto G7 = Moto G7 Plus")
add("lava_24", "Lava", "Lava Storm 5G = Lava Blaze Pro 5G = Lava LXX506 = Lava LXX508")

# ---- Vivo ----
add("vivo_1", "Vivo", "Vivo Y11 = Vivo Y12 = Vivo Y15 = Vivo Y17 = Vivo U10 = Vivo Y3")
add(
    "vivo_2",
    "Vivo",
    "Vivo Y20 = Vivo Y21 = Vivo Y21s = Vivo Y21a = Vivo Y21e = Vivo Y21t = Vivo Y21g = Vivo Y02s = Vivo Y16 = Vivo Y30 5G = Vivo Y15a = Vivo Y15c = Vivo Y32 = Vivo Y33 5G = Vivo Y20g = Vivo Y12g = Vivo Y01 = Vivo Y22 = Vivo Y17s = Vivo Y22s = Vivo Y22 New = Vivo Y28 5G = Vivo Y33t = Vivo Y36i = Vivo Y36 = Vivo Y12 New = Vivo T2x 5G = Vivo Y56 = Vivo Y55s = Vivo Y77 5G = Vivo Y72 5G = Vivo Y72t = Vivo Y56 5G = Vivo Y75 5G = Vivo T1 5G = iQOO Z6 5G = iQOO Z6 Lite 5G = Vivo Y20a = Vivo Y20t = Vivo Y20s = Vivo Y20i = Vivo Y20sg = Vivo Y12s = Vivo Y12a = Vivo Y20e = Vivo Y30g = Vivo Y31s 5G = Vivo Y11s = Vivo Y12d = Vivo Y15s = iQOO U1x = Vivo Y51 2020 = Vivo Y31 2020 = Vivo Y73 = Vivo Y72s = Vivo Y53s = iQOO Z3 = iQOO U3 = iQOO U3x = Vivo Y33s = Vivo Y31 = Vivo Y55s 5G = Vivo Y76 5G = Vivo Y76s 5G = Vivo T1x = Vivo Y03 = Vivo Y18 = Vivo T3 Lite 5G = Vivo Y28s 5G = Vivo Y18e = Vivo Y18i = Vivo Y18s = iQOO Z9 Lite 5G = Vivo Y28e 5G = Vivo Y03t = Vivo Y52s = Vivo Y72 = Vivo Y51",
)
add("vivo_4", "Vivo", "Vivo Y19 = Vivo U20 = Vivo Y5s = Vivo U3x = iQOO Z5i")
add("vivo_5", "Vivo", "Vivo V40E = Vivo T3 Pro = iQOO Z9s = iQOO Z9s Pro")
add("vivo_6", "Vivo", "Vivo Y91 = Vivo Y91i = Vivo Y90 = Vivo Y91c = Vivo Y93 = Vivo Y95 = Vivo Y1s")
add("vivo_7", "Vivo", "Vivo Y19e = Vivo Y04 = Vivo Y19 5G = Vivo Y29s 5G")
add("vivo_8", "Vivo", "Vivo Y79 = Vivo V7 Plus = Vivo Y79a")
add("vivo_9", "Vivo", "Vivo Y02 = Vivo Y02t = Vivo Y02 New = Vivo Y02a")
add("vivo_10", "Vivo", "Vivo Y71 = Vivo Y71i = Vivo V7")
add("vivo_11", "Vivo", "Vivo S1 = Vivo S1 Pro = Vivo Z1x = Vivo Y7s")
add("vivo_12", "Vivo", "Vivo V17 = Vivo V19 Neo")
add("vivo_13", "Vivo", "Vivo Z1 Pro = Vivo Z5x")
add("vivo_14", "Vivo", "Vivo V28 = Vivo Y73 = Vivo V23e 5G = Vivo Y75 4G")
add(
    "vivo_15",
    "Vivo",
    "Vivo V20 = Vivo V21e 4G = Vivo V21e 5G = Vivo V20 2021 = Vivo V21 4G = Vivo V23e = Vivo Y73 4G = Vivo S6 = Vivo Y75 4G = iQOO Z6 4G = Vivo Y75 = Vivo V21e = Vivo Y70 = Vivo X50 Lite = Vivo Y55 = Vivo Y51 OLED",
)
add("vivo_16", "Vivo", "Vivo Y200 5G = Vivo T3 = Vivo Y300 = Vivo Y200e = iQOO Z6 5G")
add("vivo_17", "Vivo", "Vivo T1 Pro = Vivo V25e 5G = Vivo V25 5G = Vivo V21 5G = Vivo S15e = Vivo S9e")
add("vivo_18", "Vivo", "Vivo V11 = Vivo V11i = Vivo Z3i = Vivo Y97 = Vivo Z3")
add("vivo_19", "Vivo", "Vivo Y81 = Vivo Y81i = Vivo Y83 = Vivo Y83 Pro = Vivo Y81s")
add("vivo_20", "Vivo", "Vivo V9 = Vivo V9 Youth = Vivo V9 Pro = Vivo Y85")
add("vivo_21", "Vivo", "Vivo X30 5G = Vivo X30 Pro 5G")
add("vivo_22", "Vivo", "iQOO Z6 5G = iQOO Z6 Lite 5G")
add(
    "vivo_23",
    "Vivo",
    "Vivo T4x 5G = iQOO Z10x 5G = Vivo T3x 5G = Vivo Y58 5G = iQOO Z9x = Vivo Y200i 5G",
)
add(
    "vivo_24",
    "Vivo",
    "Vivo Y200 5G = Vivo Y200e 5G = Vivo Y100 = Vivo T3 5G = Vivo V29E = Vivo V30 Lite = Vivo V40 Lite",
)
add("vivo_25", "Vivo", "Vivo Y27 5G = Vivo Y27s = Vivo Y35 Plus = Vivo Y27 4G = Vivo Y36 4G")
add("vivo_26", "Vivo", "Vivo Y35 = Vivo Y35 New")
add(
    "vivo_27",
    "Vivo",
    "Vivo V21e 5G = Vivo S10e = Vivo S6 = Vivo S7e = Vivo Y73s = Vivo Y71t = Vivo Y55 4G = Vivo X50 = Vivo G1",
)
add("vivo_28", "Vivo", "Vivo Y100 = Vivo Y100A = Vivo T2 5G = iQOO Z7 5G")
add("vivo_29", "Vivo", "Vivo Y28 4G = Vivo Y38 5G = Vivo Y19S")
add(
    "vivo_30",
    "Vivo",
    "Vivo V27 5G = Vivo S16 = Vivo Y78 Plus = Vivo V29e = Vivo V29 Lite 5G = Vivo Y200 Pro = Vivo T2 Pro 5G = Vivo V27 Pro 5G = Vivo V29 SE 5G = Vivo Y78 5G = Vivo V30e 5G = Vivo Y300 Plus 5G = iQOO Z7 Pro = Vivo S16 Pro = Vivo S17e",
)
add("vivo_31", "Vivo", "Vivo Y30 4G = Vivo Y50 = Vivo Y30i = Vivo Y50s = Vivo Y70t")
add("vivo_32", "Vivo", "Vivo V5 = Vivo Y67")
add(
    "vivo_33",
    "Vivo",
    "Vivo Y78T = Vivo Y78 = iQOO Z8 = iQOO Z8X = Vivo Y100i = iQOO Z7X = Vivo Y36 5G = Vivo Y36 Global",
)
add("vivo_34", "Vivo", "Vivo V15 Pro = Vivo X27")
add("vivo_35", "Vivo", "Vivo V11 Pro = Vivo X23")
add("vivo_36", "Vivo", "Vivo V20 Pro = Vivo S7 = Vivo S7T")
add("vivo_37", "Vivo", "Vivo V23 5G = Vivo S9 = Vivo S10 = Vivo S10 Pro = Vivo S12 Pro")
add("vivo_38", "Vivo", "Vivo X60 = Vivo X70 = Vivo V2045")
add("vivo_39", "Vivo", "iQOO 7 = iQOO Neo 5s = iQOO Neo 5 = Vivo S15")

# ---- Realme / Oppo / OnePlus ----
add(
    "oppo_1",
    "Realme",
    "Realme 6 = Realme 6i = Realme 7 = Realme 6s = Realme Narzo 20 Pro = Realme Narzo 30 = Realme 8 5G = Realme 8s 5G = Realme Narzo 30 5G = Oppo A93 = Realme Q3i = Oppo A93s 5G = Realme V13 5G = Oppo K9x = Realme 9 5G = Oppo A52 = Oppo A72 = Oppo A92 = Oppo A52 2020 = Oppo A92 2020 = Oppo A72 2020 = Realme Narzo 30 Pro = Oppo A72 5G = Oppo A73 5G = Oppo A53 5G = Oppo A92 5G",
)
add(
    "oppo_2",
    "Realme",
    "Realme XT = Realme K5 = Oppo K1 = Oppo Reno Z = Oppo R15x = Realme X2",
)
add("oppo_3", "Realme", "Realme C2 = Oppo A1k")
add("oppo_4", "Oppo", "Oppo A3s = Oppo A5 = Realme 2 = Realme C1 = Oppo AX5 = Oppo A12e")
add("oppo_5", "Oppo", "Oppo F1s = Oppo A59")
add("oppo_6", "Oppo", "Oppo Find X6 = OnePlus 11R = OnePlus ACE 2")
add("oppo_7", "Realme", "Realme 2 Pro = Realme U1 = Oppo F9 = Oppo F9 Pro")
add(
    "oppo_8",
    "Oppo",
    "Oppo A53 = Oppo A53s = Oppo A53 2020 = Oppo A54 4G = Oppo A55 4G = Oppo A11s = Realme Narzo 20 = Realme 7i = Oppo A33 = Oppo A54 = Oppo A32 = Realme C17 = OnePlus Nord N100 = Realme 8i = Realme 9i = Oppo A96 = Realme Narzo 50 = Oppo K10 = Realme 9 Pro 5G = Realme 9 Pro = OnePlus Nord CE 2 Lite 5G = Oppo A76 = Oppo A36",
)
add("oppo_9", "Realme", "Realme Narzo N53 = Realme C53 = Realme C51 = Realme Note 50")
add("oppo_10", "Realme", "Realme C30 = Realme C30s = Realme C33 = Realme Narzo 50i Prime = Realme C30f")
add(
    "oppo_11",
    "Realme",
    "Realme C25 = Realme C25s = Realme Narzo 50A = Oppo A16 = Oppo A16s = Oppo A54s = Oppo A54 = Oppo A53s 5G = Oppo A55 5G = Oppo A56 5G = Realme C11 = Realme C12 = Realme C15 = Realme Narzo 20 = Realme Narzo 30A = Oppo A15 = Oppo A15s = Oppo A16e = Oppo A16k = Realme Q2i 5G = Realme C21Y = Realme C25Y = Realme C35 = Realme Narzo 50A Prime = Oppo A18 = Oppo A38 = Oppo A59 5G = Oppo A57 5G = Oppo A57s = Oppo A57a = Oppo A77 = Oppo A77s = Oppo K10 5G = Oppo A17 = Oppo A17k = Oppo A57 2020 = Oppo A58 5G = Oppo A78 5G = OnePlus Nord N20 SE = Oppo A58x 5G = Oppo A56s 5G = Oppo A57e = Oppo A2x 5G = Oppo A3b = Oppo A1x 5G = Oppo A2m 5G = OnePlus Nord N300 5G = Oppo A77 5G = Realme C3 = Oppo A5 2020 = Oppo A9 2020 = Oppo A31 2020 = Realme 5 = Realme 5s = Realme 5i = Realme Narzo 10A = Realme Narzo 20A",
)
add("oppo_12", "Realme", "Realme C20 = Realme C11 2021 = Realme Narzo 50i = Realme C21")
add(
    "oppo_13",
    "Oppo",
    "Oppo A5s = Oppo A7 = Oppo A12 = Oppo A11k = Realme 3 = Realme 3i = Oppo A21 = Oppo A20 = Oppo A22 = Oppo A24",
)
add(
    "oppo_14",
    "Realme",
    "Realme C55 = Realme 11x 5G = Oppo F23 5G = Oppo A58 4G = Realme Narzo N55 = Oppo A98 5G = OnePlus Nord CE3 Lite 5G = Realme 11 5G = Realme C67 5G = Oppo K11x = Oppo A1 5G = Realme Narzo 60x 5G = Oppo A79 5G = Realme 13 Pro Plus 5G = OnePlus Nord CE4 Lite = Realme 12 4G = Oppo A60 = Oppo A80 = Realme C65 4G = Realme C65 5G = Realme C63 5G = Oppo A40m = Realme Narzo N65 5G = Oppo A3 5G = Oppo A3x = Oppo A3x 5G = Oppo A3 Pro 5G = Oppo Reno 12x 5G = Oppo Reno 14x 5G",
)
add("oppo_15", "Realme", "Realme 6 Pro = Oppo A92s = Oppo Reno 4Z 5G")
add("oppo_16", "Realme", "Realme 12 5G = Realme 12x 5G = Realme C67 4G = Realme Narzo 70x 5G")
add("oppo_17", "Oppo", "Oppo Reno 3 Pro 5G = Oppo Reno 4 Pro 5G = OnePlus 8 = Oppo Find X2 Neo 5G")
add("oppo_18", "Realme", "Realme 1 = Oppo F5 Youth")
add("oppo_19", "OnePlus", "OnePlus 9R = OnePlus 8T")
add("oppo_20", "Oppo", "Oppo K3 = Oppo Reno 2Z = Oppo Reno 2F = Realme X")
add("oppo_21", "Oppo", "Oppo A54 5G = Oppo A74 5G = Oppo A93 5G = Realme Q3 = OnePlus Nord N200")
add("oppo_22", "OnePlus", "OnePlus Nord = Realme X50 Pro")
add(
    "oppo_23",
    "Oppo",
    "Oppo F19 = Oppo F19 Pro = Oppo F19s = Oppo A95 4G = Oppo A95 5G = Oppo A94 5G = Oppo A96 5G = Oppo Reno 5Z = Oppo Reno 7Z = Oppo Reno 6Z = Oppo Reno 8Z = Oppo Reno 5F = Oppo Reno 5 Lite = Oppo Reno 6 Lite = Oppo Reno 7 Lite = Oppo Reno 8 Lite = Oppo A94 4G = Oppo A74 4G = Realme X7 = Realme X7 5G = Realme 7 Pro = Realme Q2 5G = Realme V15 = Oppo Reno 4 SE 5G = Realme 8 = Realme 8 Pro = Oppo F21 Pro 5G",
)
add(
    "oppo_24",
    "Oppo",
    "Oppo F15 = Oppo F17 = Oppo A73 = Oppo Reno 3 = Oppo A91 = Oppo K7 = Oppo Reno 3 SE = Oppo Find X2 Lite",
)
add("oppo_25", "Realme", "Realme 9i 5G = Realme 10 5G = Realme 10s")
add(
    "oppo_26",
    "OnePlus",
    "OnePlus 10R 5G = OnePlus 10T 5G = Oppo Reno 8 Pro 5G = OnePlus ACE = Realme GT Neo 3",
)
add(
    "oppo_27",
    "Oppo",
    "Oppo Reno 7 4G = Realme 11 4G = Oppo Reno 7 5G = Oppo Reno 8 4G = Oppo Reno 8 5G = Realme 9 4G = Realme 9 Pro Plus 5G = Realme 10 4G = Oppo F21 Pro 4G = Oppo F21s Pro 5G = Oppo Find X5 Lite 5G = OnePlus Nord CE2 5G = Oppo A78 4G = Oppo Reno 8T = Realme Narzo 50 Pro 5G",
)
add("oppo_28", "Realme", "Realme C63 4G = Realme C61 = Realme Narzo N63")
add(
    "oppo_29",
    "OnePlus",
    "OnePlus 9RT = Oppo Reno 8 Pro = Oppo K10 Pro = Realme GT 2 = Realme GT Neo 2 = Realme GT Neo 3T",
)
add("oppo_30", "Realme", "Realme X Super Zoom = Realme X50 5G = Realme X3")
add("oppo_31", "Oppo", "Oppo A9 = Oppo F11 = Oppo A9x")
add("oppo_32", "Realme", "Realme P3x = Realme 14x = Realme C75 4G = Realme C75 5G = Realme C75x")
add(
    "oppo_33",
    "Oppo",
    "Oppo K12x = OnePlus Nord CE4 Lite 5G = Oppo F27 5G = Oppo Reno 12F = Oppo Reno 12FS = Oppo Reno 12FS 5G = Oppo Reno 12F 5G = Realme 12 = Realme 13 Plus 5G = Realme Narzo 70 Turbo = Realme 13 Pro = Realme 13 4G = Oppo Reno 13F = Oppo Reno 13F 5G",
)
add("oppo_34", "Oppo", "Oppo Reno 5 = OnePlus Nord 2")
add(
    "oppo_35",
    "Oppo",
    "OnePlus Nord CE4 Lite = Oppo Reno 12F 4G = Oppo Reno 12F 5G = Realme Narzo 70 Pro = Oppo F27 = Oppo Reno 12FS 4G = Oppo Reno 12FS 5G = Realme 12 Plus = Realme Narzo 70 = Realme P1 5G = Realme 12 Plus 5G = Realme Narzo 70 5G = Realme P3 5G = Realme Narzo 70 Pro 5G = Realme 13 Plus 5G = Realme 13 4G = Realme 12 4G = Realme Narzo 70 Turbo = Realme P1 Speed 5G = Realme 14 5G = Realme Neo 7x = Oppo K12x",
)
add(
    "oppo_36",
    "Oppo",
    "Oppo Reno 5 4G = Oppo Reno 5 5G = Oppo Reno 6 5G = Oppo Reno 6 4G = OnePlus Nord 2 5G = OnePlus Nord CE 5G = OnePlus Nord 2T 5G = Realme GT Master Edition = Realme X7 Max 5G = Realme GT Neo 2T 5G = Realme GT Neo Flash = Realme Q3 Pro = Realme GT = Realme GT Neo = Oppo Find X3 Lite 5G",
)
add(
    "oppo_37",
    "Realme",
    "Realme 15x 5G = Realme C85 5G = Oppo A6s 5G = Oppo A6 5G = Oppo A6x 5G = Oppo K14 5G = Oppo A6t = Oppo A6t 5G = Oppo A90x 5G = Oppo A6 Pro 5G = Oppo A6i Plus 5G = Oppo A6v 5G",
)

# ---- Redmi / Poco / Xiaomi ----
add(
    "redmi_1",
    "Redmi",
    "Redmi A1 New = Poco C50 = Redmi A1 = Redmi A1 Plus = Redmi A2 = Redmi A2 New = Redmi A2 Plus",
)
add("redmi_2", "Redmi", "Redmi 10 Prime = Redmi 10 4G = Redmi Note 11 4G")
add("redmi_3", "Redmi", "Redmi 9 = Redmi 9 Prime = Poco M2")
add(
    "redmi_4",
    "Redmi",
    "Redmi Note 11 4G = Poco M4 Pro 4G = Redmi Note 11 = Redmi Note 11s = Redmi Note 12s = Redmi Note 11 5G = Redmi Note 11T 5G = Redmi Note 11s 5G = Poco M4 Pro 5G",
)
add(
    "redmi_5",
    "Redmi",
    "Poco C55 = Redmi 12C = Poco C40 = Redmi 10 = Redmi 10C = Redmi 10 Power = Redmi 11A",
)
add("redmi_6", "Redmi", "Redmi 5A = Redmi Go")
add("redmi_7", "Redmi", "Redmi 6A = Redmi 6")
add(
    "redmi_8",
    "Redmi",
    "Redmi 9A = Redmi 9AT = Redmi 9A Sport = Redmi 9i Sport = Xiaomi Mi 10A = Redmi 9C = Poco C3 = Poco C31 = Redmi 9i = Redmi 10A",
)
add(
    "redmi_9",
    "Redmi",
    "Redmi 12 5G = Redmi 12 4G = Redmi 13 4G = Redmi 13 5G = Redmi 13X 4G = Poco M6 Pro 5G = Poco M6 Plus 5G = Poco M6 4G = Redmi Note 12R = Redmi Note 13R = Redmi 12 New",
)
add("redmi_10", "Redmi", "Redmi 9 Power = Poco M3 = Redmi Note 9 4G = Redmi 9T")
add("redmi_11", "Redmi", "Redmi Note 9 Pro = Redmi Note 9 Pro Max = Poco M2 Pro = Redmi Note 10 Lite")
add("redmi_12", "Redmi", "Redmi 7 = Redmi Y3")
add("redmi_14", "Redmi", "Redmi Note 10T 5G = Redmi Note 10 5G = Redmi Note 11 SE = Poco M3 Pro 5G")
add(
    "redmi_15",
    "Redmi",
    "Redmi Note 11E = Poco M4 5G = Redmi 11R = Xiaomi Mi 10 5G = Redmi 11 Prime = Poco M5 = Redmi 10 5G = Redmi Note 11R = Redmi Note 11 Prime 4G",
)
add("redmi_16", "Redmi", "Redmi Note 13 4G = Redmi Note 14 5G = Redmi Note 14 4G = Poco M7 Pro 5G")
add("redmi_17", "Redmi", "Redmi Note 7 = Redmi Note 7 Pro = Redmi Note 7s")
add("redmi_18", "Redmi", "Poco X3 = Xiaomi Mi 10i = Redmi Note 9 Pro 5G = Poco X3 Pro")
add("redmi_19", "Redmi", "Redmi 13C 4G = Redmi 13C 5G = Redmi 13C = Poco M6 5G = Poco C65")
add("redmi_20", "Redmi", "Redmi A3 New = Poco C61 = Redmi A3X")
add("redmi_21", "Redmi", "Redmi Note 12 4G = Redmi Note 12 5G = Poco X5 5G = Redmi Note 12")
add(
    "redmi_22",
    "Redmi",
    "Redmi Note 10 Pro = Redmi Note 10 Pro Max = Redmi Note 11 Pro 4G = Redmi Note 11 Pro 5G = Poco X4 Pro 5G = Xiaomi Mi 11i 5G = Redmi Note 11 Pro Plus",
)
add("redmi_23", "Redmi", "Redmi Note 12 Pro = Redmi Note 12 Pro Plus = Poco X5 Pro")
add("redmi_24", "Redmi", "Redmi Note 13 = Redmi Note 14")
add("redmi_25", "Redmi", "Redmi S2 = Redmi Y2")
add("redmi_26", "iQOO", "iQOO 5 5G = iQOO Z5 5G")
add("redmi_27", "Redmi", "Redmi 14C = Redmi 14R = Redmi A4 = Redmi A3 Pro = Poco C75 = Redmi 14 New")
add(
    "redmi_28",
    "Redmi",
    "Redmi 11X Pro = Redmi 11i = Poco F3 = Poco F4 = Poco F3 Pro = Redmi K40 = Redmi K40 Pro = Redmi K40 Pro Plus = Redmi K40s = Xiaomi Mi 11x",
)
add("redmi_29", "Redmi", "Redmi K20 = Redmi K20 Pro = Xiaomi Mi 9T = Xiaomi Mi 9T Pro")
add("redmi_30", "Redmi", "Redmi K30s = Xiaomi Mi 10T = Xiaomi Mi 10T Pro")
add("redmi_31", "Redmi", "Redmi K60 = Redmi K60 Pro = Poco F5 Pro")
add("redmi_32", "Redmi", "Redmi Note 10 4G = Redmi Note 10s 4G = Redmi Note 11 SE 4G = Poco M5s")
add("redmi_33", "Redmi", "Redmi Note 13 Pro 5G = Redmi K70E = Poco X6 5G = Poco X6 Pro 5G")
add("redmi_34", "Redmi", "Redmi 8 = Redmi 8A = Redmi 8A Dual")
add("redmi_35", "Redmi", "Redmi 6 Pro = Redmi A2 Lite")
add("redmi_36", "Redmi", "Redmi A2 = Redmi 6X")
add("redmi_37", "Redmi", "Redmi 10 Prime = Xiaomi Mi 10 4G Global")
add("redmi_38", "Redmi", "Poco X2 = Poco X2 Pro = Redmi K30 = Redmi K30i = Poco F2")
add("redmi_39", "Redmi", "Poco F5 = Redmi Note 12 Turbo = Redmi Note 13 5G")
add("redmi_40", "Redmi", "Redmi K50 = Redmi K50 Pro = Redmi K60E")
add("redmi_41", "Redmi", "Redmi 13T = Redmi 13T Pro = Redmi K60 Ultra")
add("redmi_42", "Redmi", "Redmi 11T = Redmi 11T Pro")
add(
    "redmi_43",
    "Redmi",
    "Redmi 11 Lite 5G = Redmi 11 Lite = Redmi 11 Lite 4G = Redmi 11 Lite NE",
)

# ---- Samsung ----
add("sam_1", "Samsung", "Samsung A32 4G = Samsung M32 4G")
add("sam_2", "Samsung", "Samsung F22 = Samsung A22 4G = Samsung M22")
add(
    "sam_3",
    "Samsung",
    "Samsung M23 5G = Samsung A12 = Samsung M12 = Samsung F12 = Samsung A02 = Samsung M02 = Samsung A32 5G = Samsung A125 = Samsung M127 = Samsung A022 = Samsung M022 = Samsung A326 = Samsung M326",
)
add("sam_4", "Samsung", "Samsung M11 = Samsung A11")
add(
    "sam_5",
    "Samsung",
    "Samsung A04s = Samsung A23 = Samsung A13 5G = Samsung A136 = Samsung A047 = Samsung A047F",
)
add(
    "sam_6",
    "Samsung",
    "Samsung A04e = Samsung A02s = Samsung A03s = Samsung M02s = Samsung A03 = Samsung A04 = Samsung F04 = Samsung F02s",
)
add("sam_7", "Samsung", "Samsung J6 Plus = Samsung J4 Plus")
add("sam_8", "Samsung", "Samsung A10 = Samsung M10 = Samsung A10s")
add("sam_9", "Samsung", "Samsung A30 = Samsung A50 = Samsung A30s = Samsung A50s")
add("sam_10", "Samsung", "Samsung A15 = Samsung A15 5G = Samsung F15 = Samsung M15")
add(
    "sam_11",
    "Samsung",
    "Samsung M21 = Samsung M21s = Samsung M30 = Samsung M30s = Samsung M31 = Samsung F41 = Samsung M31s = Samsung M305 = Samsung M315 = Samsung M307 = Samsung F415",
)
add("sam_12", "Samsung", "Samsung F62 = Samsung M62 = Samsung A71 4G = Samsung A71 5G = Samsung M51")
add("sam_13", "Samsung", "Samsung A70 = Samsung A70s = Samsung A707 = Samsung A705")
add("sam_14", "Samsung", "Samsung A20 = Samsung A20s")
add("sam_15", "Samsung", "Samsung A60 = Samsung M40")
add("sam_16", "Samsung", "Samsung A01 Core = Samsung M01 Core = Samsung A013 = Samsung M013")
add("sam_17", "Samsung", "Samsung A24 = Samsung A25 = Samsung F34 = Samsung M34")
add(
    "sam_18",
    "Samsung",
    "Samsung A13 = Samsung A13 4G = Samsung A13 Lite = Samsung F13 = Samsung M13 = Samsung A135 = Samsung A137",
)
add("sam_19", "Samsung", "Samsung M01 = Samsung A01 = Samsung M015 = Samsung A015")
add("sam_20", "Samsung", "Samsung A05s = Samsung M14 4G = Samsung A057")
add(
    "sam_21",
    "Samsung",
    "Samsung A06 5G = Samsung F06 5G = Samsung M06 5G = Samsung A066B = Samsung E066B = Samsung M066B",
)
add("sam_22", "Samsung", "Samsung A14 4G = Samsung A14 5G = Samsung A146 = Samsung A146B = Samsung A145F")
add("sam_23", "Samsung", "Samsung M14 5G = Samsung F14 5G = Samsung M146B = Samsung E146B")
add("sam_24", "Samsung", "Samsung A15 5G = Samsung A15 4G = Samsung F15 5G = Samsung M15 5G")
add("sam_25", "Samsung", "Samsung A16 5G = Samsung A16 4G = Samsung A26 5G = Samsung A166P")
add("sam_26", "Samsung", "Samsung A22 5G = Samsung F42 5G = Samsung A22s 5G")
add(
    "sam_27",
    "Samsung",
    "Samsung A23 4G = Samsung A23 5G = Samsung F23 5G = Samsung M23 5G = Samsung M33 5G",
)
add("sam_28", "Samsung", "Samsung A24 = Samsung A25 5G = Samsung M34 5G")
add("sam_29", "Samsung", "Samsung A32 4G = Samsung M32 4G")
add("sam_30", "Samsung", "Samsung A51 = Samsung A51 5G = Samsung M31s")
add("sam_31", "Samsung", "Samsung A52 5G = Samsung A52 4G = Samsung A52s 4G")
add("sam_32", "Samsung", "Samsung A53 5G = Samsung A53 4G")
add("sam_33", "Samsung", "Samsung A55 5G = Samsung A35 5G = Samsung M35 5G")
add(
    "sam_34",
    "Samsung",
    "Samsung M52 5G = Samsung M53 5G = Samsung M54 5G = Samsung F54 5G = Samsung M52 = Samsung M54 = Samsung M53",
)
add("sam_35", "Samsung", "Samsung M55 5G = Samsung F55 5G = Samsung C55 5G = Samsung M55s 5G")
add("sam_36", "Samsung", "Samsung S20 FE 4G = Samsung S20 FE 5G")

# ---- Infinix / Tecno / Itel (default Infinix for bare X codes) ----
add(
    "inf_2",
    "Infinix",
    "Infinix Smart HD = Infinix Smart HD 2021 = Infinix X612 = Infinix X612B",
)
add(
    "inf_3",
    "Tecno",
    "Tecno KE5 = Tecno KE5S = Tecno KE5K = Tecno Spark 6 Go = Tecno Spark Go 2020 = Tecno Spark Go 2021 = Tecno KF6 = Tecno Spark 7T = Tecno Spark 7 = Tecno KG6 = Infinix X659 = Infinix X658 = Tecno Spark 8 = Infinix X657 = Infinix X657C = Infinix X657B = Itel Vision 1 Plus = Itel Vision 1 Pro = Itel Vision 2S = Itel P36 = Itel P37 = Itel S16 = Infinix Smart 5A = Infinix Smart 5 = Infinix Hot 10 Lite",
)
add(
    "inf_4",
    "Itel",
    "Itel A60 = Itel A60s = Infinix Smart 7 = Tecno Spark 10 = Tecno Pop 7 Pro = Tecno Pop 7 = Tecno Spark 10C = Itel P40 = Tecno Spark Go 2023 = Tecno Spark 10 5G = Infinix Smart 7 HD = Infinix X6517 = Infinix X669 = Tecno BF6 = Infinix X6516 = Infinix X6515 = Tecno KI5Q = Tecno KI5N = Tecno KI5K = Tecno BF7 = Tecno BF7H = Tecno BF7N = Tecno BF7S = Itel P662L = Tecno KI8 = Infinix X669C = Itel A70 = Itel A50 = Itel S23 = Itel A05S = Itel P55 5G = Infinix Hot 30i = ZTE A34 = ZTE A54 = Itel A06 = Itel A50C = Itel A669W = Itel A669L = Infinix Smart 6 HD = Infinix Smart HD 2022 = Infinix Hot 12i = Infinix Hot 20i = Infinix X6511C = Infinix X6512 = Infinix X665 = Itel Vision 3 = Itel S661L = Tecno Spark 9 = Itel S18 = Tecno Spark 8C = Tecno Spark 9T = Itel Vision 5 = Itel P38 = Tecno KG5P = Tecno KG5J = Tecno KG5K = Tecno KH6 = Tecno KG5KS = Tecno KG5Q = Infinix X6511E = Infinix X6511D = Infinix X6511",
)
add(
    "inf_5",
    "Infinix",
    "Infinix X668 = Infinix X668C = Infinix Hot 12 = Infinix Hot 12 Pro = Tecno Pop 6 Pro = Tecno BE4 = Tecno BE8 = Infinix X662 = Tecno KH7H = Tecno Spark 9 Pro = Tecno KH7 = Tecno KG7 = Tecno KG7H = Tecno KG6P = Infinix Hot 11 = Tecno Spark 8T = Tecno Spark 8P = Tecno KG5 = Tecno BD4 = Tecno Pop 5 LTE = Tecno BD4J = Tecno KG5H = Tecno KG5M = Tecno Pop 5 Pro = Tecno BD4A = Tecno BD4H = Tecno BD4I = Tecno Spark Go 2022 = Tecno KG6K = Itel A58 Pro = Tecno Spark 8 = Infinix Smart 6 Plus = Itel S17 = Itel A58 = Itel A49 = Infinix X6511G",
)
add("inf_6", "Tecno", "Tecno CG8 = Infinix X6810 = Tecno Camon 17 Pro = Infinix Zero X Neo")
add(
    "inf_7",
    "Infinix",
    "Infinix Hot 9 Play = Infinix Smart 4 Plus = Infinix X680B = Infinix X680C = Infinix X680 = Infinix X680F = Infinix Hot 10 Play = Infinix Hot 11 Play = Tecno Pova Neo = Tecno LE6 = Tecno Spark 7 = Itel P37 Pro = Itel Vision 2 Plus = Itel P681L = Itel P681LM = Infinix X688 = Infinix X688B = Infinix X688C = Tecno LE6H = Tecno KF7 = Infinix Smart 6 Plus = Infinix Hot 10s = Infinix Hot 10T = Tecno Spark 7P = Itel P38 Pro = Itel Vision 3 Plus = Infinix Hot 11 = Infinix X6823 = Infinix X689 = Infinix X6823C = Infinix X689B = Infinix X689D = Infinix X689C = Infinix X689F = Tecno KF7J",
)
add("inf_8", "Itel", "Itel A26 = Itel A37")
add(
    "inf_9",
    "Infinix",
    "Infinix Hot 10 = Tecno Pova 1 = Tecno Pova = Tecno Camon 16 = Infinix Hot 10i = Tecno Spark 6 = Infinix Note 8i = Infinix X683 = Infinix X682B = Tecno CE7 = Tecno CE7i = Infinix X682C = Infinix X682 = Tecno LD7 = Tecno LD7J = Infinix X683C = Tecno KE7",
)
# inf_10 empty shop-only — skipped
add(
    "inf_11",
    "Infinix",
    "Infinix Smart 10 = Infinix Smart 10 NFC = Infinix Smart 10 Pro = Infinix Smart 10 Plus = Infinix Smart 10T = Infinix Hot 60 5G",
)
add(
    "inf_12",
    "Infinix",
    "Infinix Note 11 = Infinix Note 12 Turbo = Infinix Note 12 5G = Infinix Note 12 Pro = Infinix X663 = Infinix X663D = Infinix X676B = Infinix X670 = Infinix X671 = Infinix X6716",
)
add(
    "inf_13",
    "Infinix",
    "Infinix Hot 60i = Infinix X6728 = Tecno Spark Go 2 = Tecno KM4 = Tecno Spark 40",
)
add(
    "inf_14",
    "Infinix",
    "Infinix Hot 12 = Infinix Note 12i = Infinix Hot 20 = Infinix Hot 20 Play = Tecno Pova Neo 2 = Infinix Hot 12 Play = Itel P40 Plus = Infinix X6816C = Infinix X6816D = Infinix X6816 = Infinix X6817 = Infinix X6819 = Infinix X6825 = Infinix X6826 = Tecno LG6 = Tecno LG6N = Tecno Pova 4 = Tecno LG7N",
)
add(
    "inf_15",
    "Infinix",
    "Infinix X650 = Infinix X650B = Infinix X650C = Infinix X650D = Tecno KC2J = Tecno KC2 = Tecno KC8 = Tecno CC7 = Infinix Hot 8 Lite = Tecno Camon 12 = Tecno CC7S = Infinix Hot 8 = Infinix Hot 8 Pro = Tecno Spark 4",
)
add(
    "inf_16",
    "Infinix",
    "Infinix Note 40 Pro 4G = Infinix X6850 = Infinix Note 40 Pro 5G = Infinix X6851 = Infinix Note 40 Pro Plus 5G = Infinix X6851B = Infinix Note 40s = Infinix X6850B = Tecno Spark 20 Pro Plus = Tecno KJ7 = Infinix Zero 40 4G = Infinix X6860 = Infinix X6880 = Infinix Hot 50 Pro Plus",
)
add(
    "inf_17",
    "Infinix",
    "Infinix X6525 = Infinix X6526 = Infinix X6528 = Infinix Smart 8 = Tecno Spark Go 2024 = Infinix Smart 8 HD = Tecno Spark 20 = Tecno Spark 20C = Infinix Hot 40i = Tecno Pop 8 = Itel P55 = Itel P55 Plus = Itel P55T = Itel A666L = Itel S23 Plus = Itel S18 Pro = Itel S24 = Itel RS4 = Tecno BG7 = Tecno KJ5 = Tecno BG6 = Tecno BG6H = Tecno BG6M",
)
add(
    "inf_18",
    "Infinix",
    "Infinix Hot 9 = Infinix Hot 9 Pro = Infinix Note 7 Lite = Tecno Camon 15 Air = Tecno Camon 15 = Tecno Spark 5 Pro = Tecno Spark 5 = Infinix X655C = Infinix X655 = Infinix X655D = Infinix X655F = Infinix X656 = Tecno DC6 = Tecno DC7 = Tecno KD7 = Tecno KD7S = Tecno KD7H",
)
add("inf_19", "Itel", "Itel P36 Play = Itel Vision 1")
add("inf_20", "Itel", "Itel S16 Pro = Itel Vision 2 = Itel L6503")
add(
    "inf_21",
    "Tecno",
    "Tecno Spark 5 Air = Tecno KD6 = Tecno KD6A = Tecno Spark 6 Air = Tecno KE6 = Tecno KE6J = Tecno Pouvoir 4 = Tecno LC7 = Tecno KE3 = Tecno Pouvoir 4 Pro = Tecno LC8 = Tecno Spark Power 2",
)
add(
    "inf_22",
    "Tecno",
    "Tecno CK6 = Tecno CK7 = Tecno CK8N = Tecno CK9 = Infinix X6739 = Infinix X678B = Infinix X6710 = Tecno Camon 20 = Tecno GT 10 Pro = Tecno Camon 20 Pro = Tecno Camon 20 Pro 5G = Tecno CK7N",
)
add(
    "inf_23",
    "Infinix",
    "Infinix S5 = Infinix S5 Lite = Tecno Camon 12 Air = Tecno KC3 = Tecno CC3 = Infinix X652",
)
add(
    "inf_24",
    "Infinix",
    "Infinix X6827 = Infinix Hot 20 Pro = Tecno Spark 8 Pro = Tecno KG8 = Infinix X6812B = Tecno Camon 17P = Tecno CG7 = Tecno Pova = Tecno LE6J = Tecno Pova Neo 5G = Infinix Zero 5G = Infinix X6815B = Infinix X6812 = Infinix Hot 11s = Tecno Camon 18 = Tecno CH6 = Tecno Camon 19 Neo = Tecno CH6i = Infinix Zero 5G 2023 = Infinix X6815D = Tecno Camon 18P = Tecno CH7N",
)
add(
    "inf_25",
    "Infinix",
    "Infinix X693 = Infinix Note 10 = Tecno Pova 2 = Tecno Pova 5G = Tecno Pova 3 = Tecno LE7 = Tecno LE8 = Tecno LF7 = Infinix X698 = Infinix X697 = Infinix Note 11i = Infinix Note 11S = Infinix Note 11 Pro",
)
add(
    "inf_26",
    "Infinix",
    "Infinix X6831 = Infinix X6833B = Infinix X6838 = Infinix X6711 = Infinix X6837 = Infinix X6832 = Infinix X6836 = Tecno LI6 = Tecno LH8N = Tecno Pova 5 Pro 5G = Lava Storm 5G = Lava LXX508 = Lava Blaze Pro 5G = Lava LXX506 = Infinix Hot 40 = Tecno KJ6 = Tecno KI7 = Tecno KJ8 = Tecno Spark 20 Pro 5G = Tecno L7N = Tecno Pova 5 = Tecno Spark 10 Pro = Infinix Hot 30 5G = Infinix Note 30 5G = Infinix Hot 40 Pro = Tecno LH7N = Infinix Note 40x 5G",
)
add(
    "inf_27",
    "Infinix",
    "Infinix X668 = Infinix X668C = Tecno BE8 = Tecno BE8i = Tecno KH6 = Infinix Hot 12 Pro = Tecno Pop 6 Pro",
)
add("inf_28", "Infinix", "Infinix X666 = Infinix X666B = Infinix Hot 20 5G")
add("inf_29", "Infinix", "Infinix X690 = Infinix X690B = Infinix Note 7")
add(
    "inf_30",
    "Infinix",
    "Infinix Smart 4 = Tecno Pop 3 Plus = Tecno BB4K = Tecno BB4 = Infinix X653C = Infinix X653",
)
add(
    "inf_31",
    "Tecno",
    "Tecno CC6 = Infinix X655 = Tecno KD7 = Infinix X652B = Tecno KC3 = Tecno KD7H = Tecno CD7 = Infinix X655C = Infinix X656 = Infinix X6524 = Tecno CD6",
)
add(
    "inf_32",
    "Infinix",
    "Infinix Hot 50 5G = Infinix X6720 = Infinix Hot 50i = Infinix X6531 = Infinix Smart 9 = Infinix X6532 = Tecno Spark Go 1 = Tecno KL4 = Tecno Spark 30 5G = Tecno KL8 = Itel P65 = Itel P671L = Tecno Spark 30C = Tecno KL5N = Itel A80 = Itel A671LC = Tecno Pova 6 Neo 5G = Tecno Pop 9 = Tecno Pop 9 5G = Tecno KL8H = Tecno Spark 30C 5G = Infinix X6531B = Infinix X6720B = Infinix X6532C = Tecno Smart 9 HD = Tecno KL4H = Tecno Pop 9 4G = Tecno Spark Go 1s",
)
add("inf_34", "Infinix", "Infinix S4 = Infinix X626 = Infinix X627 = Infinix Smart 3 Plus")
add("inf_35", "Infinix", "Infinix X675 = Infinix Hot 11 2022")
add(
    "inf_36",
    "Tecno",
    "Tecno ID3K = Tecno ID5A = Tecno ID5B = Tecno CF7 = Tecno CF8 = Tecno Camon i2 = Tecno Camon i2x = Tecno Camon i Air 2 Plus",
)
add("inf_37", "Tecno", "Tecno KC1 = Tecno KC6 = Tecno Spark Go = Tecno Spark 4 Air")
add("inf_38", "Itel", "Itel Vision 1 = Itel P36 Play")
add("inf_39", "Tecno", "Tecno KB3 = Tecno KB8 = Tecno iSky 3 = Tecno Spark 3 Pro")
add("inf_40", "Tecno", "Tecno IN1 = Infinix X5515")
add("inf_41", "Tecno", "Tecno KB2 = Infinix X5516 = Tecno iACE2X")
add("inf_42", "Tecno", "Tecno CG6 = Tecno CG6J = Tecno Camon 17 = Tecno KF8 = Tecno Spark 7 Pro")
add("inf_43", "Infinix", "Infinix X687 = Tecno CE9 = Infinix Zero 8i")
add("inf_44", "Infinix", "Infinix X695 = Infinix Note 10 Pro")
add(
    "inf_45",
    "Tecno",
    "Tecno Camon 19 Pro 5G = Tecno CI7 = Tecno CI7N = Tecno Camon 19 Pro = Tecno CI8 = Tecno CI8N = Tecno Camon 19 = Tecno CI6 = Tecno CI6N",
)
add(
    "inf_46",
    "Tecno",
    "Tecno Camon 30 5G = Tecno CL7 = Tecno CL7K = Infinix Note 40 5G = Infinix X6852 = Tecno Pova 6 = Tecno LI7 = Tecno Pova 6 Pro 5G = Tecno LI9 = Tecno Camon 30 = Tecno CL6 = Tecno CL6K",
)
add("inf_47", "Tecno", "Tecno CH9 = Tecno Camon 18 Premier")
add(
    "inf_48",
    "Infinix",
    "Infinix X6811 = Infinix Zero X = Infinix Zero X Pro = Infinix X6811B",
)
add("inf_49", "Infinix", "Infinix X622 = Infinix X623 = Infinix Hot S3X = Infinix Hot 6X")
add(
    "inf_50",
    "Infinix",
    "Infinix X625C = Infinix Hot 7 = Infinix X625D = Infinix Hot 7 Pro",
)

OUT.write_text(json.dumps(groups, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(groups)} groups -> {OUT}")
