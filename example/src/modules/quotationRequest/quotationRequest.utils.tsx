import { SaleLineType } from "@/shared/constants/enum";
import { Quotation } from "../quotation/quotation.model";
import { QuotationLine } from "../quotationLine";
import { QuotationRequest } from "./quotationRequest.model";
import { getDefaultPricePerUnit, getQuantityInKg } from "../product";

export const generateDefaultQuotationByRequest = (
  request: Partial<QuotationRequest>,
): Partial<Quotation> => {
  const quotationLines: Partial<QuotationLine>[] = (request.lines || []).map((line) => {
    const unitId = line.unitId || line.product?.baseUnitId;
    const unit = line.unit || line.product?.baseUnit;

    const unitPrice = line.product && unitId ? getDefaultPricePerUnit(line.product, unitId) : 0;

    return {
      productId: line.productId,
      product: line.product,

      unitId: unitId,
      unit: unit,

      quantity: line.quantity,
      rawQuantity: line.quantity,
      rawMaterialQuantity: getQuantityInKg({
        product: line.product,
        unitId,
        quantity: line.quantity,
      }),

      unitPrice: unitPrice || 0,
      rawUnitPrice: unitPrice || 0,

      taxRate: line.product?.taxRate || 0,

      type: SaleLineType.PRODUCT,
    };
  });

  const quotationCommissions = request?.requester
    ? [
        {
          partnerContactId: request.requester.id,
          partnerContact: request.requester,
        },
      ]
    : [];

  return {
    companyId: request.companyId,

    quotationRequestId: request.id,
    quotationRequest: request as QuotationRequest,

    customerId: request.customerId,
    customer: request.customer,

    staffId: request.staffId,
    staff: request.staff,

    lines: quotationLines as any,

    commissions: quotationCommissions as any,
  };
};
