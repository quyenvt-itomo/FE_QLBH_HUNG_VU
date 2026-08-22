import { Attribute } from "../attribute";
import { Service, ServiceSnapshot } from "./service.model";

/**
 * Gom danh sách sản phẩm từ lines (dùng để hideOptions trong select)
 */
export const collectService = <
  T extends { service?: Service | null; serviceSnapshot?: ServiceSnapshot | null },
>(
  lines: T[],
): Service[] => {
  return lines
    .map((l) => l.service || l.serviceSnapshot)
    .filter((p): p is Service => !!p?.id) as unknown as Service[];
};

export function collectUnits(service: Service, defaultUnit?: Attribute | null): Attribute[] {
  const units: Attribute[] = [];

  if (defaultUnit && !units.find((u) => u.id === defaultUnit.id)) {
    units.push(defaultUnit);
  }

  const serviceUnits = service.units || [];

  for (const serviceUnit of serviceUnits) {
    if (serviceUnit.unit && !units.find((u) => u.id === serviceUnit.unitId)) {
      units.push(serviceUnit.unit);
    }
  }

  return units;
}

export function getPricePerUnit(
  service: Service,
  unitId?: string,
):
  | {
      costPrice?: number | null;
      unitPrice?: number | null;
    }
  | undefined {
  if (!unitId) {
    return undefined;
  }

  const serviceUnit = service.units?.find((su) => su.unitId === unitId);
  if (serviceUnit) {
    return {
      costPrice: serviceUnit.costPrice,
      unitPrice: serviceUnit.unitPrice,
    };
  }

  return undefined;
}
