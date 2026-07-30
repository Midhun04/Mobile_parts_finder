"""One-shot builder: writes data/universal_battery_groups.json from supplier Battery lists.

Group ids encode battery part numbers (BLP605, BN30, BA7, …) for traceability.
"""
from __future__ import annotations

import json
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "data" / "universal_battery_groups.json"

groups: list[dict[str, str]] = []


def add(gid: str, brand: str, models: str, part: str = "") -> None:
    models = " ".join(models.split())
    if not models.strip("= +"):
        return
    row = {"id": gid, "brand": brand, "models": models}
    if part:
        row["part_number"] = part
    groups.append(row)


# ---- Oppo / Realme / OnePlus (BLP*) ----
add("blp_605", "Oppo", "Oppo A33 = Oppo A33T = Oppo F1 = Oppo A35", "BLP605")
add("blp_609", "Oppo", "Oppo F1 Plus", "BLP609")
add("blp_611", "Oppo", "Oppo R9 Plus", "BLP611")
add("blp_615", "Oppo", "Oppo A37", "BLP615")
add("blp_619", "Oppo", "Oppo A57", "BLP619")
add("blp_621", "Oppo", "Oppo R9S", "BLP621")
add("blp_623", "Oppo", "Oppo F3 Plus", "BLP623")
add("blp_631", "Oppo", "Oppo A77 = Oppo F3 = Oppo F5 = Oppo F5 Youth", "BLP631")
add("blp_639", "Oppo", "Oppo R11 = Oppo R11 Plus", "BLP639")
add("blp_641", "Oppo", "Oppo A71", "BLP641")
add("blp_645", "Oppo", "Oppo R11S = Oppo R11S Plus", "BLP645")
add("blp_649", "Oppo", "Oppo A71 = Oppo A83 = Oppo A83T = Oppo A88M", "BLP649")
add("blp_661", "Oppo", "Oppo F7 = Oppo A3", "BLP661")
add("blp_665", "Realme", "Realme 1", "BLP665")
add(
    "blp_673",
    "Oppo",
    "Oppo A3S = Oppo A5 = Oppo A5S = Oppo A7 = Oppo A7N = Oppo A8 = Oppo A11K = Oppo A12 = Oppo A12S = Oppo A31 = Realme 2 = Realme C1",
    "BLP673",
)
add(
    "blp_681",
    "Oppo",
    "Oppo F9 = Oppo F9 Pro = Oppo R17 = Realme U1 = Realme 2 Pro",
    "BLP681/BLP683",
)
add("blp_689", "Oppo", "Oppo R15x", "BLP689")
add("blp_693", "Realme", "Realme 3 = Realme 3i", "BLP693")
add("blp_695", "Realme", "Realme U1 = Realme 2 Pro", "BLP695")
add("blp_697", "Oppo", "Oppo F11 Pro", "BLP697")
add("blp_705", "Oppo", "Oppo Reno 10X Zoom", "BLP705")
add("blp_707", "Oppo", "Oppo F11", "BLP707")
add("blp_709", "Oppo", "Oppo A9 = Oppo A9S", "BLP709")
add("blp_711", "Realme", "Realme C2 = Oppo A1K", "BLP711/BLP721")
add("blp_713", "Realme", "Realme 3 Pro", "BLP713")
add("blp_701", "Realme", "Realme X = Oppo K3", "BLP701/BLP715")
add("blp_717", "Oppo", "Oppo Reno Z", "BLP717")
add("blp_723", "Realme", "Realme X", "BLP723")
add(
    "blp_727",
    "Oppo",
    "Oppo A5 2020 = Oppo A9 2020 = Oppo A11 = Oppo A11X = Realme 5 = Realme 5i = Realme 5S = Realme 6i = Realme C3 = Realme C11 = Realme C11 2021 = Realme C20 = Realme C20A = Realme C21 = Realme C21Y = Realme C25Y = Realme Narzo 10A = Realme Narzo 20A = Realme Narzo 50i = Realme V3 = Realme Q2i = Realme 10S 5G = Realme Narzo 60 5G",
    "BLP727/BLP729",
)
add("blp_731", "Realme", "Realme 5 Pro", "BLP731")
add("blp_735", "Oppo", "Oppo Reno 2", "BLP735")
add("blp_737", "Oppo", "Oppo Reno 2 = Oppo Reno 2Z = Oppo Reno 2F", "BLP737")
add("blp_741", "Realme", "Realme X2 = Realme XT", "BLP741")
add("blp_749", "Realme", "Realme X2 Pro", "BLP749")
add(
    "blp_755",
    "Oppo",
    "Oppo Reno 3 = Oppo Reno 3 5G = Oppo Reno 3 Pro = Oppo Reno 3 Pro 5G = Oppo Find X2 Lite = Oppo Find X2 Neo",
    "BLP755",
)
add(
    "blp_757",
    "Realme",
    "Realme 6 = Realme 6i = Realme 6S = Realme 6 Pro = Realme X3 = Realme X3 Super Zoom",
    "BLP757",
)
add("blp_765", "Oppo", "Oppo Reno 3 = Oppo A91 = Oppo F15", "BLP765")
add("blp_771", "Realme", "Realme Narzo 10", "BLP771")
add("blp_775", "Realme", "Realme X3", "BLP775")
add("blp_779", "Oppo", "Oppo A92S = Oppo F17 Pro = Oppo Reno 4 = Oppo Reno 4 Lite", "BLP779")
add("blp_781", "Oppo", "Oppo A52 = Oppo A72 = Oppo A92", "BLP781")
add("blp_783", "Oppo", "Oppo Reno Ace 2", "BLP783")
add("blp_787", "Oppo", "Oppo Reno 4 Pro 5G", "BLP787")
add("blp_789", "Oppo", "Oppo Reno 4 5G = Oppo Reno 5 5G", "BLP789")
add("blp_791", "Oppo", "Oppo Reno 4 4G", "BLP791")
add("blp_793", "Realme", "Realme C12 = Realme C15", "BLP793")
add("blp_797", "Oppo", "Oppo A72 5G = Oppo A73 5G", "BLP797")
add("blp_799", "Realme", "Realme X7 Pro", "BLP799")
add("blp_801", "OnePlus", "OnePlus 8T", "BLP801")
add("blp_803", "Realme", "Realme 7i = Oppo A53 = Realme V3", "BLP803")
add("blp_805", "Oppo", "Oppo A32", "BLP805")
add("blp_807", "Realme", "Realme 7", "BLP807")
add("blp_809", "Realme", "Realme GT Master = Realme Q2 Pro", "BLP809")
add("blp_811", "Oppo", "Oppo Reno 4 SE", "BLP811")
add("blp_815", "OnePlus", "OnePlus Nord N10", "BLP815")
add("blp_817", "Oppo", "Oppo A15 = Oppo A15s", "BLP817")
add("blp_819", "Oppo", "Oppo Reno 5 4G", "BLP819")
add("blp_823", "Oppo", "Oppo Reno 5 Pro 5G", "BLP823")
add("blp_825", "Oppo", "Oppo Reno 5 Pro Plus 5G", "BLP825")
add("blp_831", "Oppo", "Oppo Find X3 Pro", "BLP831")
add("blp_833", "Realme", "Realme V15 = Realme X7 5G", "BLP833")
add("blp_835", "Oppo", "Oppo Reno 5F", "BLP835")
add("blp_837", "Realme", "Realme 8 Pro", "BLP837")
add("blp_839", "Oppo", "Oppo Reno 5Z 5G", "BLP839")
add("blp_841", "Realme", "Realme 8", "BLP841")
add("blp_849", "Realme", "Realme GT", "BLP849")
add("blp_851", "Oppo", "Oppo A54 5G", "BLP851")
add("blp_855", "Oppo", "Oppo Reno 6 Pro 5G", "BLP855")
add("blp_861", "OnePlus", "OnePlus 9RT = OnePlus Nord 2 5G", "BLP861")
add("blp_863", "Oppo", "Oppo Reno 6 5G", "BLP863")
add("blp_875", "Realme", "Realme Q3S", "BLP875")
add("blp_877", "Realme", "Realme 8i", "BLP877")
add("blp_879", "Oppo", "Oppo A96", "BLP879")
add("blp_883", "Realme", "Realme 8S 5G", "BLP883")
add("blp_885", "Oppo", "Oppo A76", "BLP885")
add("blp_887", "Realme", "Realme GT Neo 2", "BLP887")
add("blp_889", "Oppo", "Oppo Find X5 Pro", "BLP889")
add("blp_891", "Oppo", "Oppo Find X5", "BLP891")
add("blp_893", "Oppo", "Oppo Reno 7", "BLP893")
add("blp_905", "Oppo", "Oppo Reno 7 Pro 5G", "BLP905")
add(
    "blp_907",
    "Oppo",
    "Oppo F21 Pro = Oppo F21s Pro = OnePlus Nord N20 5G = Oppo Reno 8Z = Oppo Reno 8 4G = Oppo Reno 7 4G",
    "BLP907",
)
add("blp_909", "Realme", "Realme 9 5G", "BLP909")
add("blp_911", "Realme", "Realme 9i = Oppo K10", "BLP911")
add("blp_915", "Oppo", "Oppo A17", "BLP915")
add("blp_919", "Realme", "Realme GT Neo 3", "BLP919")
add("blp_923", "Oppo", "Oppo A97 5G = Oppo A77 5G", "BLP923")
add("blp_929", "Oppo", "Oppo Reno 8 Pro = Oppo Reno 8 Pro Plus", "BLP929")
add("blp_933", "Oppo", "Oppo K10", "BLP933")
add("blp_935", "Realme", "Realme Q5 = Realme Q3S = Realme Q5i", "BLP935")
add("blp_951", "Realme", "Realme 10 Pro Plus", "BLP951")
add("blp_957", "Realme", "Realme 10 4G", "BLP957")
add("blp_959", "Oppo", "Oppo Reno 8T 4G", "BLP959")
add("blp_965", "Oppo", "Oppo K10X", "BLP965")
add("blp_981", "Oppo", "Oppo A1 Pro 5G", "BLP981")
add("blp_983", "Realme", "Realme 10 Pro 5G", "BLP983")
add("blpa_05", "Oppo", "Oppo Reno 10 5G", "BLPA05")
add("blpa_07", "Oppo", "Oppo A78 4G", "BLPA07")
add("blpa_15", "Realme", "Realme 11 Pro 5G", "BLPA15")
add("blpa_17", "Realme", "Realme C65 4G", "BLPA17")
add("blpa_19", "Oppo", "Oppo A58 4G", "BLPA19")
add("blpa_21", "Oppo", "Oppo A18 4G", "BLPA21")
add("blpa_41", "Oppo", "Oppo F25 Pro 5G", "BLPA41")
add("blp_601", "Oppo", "Oppo F1S", "BLP601")
add("blp_577", "Oppo", "Oppo A51 = Oppo A51K = Oppo A51T = Oppo R3", "BLP577")
add("blp_607", "Oppo", "Oppo A30 = OnePlus X", "BLP607")

# ---- Vivo / iQOO ----
add("vivo_ba7", "Vivo", "Vivo V3", "BA7")
add("vivo_ba08", "Vivo", "Vivo V29e", "BA08")
add("vivo_ba10", "Vivo", "Vivo Y17s = Vivo Y36", "BA10")
add("vivo_ba16", "Vivo", "Vivo Y200 5G", "BA16")
add("vivo_ba18", "Vivo", "Vivo V30", "BA18")
add("vivo_ba33", "Vivo", "Vivo Y03 4G", "BA33")
add("vivo_ba0", "Vivo", "Vivo V3 Max", "BA0")
add("vivo_b95", "Vivo", "Vivo Y51 = Vivo Y51L", "B95")
add("vivo_bb1", "Vivo", "Vivo Y55 = Vivo Y55A = Vivo Y55L = Vivo Y55S = Vivo V3", "BB1")
add(
    "vivo_bb2",
    "Vivo",
    "Vivo V5S = Vivo V5 Lite = Vivo Y66 = Vivo Y66L = Vivo Y67 = Vivo Y67L = Vivo Y69",
    "BB2",
)
add("vivo_bb3", "Vivo", "Vivo V5 Plus = Vivo X9 = Vivo X9L = Vivo X9 Plus", "BB3")
add("vivo_bb9", "Vivo", "Vivo X9 = Vivo X9 Plus", "BB9")
add("vivo_bbo", "Vivo", "Vivo Xplay 6", "BBO")
add("vivo_bc1", "Vivo", "Vivo Y53", "BC1")
add("vivo_bc8", "Vivo", "Vivo Y69", "BC8")
add("vivo_bc9", "Vivo", "Vivo V7 Plus = Vivo Y79 = Vivo Y79A", "BC9")
add("vivo_bd1", "Vivo", "Vivo X20 = Vivo X20A", "BD1")
add("vivo_bd2", "Vivo", "Vivo X20 Plus", "BD2")
add("vivo_bd5", "Vivo", "Vivo V7 = Vivo Y75 = Vivo Y75A", "BD5")
add("vivo_bd9", "Vivo", "Vivo V9 = Vivo V9 Youth = Vivo Y85 = Vivo Z1", "BD9")
add("vivo_be1", "Vivo", "Vivo Y71", "BE1")
add(
    "vivo_be5",
    "Vivo",
    "Vivo Y81 = Vivo Y81i = Vivo Y83 = Vivo Y83 Pro = Vivo Y81s = Vivo Y83A",
    "BE5",
)
add("vivo_be8", "Vivo", "Vivo V11i = Vivo V15 Pro = Vivo Y97 = Vivo Y97A", "BE8")
add("vivo_bf0", "Vivo", "Vivo V11 = Vivo V11 Pro", "BF0")
add("vivo_bf1", "Vivo", "Vivo X23", "BF1")
add(
    "vivo_bf3",
    "Vivo",
    "Vivo Y90 = Vivo Y90i = Vivo Y91 = Vivo Y91i = Vivo Y91L = Vivo Y93 = Vivo Y93S = Vivo Y95",
    "BF3",
)
add("vivo_bg1", "Vivo", "Vivo V15 Pro", "BG1")
add("vivo_bg2", "Vivo", "Vivo V15", "BG2")
add("vivo_bg3", "Vivo", "Vivo X27 Pro", "BG3")
add(
    "vivo_bg7",
    "Vivo",
    "Vivo Y11 = Vivo Y12 = Vivo Y15 2019 = Vivo Y17 = Vivo U10 = Vivo Z1 Pro = Vivo Z5x = Vivo Y3 = Vivo Y3s",
    "BG7",
)
add("vivo_bg9", "Vivo", "Vivo NEX 3", "BG9")
add("vivo_bh0", "Vivo", "Vivo V17 Neo = Vivo S1 = Vivo Y7S", "BH0")
add("vivo_bh1", "Vivo", "Vivo V17 Pro", "BH1")
add("vivo_bh3", "Vivo", "Vivo Z1x", "BH3")
add("vivo_bh9", "Vivo", "Vivo Y19", "BH9")
add("vivo_bk0", "iQOO", "iQOO Neo 855", "BK0")
add("vivo_bk3", "Vivo", "Vivo S1 Pro", "BK3")
add("vivo_bk6", "Vivo", "Vivo V17 = Vivo V19 = Vivo V19 Neo", "BK6")
add("vivo_bm1", "Vivo", "Vivo V17 = Vivo V19", "BM1")
add("vivo_bm3", "Vivo", "Vivo Y50", "BM3")
add("vivo_bm8", "iQOO", "iQOO Neo 3", "BM8")
add("vivo_bn2", "Vivo", "Vivo X50", "BN2")
add("vivo_bn3", "Vivo", "Vivo X50 Pro", "BN3")
add("vivo_bn5", "Vivo", "Vivo Y51s", "BN5")
add("vivo_bn7", "Vivo", "Vivo X50", "BN7")
add("vivo_bn8", "Vivo", "Vivo V20 = Vivo V20 Pro = Vivo S7", "BN8")
add("vivo_bo1", "iQOO", "iQOO U1", "BO1")
add("vivo_bo3", "Vivo", "Vivo Y73s", "BO3")
add(
    "vivo_bo5",
    "Vivo",
    "Vivo Y20 = Vivo Y12S = Vivo Y20A = Vivo Y20G = Vivo Y20i",
    "BO5",
)
add("vivo_bo6", "Vivo", "Vivo V20 SE", "BO6")
add(
    "vivo_bo8",
    "Vivo",
    "Vivo Y30 = Vivo Y31 = Vivo Y31S = Vivo Y50 = Vivo Y51 = Vivo Y51S = Vivo Y52S = Vivo Y73S = Vivo Y20i = Vivo Y93S = Vivo Y76",
    "BO8",
)
add("vivo_bo9", "Vivo", "Vivo X60", "BO9")
add("vivo_bp1", "Vivo", "Vivo X60 Pro", "BP1")
add("vivo_bp5", "iQOO", "iQOO Neo5", "BP5")
add("vivo_bp6", "Vivo", "Vivo S9e", "BP6")
add("vivo_bp9", "Vivo", "Vivo V21 = Vivo V21 Pro", "BP9")
add("vivo_bq1", "iQOO", "iQOO Z3", "BQ1")
add("vivo_bq6", "Vivo", "Vivo V21e 5G", "BQ6")
add("vivo_bq7", "Vivo", "Vivo Y53s", "BQ7")
add("vivo_br0", "Vivo", "Vivo S10", "BR0")
add("vivo_br3", "iQOO", "iQOO Z1x 5G", "BR3")
add("vivo_br5", "Vivo", "Vivo S10e", "BR5")
add("vivo_br6", "iQOO", "iQOO Neo 855", "BR6")
add("vivo_br7", "Vivo", "Vivo X70", "BR7")
add("vivo_bs1", "Vivo", "Vivo Y33s", "BS1/BS2")
add("vivo_bs6", "iQOO", "iQOO Z5", "BS6")
add("vivo_bs7", "Vivo", "Vivo Y16 = Vivo Y01 = Vivo Y15A = Vivo Y15S", "BS7")
add("vivo_bt0", "Vivo", "Vivo Y76 5G", "BT0")
add("vivo_bt2", "Vivo", "Vivo V23 Pro", "BT2")
add("vivo_bt3", "Vivo", "Vivo V23 5G", "BT3")
add("vivo_bt5", "Vivo", "Vivo Y55s 5G", "BT5")
add("vivo_bt6", "Vivo", "Vivo T1 5G = iQOO Z6 5G", "BT6")
add("vivo_bt7", "Vivo", "Vivo Y33T", "BT7")
add("vivo_bu1", "iQOO", "iQOO U5x", "BU1")
add("vivo_bu2", "Vivo", "Vivo T2x", "BU2")
add("vivo_bu8", "Vivo", "Vivo T1 Pro", "BU8")
add("vivo_bv0", "iQOO", "iQOO Z6 4G", "BV0")
add("vivo_bv1", "Vivo", "Vivo S15", "BV1")
add("vivo_bv7", "Vivo", "Vivo V25 5G", "BV7")
add("vivo_bw0", "Vivo", "Vivo Y35 5G", "BW0")
add("vivo_bw1", "Vivo", "Vivo T2X 5G = Vivo Y56 5G = Vivo Y02", "BW1")
add("vivo_bw2", "Vivo", "Vivo V25 5G", "BW2")
add("vivo_bw3", "Vivo", "Vivo Y22 = Vivo Y22s", "BW3")
add("vivo_bx6", "Vivo", "Vivo S16", "BX6")
add("vivo_bx7", "iQOO", "iQOO Z7 Pro 5G", "BX7")
add("vivo_bx8", "Vivo", "Vivo Y100 5G", "BX8")
add("vivo_by1", "Vivo", "Vivo Y53 5G", "BY1")
add("vivo_bz5", "Vivo", "Vivo Y36 5G", "BZ5")
add("vivo_bz7", "Vivo", "Vivo V29", "BZ7")
add("vivo_bg5", "Vivo", "Vivo X27 = Vivo X27A", "BG5")

# ---- Xiaomi / Redmi / Poco ----
add("mi_bn30", "Xiaomi", "Xiaomi Redmi 4A", "BN30")
add("mi_bn31", "Redmi", "Redmi Note 5A = Xiaomi Mi 5X = Redmi Y1", "BN31")
add("mi_bn32", "Xiaomi", "Xiaomi Mi 4", "BN32")
add("mi_bn34", "Redmi", "Redmi 5A", "BN34")
add("mi_bn35", "Xiaomi", "Xiaomi Redmi 5", "BN35")
add("mi_bn36", "Xiaomi", "Xiaomi Mi A2 = Xiaomi Mi 6X", "BN36")
add("mi_bn37", "Xiaomi", "Xiaomi Redmi 6 = Redmi 6A", "BN37")
add("mi_bn39", "Xiaomi", "Xiaomi Mi Play", "BN39")
add("mi_bn42", "Xiaomi", "Xiaomi Redmi 4", "BN42")
add("mi_bn43", "Xiaomi", "Xiaomi Redmi Note 4 = Redmi Note 4X", "BN43")
add("mi_bn44", "Redmi", "Redmi Note 5 Plus", "BN44")
add("mi_bn45", "Redmi", "Redmi Note 5 Pro", "BN45/BN48")
add("mi_bn46", "Redmi", "Redmi 7 = Redmi Y3 = Redmi Note 8", "BN46")
add("mi_bn47", "Redmi", "Redmi 6 Pro = Xiaomi Mi A2 Lite", "BN47")
add("mi_bn49", "Redmi", "Redmi 7A", "BN49")
add("mi_bn51", "Redmi", "Redmi 8 = Redmi 8A", "BN51")
add("mi_bn52", "Redmi", "Redmi Note 9 Pro", "BN52")
add("mi_bn53", "Redmi", "Redmi Note 9 Pro", "BN53")
add(
    "mi_bn54",
    "Redmi",
    "Redmi Note 9 = Redmi 10X 4G = Redmi 10X 5G = Redmi 10X Pro 5G",
    "BN54",
)
add("mi_bn55", "Redmi", "Redmi Note 9S", "BN55")
add(
    "mi_bn56",
    "Redmi",
    "Redmi 9A = Redmi 9C = Poco M2 = Poco M2 Pro",
    "BN56/BN5F/BN5H",
)
add("mi_bn57", "Redmi", "Poco X3 Pro", "BN57")
add("mi_bn59", "Redmi", "Redmi Note 10 = Redmi Note 10S", "BN59")
add("mi_bn61", "Redmi", "Poco X3 NFC", "BN61")
add("mi_bn62", "Redmi", "Poco M3", "BN62")
add("mi_bn63", "Redmi", "Redmi 10 Prime", "BN63")
add("mi_bn65", "Redmi", "Redmi 10", "BN65")
add("mi_bn66", "Redmi", "Poco C40", "BN66")
add("mi_bn3a", "Redmi", "Redmi Go", "BN3A")
add("mi_bn4a", "Redmi", "Redmi Note 7 = Redmi Note 7s = Redmi Note 7 Pro", "BN4A")
add("mi_bn5a", "Redmi", "Redmi Note 10 5G", "BN5A")
add("mi_bn5c", "Redmi", "Poco M4 Pro", "BN5C")
add("mi_bn5d", "Redmi", "Redmi Note 11 = Redmi Note 11S", "BN5D")
add("mi_bn5e", "Redmi", "Redmi Note 11 Pro 5G", "BN5E")
add("mi_bn5g", "Redmi", "Redmi 10C = Redmi 10A", "BN5G")
add("mi_bn5j", "Redmi", "Redmi Note 12 5G", "BN5J")
add("mi_bn5k", "Redmi", "Redmi 12C", "BN5K")
add("mi_bn5m", "Redmi", "Redmi Note 12 4G", "BN5M")
add("mi_bn5p", "Redmi", "Redmi Note 12 5G", "BN5P")
add("mi_bn5q", "Redmi", "Redmi 13C 5G", "BN5Q")
add("mi_bm32", "Xiaomi", "Xiaomi Mi 4", "BM32")
add("mi_bm46", "Redmi", "Redmi Note 3", "BM46")
add("mi_bm47", "Redmi", "Redmi 3 = Redmi 3S = Redmi 3S Prime", "BM47")
add("mi_bm49", "Xiaomi", "Xiaomi Mi Max", "BM49")
add("mi_bm50", "Xiaomi", "Xiaomi Mi Max 2", "BM50")
add("mi_bm53", "Xiaomi", "Xiaomi 10T = Xiaomi 10 Pro", "BM53")
add("mi_bm56", "Redmi", "Redmi K40", "BM56")
add("mi_bm58", "Xiaomi", "Xiaomi Mi 11T Pro", "BM58")
add("mi_bm59", "Xiaomi", "Xiaomi 11T 5G", "BM59")
add("mi_bm5a", "Redmi", "Redmi Note 11 Pro 5G", "BM5A")
add("mi_bm5g", "Redmi", "Redmi K50 = Redmi K50i 5G", "BM5G")
add("mi_bm5r", "Redmi", "Redmi 12 5G", "BM5R")
add("mi_bm3e", "Xiaomi", "Xiaomi Mi 8", "BM3E")
add("mi_bm4e", "Redmi", "Poco F1", "BM4E")
add("mi_bm4f", "Xiaomi", "Xiaomi Mi A3", "BM4F")
add("mi_bm4j", "Redmi", "Redmi Note 8 Pro", "BM4J")
add("mi_bm4m", "Xiaomi", "Xiaomi Mi 10 Pro", "BM4M")
add("mi_bm4p", "Redmi", "Redmi K30 = Poco X2", "BM4P")
add("mi_bm4q", "Redmi", "Poco F2 Pro", "BM4Q")
add("mi_bp4k", "Redmi", "Poco F5", "BP4K")
add("mi_bp45", "Xiaomi", "Xiaomi 12 Pro", "BP45")
add("mi_bm55", "Xiaomi", "Xiaomi Mi 11 Ultra", "BM55")
add("mi_bn5r", "Redmi", "Redmi A3", "BN5R")
add("mi_bm5v", "Redmi", "Poco X6 5G", "BM5V")
add("mi_bp4d", "Xiaomi", "Xiaomi 13 Pro", "BP4D")
add("mi_bm4r", "Xiaomi", "Xiaomi Mi 10 Lite", "BM4R")
add("mi_bm4s", "Xiaomi", "Xiaomi Mi 10X 5G = Xiaomi Mi 10X Pro 5G", "BM4S")
add("mi_bm4t", "Redmi", "Redmi 10X Pro 5G", "BM4T")
add("mi_bm4u", "Redmi", "Redmi K30 Ultra", "BM4U")
add("mi_bm4v", "Redmi", "Poco X6 5G", "BM4V")
add("mi_bm4w", "Xiaomi", "Xiaomi Mi 10i 5G", "BM4W")
add("mi_bm4y", "Redmi", "Poco F3 = Redmi K40 = Redmi K40 Pro", "BM4Y")
add("mi_bp4e", "Xiaomi", "Xiaomi Civi 2", "BP4E")
add("mi_bp40", "Redmi", "Redmi K20 Pro = Xiaomi Mi 9T Pro", "BP40/BP41")
add("mi_bp42", "Xiaomi", "Xiaomi Mi 11 Lite", "BP42")
add("mi_bp44", "Xiaomi", "Xiaomi Civi 5G", "BP44")
add("mi_bp47", "Redmi", "Redmi Note 11 Pro", "BP47")
add("mi_bp49", "Redmi", "Poco F4 5G", "BP49")

# ---- Motorola ----
add("moto_el40", "Motorola", "Moto E", "EL40")
add("moto_fl40", "Motorola", "Moto X Play", "FL40")
add("moto_ed30", "Motorola", "Moto G2", "ED30")
add("moto_g3", "Motorola", "Moto G3", "G3")
add("moto_ga40", "Motorola", "Moto G4 Plus", "GA40")
add("moto_gl40", "Motorola", "Moto Z Play", "GL40")
add("moto_hg30", "Motorola", "Moto G6 = Moto G5S = Moto G5S Plus", "HG30")
add("moto_hg40", "Motorola", "Moto G5 Plus", "HG40")
add("moto_hx40", "Motorola", "Moto X4", "HX40")
add("moto_hz40", "Motorola", "Moto Z2 Play", "HZ40")
add("moto_he50", "Motorola", "Moto E4 Plus", "HE50")
add("moto_jg30", "Motorola", "Moto G7", "JG30")
add("moto_jt40", "Motorola", "Moto G6 Plus", "JT40")
add("moto_jk50", "Motorola", "Moto G7 Power = Moto One Power = Moto P30 Note", "JK50")
add("moto_kd40", "Motorola", "Moto G8 Plus", "KD40")
add("moto_kg40", "Motorola", "Moto G8 Play", "KG40")
add("moto_lg50", "Motorola", "Moto One Fusion Plus", "LG50")
add("moto_lk50", "Motorola", "Moto G60S", "LK50")
add("moto_lr50", "Motorola", "Moto Edge", "LR50")
add("moto_lz50", "Motorola", "Moto One 5G", "LZ50")
add("moto_mb40", "Motorola", "Moto Edge 20", "MB40")
add("moto_mb50", "Motorola", "Moto Edge S30", "MB50")
add("moto_mc50", "Motorola", "Moto G9 Power", "MC50")
add("moto_md50", "Motorola", "Moto Stylus", "MD50")
add("moto_mg50", "Motorola", "Moto G9 Plus", "MG50")
add("moto_mk50", "Motorola", "Moto G 5G", "MK50")
add("moto_ms50", "Motorola", "Moto G50 5G", "MS50")
add("moto_mh60", "Motorola", "Moto G60 = Moto G10 Power", "MH60")
add("moto_na50", "Motorola", "Moto Edge 30 Pro", "NA50")
add("moto_nc50", "Motorola", "Moto G41", "NC50")
add("moto_nd40", "Motorola", "Moto Edge 30", "ND40")
add("moto_nd50", "Motorola", "Moto G62 5G", "ND50")
add("moto_ne50", "Motorola", "Moto G52", "NE50")
add("moto_ng50", "Motorola", "Moto G71 5G", "NG50")
add("moto_nh50", "Motorola", "Moto G22", "NH50")
add("moto_np44", "Motorola", "Moto Edge 30 Fusion", "NP44")
add("moto_nt40", "Motorola", "Moto G Pure", "NT40")
add("moto_nt50", "Motorola", "Moto Edge 20 Lite", "NT50")
add("moto_pc50", "Motorola", "Moto G14", "PC50")
add("moto_pc60", "Motorola", "Moto G54 5G", "PC60")
add("moto_pd50", "Motorola", "Moto G Power 5G", "PD50")
add("moto_pg50", "Motorola", "Moto G Stylus", "PG50")
add("moto_pv50", "Motorola", "Moto G73", "PV50")
add("moto_qb50", "Motorola", "Moto G84 5G", "QB50")
add("moto_qf50", "Motorola", "Moto G34 5G", "QF50")

# ---- Samsung ----
add("sam_a01", "Samsung", "Samsung A01", "A01")
add("sam_a02", "Samsung", "Samsung A02", "A02")
add("sam_a02s", "Samsung", "Samsung A02s = Samsung M02s = Samsung A03s", "A02s/M02s/A03s")
add("sam_a03", "Samsung", "Samsung A03", "A03")
add("sam_a03core", "Samsung", "Samsung A03 Core", "A03 Core")
add("sam_a10", "Samsung", "Samsung A10 = Samsung M10", "A10/M10")
add(
    "sam_a10s",
    "Samsung",
    "Samsung A10s = Samsung A11 = Samsung A20s = Samsung A21",
    "A10s/A11/A20s/A21",
)
add("sam_a05s", "Samsung", "Samsung A05s = Samsung M14", "A05s")
add("sam_a13", "Samsung", "Samsung A13", "A13")
add("sam_a20", "Samsung", "Samsung A20 = Samsung A30 = Samsung A50", "A20/A30/A50")
add("sam_a21s", "Samsung", "Samsung A21s", "A21s")
add("sam_a22_4g", "Samsung", "Samsung A22 4G", "A22 4G")
add("sam_a22_5g", "Samsung", "Samsung A22 5G", "A22 5G")
add("sam_a24", "Samsung", "Samsung A24", "A24")
add("sam_a30s", "Samsung", "Samsung A30s", "A30s")
add("sam_a31", "Samsung", "Samsung A31 = Samsung A31s", "A31/A31s")
add("sam_a33", "Samsung", "Samsung A33 5G", "A33")
add("sam_a40", "Samsung", "Samsung A40", "A40")
add("sam_a42", "Samsung", "Samsung A42", "A42")
add("sam_a51", "Samsung", "Samsung A51", "A51")
add("sam_a52", "Samsung", "Samsung A52", "A52")
add("sam_a53", "Samsung", "Samsung A53 5G", "A53")
add("sam_a54", "Samsung", "Samsung A34 5G = Samsung A54", "A54")
add("sam_a60", "Samsung", "Samsung A60", "A60")
add("sam_a70", "Samsung", "Samsung A70", "A70")
add("sam_a70s", "Samsung", "Samsung A70s", "A70s")
add("sam_a71", "Samsung", "Samsung A71", "A71")
add("sam_f41", "Samsung", "Samsung F41", "F41")
add("sam_m01", "Samsung", "Samsung M01", "M01")
add("sam_m02", "Samsung", "Samsung M02", "M02")
add("sam_m11", "Samsung", "Samsung M11", "M11")
add("sam_m12", "Samsung", "Samsung M12 = Samsung A12", "M12/A12")
add("sam_m15", "Samsung", "Samsung M15 5G = Samsung M35 5G", "M15 5G")
add("sam_m20", "Samsung", "Samsung M20 = Samsung M30", "M20/M30")
add("sam_m30s", "Samsung", "Samsung M30s = Samsung M31 = Samsung M21", "M30s/M31")
add("sam_m31s", "Samsung", "Samsung M31s", "M31s")
add("sam_m32", "Samsung", "Samsung M32", "M32")
add("sam_m40", "Samsung", "Samsung M40", "M40")
add("sam_m51", "Samsung", "Samsung M51 = Samsung M62", "M51/M62")
add("sam_m52", "Samsung", "Samsung M52 5G = Samsung M53 5G", "M52 5G")
add("sam_j5p", "Samsung", "Samsung J5 Prime", "J5 Prime")
add("sam_j6", "Samsung", "Samsung J6", "J6")
add("sam_j7p", "Samsung", "Samsung J7 Pro", "J7 Pro 2017")
add("sam_j8", "Samsung", "Samsung J8", "J8")
add("sam_note8", "Samsung", "Samsung Note 8", "Note 8")
add("sam_note9", "Samsung", "Samsung Note 9", "Note 9")
add("sam_s7", "Samsung", "Samsung S7 Edge", "S7")
add("sam_s8", "Samsung", "Samsung S8", "S8")

# ---- Infinix / Tecno / Itel ----
add("inf_bl34cx", "Infinix", "Infinix Smart 3 Plus", "BL34CX")
add("inf_bl39ax", "Infinix", "Infinix Hot 4 Pro", "BL39AX")
add("inf_bl39gx", "Infinix", "Infinix Hot S3", "BL39GX")
add("inf_bl39jx", "Infinix", "Infinix Hot S3x", "BL39JX")
add("inf_bl40ct", "Tecno", "Tecno Phantom 6 Plus", "BL40CT")
add("inf_bl42ax", "Infinix", "Infinix Note 4", "BL42AX")
add("inf_bl43ax", "Infinix", "Infinix Zero 5", "BL43AX")
add("inf_bl43bx", "Infinix", "Infinix Note 5", "BL43BX")
add("inf_bl48dx", "Infinix", "Infinix Hot 11 2022", "BL48DX")
add("inf_bl49fx", "Infinix", "Infinix Hot 8", "BL49FX")
add("inf_bl49hx", "Infinix", "Infinix Hot 20 5G", "BL49HX")
add("inf_bl49ix", "Infinix", "Infinix Smart HD", "BL49IX")
add(
    "inf_bl49jx",
    "Infinix",
    "Infinix Note 10 Pro = Infinix Note 11S = Infinix Zero 5G",
    "BL49JX",
)
add("inf_bl49kx", "Infinix", "Infinix Note 12", "BL49KX")
add("inf_bl49nx", "Infinix", "Infinix Hot 30i", "BL49NX")
add("inf_bl49tx", "Infinix", "Infinix Note 30 5G", "BL49TX")
add("inf_bl51bx", "Infinix", "Infinix Hot 10", "BL51BX")
add("inf_bl58bx", "Infinix", "Infinix Hot 9 = Infinix Hot 9 Play", "BL58BX")
add("inf_bl38ai", "Itel", "Itel P32", "BL38AI")
add("inf_bl39li", "Tecno", "Tecno i7", "BL39LI")
add("inf_bl49fi", "Tecno", "Tecno Camon 15", "BL49FI")
add("inf_30ut", "Tecno", "Tecno i3 = Tecno i3 Pro", "30UT")
add("inf_30vt", "Tecno", "Tecno i5", "30VT")
add(
    "inf_36bt",
    "Tecno",
    "Tecno Camon iAir2 Plus = Tecno Camon i2 = Tecno Camon i2x = Tecno Camon iClick2",
    "36BT",
)
add("inf_39bt", "Tecno", "Tecno i7", "39BT")
add("inf_39ct", "Tecno", "Tecno i5", "39CT")
add("inf_39gx", "Infinix", "Infinix Hot S3", "39GX")
add("inf_39lt", "Tecno", "Tecno Spark 4", "39LT")
add("inf_49gt", "Tecno", "Tecno Camon 17", "49GT")
add("inf_49ht", "Tecno", "Tecno Spark 6", "49HT")
add("inf_44ct", "Tecno", "Tecno Camon 16 Premier", "44CT")
add("inf_49ft", "Tecno", "Tecno Camon 15", "49FT")
add("inf_49lt", "Tecno", "Tecno Camon 19", "49LT")
add("inf_49nt", "Tecno", "Tecno Spark Go", "49NT")
add("inf_50dt", "Tecno", "Tecno Phantom X2 Pro 5G", "50DT")
add("inf_bl58bt", "Tecno", "Tecno Pouvoir 4 Pro", "BL58BT")
add("inf_bl58ct", "Tecno", "Tecno Spark 7 = Infinix Hot 10i", "BL58CT/CX")

# ---- Nokia ----
add("nok_he316", "Nokia", "Nokia 6", "HE316/317/335/NK6")
add("nok_he319", "Nokia", "Nokia 3", "HE319/NK3")
add("nok_he321", "Nokia", "Nokia 5", "HE321")
add("nok_he328", "Nokia", "Nokia 8", "HE328/NK8")
add("nok_he336", "Nokia", "Nokia 5", "HE336")
add("nok_he338", "Nokia", "Nokia 2 = Nokia 2.1", "HE338/HE341")
add("nok_wt240", "Nokia", "Nokia 3.2", "WT240")
add("nok_wt340", "Nokia", "Nokia G20", "WT340")
add("nok_wt341", "Nokia", "Nokia G21", "WT341")
add("nok_hq430", "Nokia", "Nokia 3.4", "HQ430")
add("nok_he340", "Nokia", "Nokia 7", "HE340")
add("nok_he342", "Nokia", "Nokia 5.1 Plus = Nokia 6.1 Plus", "HE342/NK6.1+")
add("nok_lc440", "Nokia", "Nokia 5.3", "LC440")
add("nok_lc620", "Nokia", "Nokia 6.2", "LC620")
add("nok_p660", "Nokia", "Nokia G50", "P660")
add("nok_sp410", "Nokia", "Nokia C20 Plus", "SP410")
add("nok_se681", "Nokia", "Nokia C30", "SE681")
add("nok_v730", "Nokia", "Nokia 1.4", "V730")
add("nok_he344", "Nokia", "Nokia 6", "HE344")
add("nok_he345", "Nokia", "Nokia 6.1", "HE345")
add("nok_he346", "Nokia", "Nokia 7 Plus", "HE346/HE347")
add("nok_he363", "Nokia", "Nokia 3.1 Plus = Nokia X7 = Nokia 8.1", "HE363/NK3.1+")

# ---- Lenovo ----
add("len_bl234", "Lenovo", "Lenovo Vibe P1M = Lenovo P70 = Lenovo P70T = Lenovo P70A", "BL234")
add("len_bl245", "Lenovo", "Lenovo S60 = Lenovo S60T", "BL245")
add("len_bl255", "Lenovo", "Lenovo Zuk Z1", "BL255")
add("len_bl256", "Lenovo", "Lenovo K4 Note", "BL256")
add("len_bl260", "Lenovo", "Lenovo Vibe S1 Lite", "BL260")
add("len_bl261", "Lenovo", "Lenovo Vibe K5 Note", "BL261")
add("len_bl265", "Motorola", "Moto M", "BL265")
add("len_bl268", "Lenovo", "Lenovo Zuk Z2 = Lenovo Z2 Plus", "BL268")
add("len_bl270", "Lenovo", "Lenovo K6 Note = Lenovo K8 Note = Lenovo G5 Plus", "BL270")
add("len_bl272", "Lenovo", "Lenovo K6 Power", "BL272")
add("len_bl273", "Lenovo", "Lenovo K8 Plus", "BL273")
add("len_bl291", "Lenovo", "Lenovo 5", "BL291")
add("len_bl295", "Lenovo", "Lenovo K5", "BL295")
add("len_bl297", "Lenovo", "Lenovo K5 Pro = Lenovo Z6 Lite = Lenovo Z6 Youth", "BL297")

# ---- Honor / Huawei ----
add("hon_5x", "Honor", "Honor 5X = Honor 5X Play", "5X")
add("hon_6x", "Honor", "Honor 6X", "6X")
add("hon_7s", "Honor", "Honor 7S", "7S")
add("hon_7x", "Honor", "Honor 7X", "7X")
add("hon_8c", "Honor", "Honor 8C", "8C")
add("hon_8x", "Honor", "Honor 8X", "8X")
add(
    "hon_7a",
    "Honor",
    "Honor 7A = Honor 8 = Honor 8 Lite = Honor 9N = Honor 9 Lite = Huawei P20 Lite",
    "7A/8 Lite/9N/9 Lite",
)
add("hon_10lite", "Honor", "Honor 10 Lite", "10 Lite")
add("hon_enjoy6", "Huawei", "Huawei Enjoy 6", "Enjoy 6")
add("hon_holly2", "Huawei", "Huawei Holly 2 Plus", "Holly 2 Plus")
add("hon_p10", "Huawei", "Huawei P10", "P10")
add("hon_y6pro", "Huawei", "Huawei Y6 Pro", "Y6 Pro")
add("hon_y7prime", "Huawei", "Huawei Y7 Prime", "Y7 Prime")

OUT.write_text(json.dumps(groups, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Wrote {len(groups)} groups -> {OUT}")
