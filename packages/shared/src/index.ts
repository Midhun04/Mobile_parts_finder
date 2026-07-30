export type PartType =
  | 'DISPLAY'
  | 'BATTERY'
  | 'OCA'
  | 'POUCH'
  | 'CHARGING_BOARD'
  | 'CAMERA'
  | 'SPEAKER'
  | 'EARPIECE'
  | 'MICROPHONE'
  | 'FINGERPRINT'
  | 'HOUSING'
  | 'BACK_GLASS'
  | 'VOLUME_FLEX'
  | 'POWER_FLEX'
  | 'VIBRATOR'
  | 'TEMPERED_GLASS'
  | 'OTHER';

export interface Brand {
  id: number;
  name: string;
}

export interface MobileModel {
  id: number;
  brandId: number;
  name: string;
  modelNumber?: string;
  releaseYear?: number;
}

export interface Part {
  id: number;
  name: string;
  type: PartType;
  partTypeId: number;
  partNumber?: string;
  manufacturer?: string;
  description?: string;
}

export interface Compatibility {
  id: number;
  mobileModelId: number;
  partId: number;
  verified: boolean;
  notes?: string;
}

export interface MobileModelWithBrand extends MobileModel {
  brand: Brand;
}

export interface PartWithModels extends Part {
  compatibleModels: MobileModelWithBrand[];
}

export interface SearchResult {
  models: MobileModelWithBrand[];
  parts: Part[];
}

export const PART_TYPE_LABELS: Record<PartType, string> = {
  DISPLAY: 'Display / Combo',
  BATTERY: 'Battery',
  OCA: 'OCA Glass',
  POUCH: 'Pouch / Back Panel',
  CHARGING_BOARD: 'Charging Board',
  CAMERA: 'Camera',
  SPEAKER: 'Speaker',
  EARPIECE: 'Earpiece',
  MICROPHONE: 'Microphone',
  FINGERPRINT: 'Fingerprint Sensor',
  HOUSING: 'Housing',
  BACK_GLASS: 'Back Glass',
  VOLUME_FLEX: 'Volume Flex',
  POWER_FLEX: 'Power Flex',
  VIBRATOR: 'Vibrator',
  TEMPERED_GLASS: 'Tempered Glass',
  OTHER: 'Other',
};

export const PART_TYPE_ICONS: Record<PartType, string> = {
  DISPLAY: '📱',
  BATTERY: '🔋',
  OCA: '🧪',
  POUCH: '📦',
  CHARGING_BOARD: '🔌',
  CAMERA: '📷',
  SPEAKER: '🔊',
  EARPIECE: '🎧',
  MICROPHONE: '🎤',
  FINGERPRINT: '👆',
  HOUSING: '🧰',
  BACK_GLASS: '🪟',
  VOLUME_FLEX: '🔊',
  POWER_FLEX: '⚡',
  VIBRATOR: '📳',
  TEMPERED_GLASS: '🛡️',
  OTHER: '🔧',
};

export function getPartTypeLabel(type: string): string {
  return PART_TYPE_LABELS[type as PartType] ?? type;
}

export function getPartTypeIcon(type: string): string {
  return PART_TYPE_ICONS[type as PartType] ?? PART_TYPE_ICONS.OTHER;
}
