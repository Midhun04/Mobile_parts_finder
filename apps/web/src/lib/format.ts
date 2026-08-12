import type { MobileModelWithBrand } from '@mpf/shared';

export function formatModelName(model: MobileModelWithBrand): string {
  return `${model.brand.name} ${model.name}`;
}

/** True for synthetic matrix rows like "[matrix] Display shared (...)". */
export function isMatrixPartName(name: string): boolean {
  return name.trimStart().startsWith('[matrix]');
}
