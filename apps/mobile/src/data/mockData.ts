/**
 * Reference mirror of `data/*.csv` (source of truth for seeding).
 * The mobile app loads live data from the API — do not import this in screens.
 */
import type { Brand, Compatibility, MobileModel, Part } from '@mpf/shared';

export const brands: Brand[] = [
  { id: 1, name: 'Samsung' },
  { id: 2, name: 'Apple' },
  { id: 3, name: 'Xiaomi' },
  { id: 4, name: 'Redmi' },
  { id: 5, name: 'Realme' },
  { id: 6, name: 'Oppo' },
  { id: 7, name: 'Vivo' },
  { id: 8, name: 'OnePlus' },
  { id: 9, name: 'Nokia' },
  { id: 10, name: 'Motorola' },
  { id: 11, name: 'Google' },
  { id: 12, name: 'Huawei' },
  { id: 13, name: 'Honor' },
  { id: 14, name: 'Infinix' },
  { id: 15, name: 'Tecno' },
  { id: 16, name: 'Lava' },
  { id: 17, name: 'Nothing' },
  { id: 18, name: 'Asus' },
  { id: 19, name: 'Sony' },
  { id: 20, name: 'Lenovo' },
];

export const mobileModels: MobileModel[] = [
  { id: 1, brandId: 1, name: 'Galaxy A50', modelNumber: 'SM-A505F', releaseYear: 2019 },
  { id: 2, brandId: 1, name: 'Galaxy A50s', modelNumber: 'SM-A507F', releaseYear: 2019 },
  { id: 3, brandId: 1, name: 'Galaxy A51', modelNumber: 'SM-A515F', releaseYear: 2019 },
  { id: 4, brandId: 2, name: 'iPhone 11', modelNumber: 'A2221', releaseYear: 2019 },
  { id: 5, brandId: 2, name: 'iPhone 12', modelNumber: 'A2403', releaseYear: 2020 },
  { id: 6, brandId: 3, name: 'Mi 11', modelNumber: 'M2011K2G', releaseYear: 2021 },
  { id: 7, brandId: 4, name: 'Note 10', modelNumber: 'M2101K7AI', releaseYear: 2021 },
  { id: 8, brandId: 4, name: 'Note 10 Pro', modelNumber: 'M2101K6G', releaseYear: 2021 },
  { id: 9, brandId: 6, name: 'A57', modelNumber: 'CPH2387', releaseYear: 2022 },
  { id: 10, brandId: 7, name: 'Y21', modelNumber: 'V2111', releaseYear: 2021 },
];

export const parts: Part[] = [
  {
    id: 1,
    name: 'Samsung Galaxy A50 AMOLED Display',
    type: 'DISPLAY',
    partTypeId: 1,
    partNumber: 'A50-DISP-01',
    manufacturer: 'Samsung',
  },
  {
    id: 2,
    name: 'EB-BA505ABU Battery',
    type: 'BATTERY',
    partTypeId: 2,
    partNumber: 'EB-BA505ABU',
    manufacturer: 'Samsung',
  },
  {
    id: 3,
    name: 'Galaxy A50 OCA Glass',
    type: 'OCA',
    partTypeId: 3,
    partNumber: 'A50-OCA-01',
    manufacturer: 'Generic',
  },
  {
    id: 4,
    name: 'Galaxy A50 Back Panel',
    type: 'POUCH',
    partTypeId: 4,
    partNumber: 'A50-PCH-01',
    manufacturer: 'Generic',
  },
  {
    id: 5,
    name: 'Galaxy A50 Charging Board',
    type: 'CHARGING_BOARD',
    partTypeId: 5,
    partNumber: 'A50-CB-01',
    manufacturer: 'Samsung',
  },
];

export const compatibilities: Compatibility[] = [
  { id: 1, mobileModelId: 1, partId: 1, verified: true, notes: 'Original compatible display' },
  { id: 2, mobileModelId: 1, partId: 2, verified: true, notes: 'Original battery' },
  { id: 3, mobileModelId: 1, partId: 3, verified: true, notes: 'OCA compatible' },
  { id: 4, mobileModelId: 1, partId: 4, verified: true, notes: 'Back panel' },
  { id: 5, mobileModelId: 1, partId: 5, verified: true, notes: 'Charging board' },
  { id: 6, mobileModelId: 2, partId: 1, verified: true, notes: 'Same display as A50' },
];
