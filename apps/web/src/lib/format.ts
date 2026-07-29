import type { MobileModelWithBrand } from '@mpf/shared';

export function formatModelName(model: MobileModelWithBrand): string {
  return `${model.brand.name} ${model.name}`;
}
