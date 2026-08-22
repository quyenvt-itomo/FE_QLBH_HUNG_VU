import { PartnerContact, PartnerContactSnapshot } from "./partnerContact.model";

/**
 * Gom danh sách sản phẩm từ lines (dùng để hideOptions trong select)
 */
export const collectPartnerContact = <
  T extends {
    partnerContact?: PartnerContact | null;
    partnerContactSnapshot?: PartnerContactSnapshot | null;
  },
>(
  lines: T[],
): PartnerContact[] => {
  return lines
    .map((l) => l.partnerContact || l.partnerContactSnapshot)
    .filter((p): p is PartnerContact => !!p?.id) as unknown as PartnerContact[];
};
