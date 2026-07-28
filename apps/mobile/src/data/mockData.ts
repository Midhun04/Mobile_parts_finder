import type { Brand, Compatibility, MobileModel, Part } from '@mpf/shared';

export const brands: Brand[] = [
  { id: 1, name: 'Samsung' },
  { id: 2, name: 'Xiaomi' },
  { id: 3, name: 'Redmi' },
  { id: 4, name: 'Vivo' },
  { id: 5, name: 'Oppo' },
  { id: 6, name: 'Apple' },
  { id: 7, name: 'Realme' },
  { id: 8, name: 'OnePlus' },
];

export const mobileModels: MobileModel[] = [
  { id: 1, brandId: 1, name: 'Galaxy A50', modelNumber: 'SM-A505F', releaseYear: 2019 },
  { id: 2, brandId: 1, name: 'Galaxy A50s', modelNumber: 'SM-A507F', releaseYear: 2019 },
  { id: 3, brandId: 1, name: 'Galaxy A50 5G', modelNumber: 'SM-A5050', releaseYear: 2020 },
  { id: 4, brandId: 1, name: 'Galaxy A51', modelNumber: 'SM-A515F', releaseYear: 2019 },
  { id: 5, brandId: 1, name: 'Galaxy S21', modelNumber: 'SM-G991B', releaseYear: 2021 },
  { id: 6, brandId: 3, name: 'Note 10', modelNumber: 'M2101K7AI', releaseYear: 2021 },
  { id: 7, brandId: 3, name: 'Note 10S', modelNumber: 'M2101K7BG', releaseYear: 2021 },
  { id: 8, brandId: 3, name: 'Note 10 Pro', modelNumber: 'M2101K6P', releaseYear: 2021 },
  { id: 9, brandId: 2, name: 'Mi 11 Lite', modelNumber: 'M2101K9AG', releaseYear: 2021 },
  { id: 10, brandId: 4, name: 'V20', modelNumber: 'V2025', releaseYear: 2020 },
  { id: 11, brandId: 4, name: 'V21', modelNumber: 'V2050', releaseYear: 2021 },
  { id: 12, brandId: 5, name: 'A5 2020', modelNumber: 'CPH1931', releaseYear: 2020 },
  { id: 13, brandId: 5, name: 'A54', modelNumber: 'CPH2239', releaseYear: 2022 },
  { id: 14, brandId: 6, name: 'iPhone 11', modelNumber: 'A2111', releaseYear: 2019 },
  { id: 15, brandId: 6, name: 'iPhone 12', modelNumber: 'A2403', releaseYear: 2020 },
  { id: 16, brandId: 7, name: 'Narzo 50', modelNumber: 'RMX3286', releaseYear: 2022 },
  { id: 17, brandId: 8, name: 'Nord CE 2', modelNumber: 'IV2201', releaseYear: 2022 },
];

export const parts: Part[] = [
  {
    id: 1,
    name: 'A50 AMOLED Display',
    type: 'DISPLAY',
    partNumber: 'A50-AMOLED',
    description: '6.4" Super AMOLED display combo for Galaxy A50 series',
  },
  {
    id: 2,
    name: 'A50 Battery',
    type: 'BATTERY',
    partNumber: 'BN-59',
    description: '4000 mAh battery compatible with A50 / A50s',
  },
  {
    id: 3,
    name: 'A50 OCA Glass',
    type: 'OCA',
    partNumber: 'A50-OCA',
    description: 'OCA laminated glass for A50 display repairs',
  },
  {
    id: 4,
    name: 'A50 Back Pouch',
    type: 'POUCH',
    partNumber: 'A50-POUCH',
    description: 'Rear housing / pouch for Galaxy A50',
  },
  {
    id: 5,
    name: 'A50 Charging Board',
    type: 'CHARGING_BOARD',
    partNumber: 'A50-CB',
    description: 'USB charging dock flex for Galaxy A50',
  },
  {
    id: 6,
    name: 'A51 Super AMOLED Display',
    type: 'DISPLAY',
    partNumber: 'A51-AMOLED',
    description: '6.5" Super AMOLED display for Galaxy A51',
  },
  {
    id: 7,
    name: 'Note 10 Display Combo',
    type: 'DISPLAY',
    partNumber: 'RN10-DISP',
    description: 'Display combo shared by Note 10 and Note 10S',
  },
  {
    id: 8,
    name: 'Note 10 Battery',
    type: 'BATTERY',
    partNumber: 'BN57',
    description: '5000 mAh battery for Redmi Note 10 series',
  },
  {
    id: 9,
    name: 'Note 10 OCA Glass',
    type: 'OCA',
    partNumber: 'RN10-OCA',
    description: 'OCA glass for Redmi Note 10 / 10S',
  },
  {
    id: 10,
    name: 'Note 10 Pro Display',
    type: 'DISPLAY',
    partNumber: 'RN10P-AMOLED',
    description: 'AMOLED display for Redmi Note 10 Pro',
  },
  {
    id: 11,
    name: 'iPhone 11 LCD Display',
    type: 'DISPLAY',
    partNumber: 'IP11-LCD',
    description: '6.1" LCD display assembly for iPhone 11',
  },
  {
    id: 12,
    name: 'iPhone 11 Battery',
    type: 'BATTERY',
    partNumber: 'IP11-BAT',
    description: '3110 mAh battery for iPhone 11',
  },
  {
    id: 13,
    name: 'V20 Display Combo',
    type: 'DISPLAY',
    partNumber: 'V20-DISP',
    description: 'Display combo for Vivo V20',
  },
  {
    id: 14,
    name: 'V20 Battery',
    type: 'BATTERY',
    partNumber: 'B-G7',
    description: '4000 mAh battery for Vivo V20',
  },
  {
    id: 15,
    name: 'A5 2020 Charging Board',
    type: 'CHARGING_BOARD',
    partNumber: 'A5-CB',
    description: 'Charging board for Oppo A5 2020',
  },
  {
    id: 16,
    name: 'S21 Dynamic AMOLED',
    type: 'DISPLAY',
    partNumber: 'S21-DISP',
    description: '6.2" Dynamic AMOLED 2X for Galaxy S21',
  },
  {
    id: 17,
    name: 'A50 Front Camera',
    type: 'CAMERA',
    partNumber: 'A50-FCAM',
    description: '25MP front camera module for Galaxy A50',
  },
  {
    id: 18,
    name: 'A50 Loudspeaker',
    type: 'SPEAKER',
    partNumber: 'A50-SPK',
    description: 'Bottom loudspeaker for Galaxy A50 / A50s',
  },
];

export const compatibilities: Compatibility[] = [
  // A50 display shared across A50 / A50s / A50 5G
  { id: 1, mobileModelId: 1, partId: 1, verified: true },
  { id: 2, mobileModelId: 2, partId: 1, verified: true },
  { id: 3, mobileModelId: 3, partId: 1, verified: false, notes: 'Needs physical verification' },

  // BN-59 battery — A50 / A50s
  { id: 4, mobileModelId: 1, partId: 2, verified: true },
  { id: 5, mobileModelId: 2, partId: 2, verified: true },

  // A50 OCA
  { id: 6, mobileModelId: 1, partId: 3, verified: true },
  { id: 7, mobileModelId: 2, partId: 3, verified: true },

  // A50 pouch / charging / camera / speaker
  { id: 8, mobileModelId: 1, partId: 4, verified: true },
  { id: 9, mobileModelId: 1, partId: 5, verified: true },
  { id: 10, mobileModelId: 2, partId: 5, verified: false },
  { id: 11, mobileModelId: 1, partId: 17, verified: true },
  { id: 12, mobileModelId: 1, partId: 18, verified: true },
  { id: 13, mobileModelId: 2, partId: 18, verified: true },

  // A51
  { id: 14, mobileModelId: 4, partId: 6, verified: true },

  // Redmi Note 10 / 10S shared display & OCA
  { id: 15, mobileModelId: 6, partId: 7, verified: true },
  { id: 16, mobileModelId: 7, partId: 7, verified: true },
  { id: 17, mobileModelId: 6, partId: 8, verified: true },
  { id: 18, mobileModelId: 7, partId: 8, verified: true },
  { id: 19, mobileModelId: 8, partId: 8, verified: false, notes: 'Different capacity — confirm before use' },
  { id: 20, mobileModelId: 6, partId: 9, verified: true },
  { id: 21, mobileModelId: 7, partId: 9, verified: true },

  // Note 10 Pro display
  { id: 22, mobileModelId: 8, partId: 10, verified: true },

  // iPhone
  { id: 23, mobileModelId: 14, partId: 11, verified: true },
  { id: 24, mobileModelId: 14, partId: 12, verified: true },

  // Vivo
  { id: 25, mobileModelId: 10, partId: 13, verified: true },
  { id: 26, mobileModelId: 10, partId: 14, verified: true },

  // Oppo
  { id: 27, mobileModelId: 12, partId: 15, verified: true },

  // S21
  { id: 28, mobileModelId: 5, partId: 16, verified: true },
];

export const popularBrandIds = [1, 3, 6, 4, 5, 7];
export const recentlyAddedModelIds = [8, 5, 13, 17, 16];
