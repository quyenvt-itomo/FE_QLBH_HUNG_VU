/**
 * Bộ tính toán dành riêng cho Quotation — dựa trên model `QuotationLine`
 * (src/modules/quotationLine/quotationLine.model.ts) và các bút toán hoa hồng
 * (`QuotationCommissionDetail`).
 *
 * Các công thức (theo comment model):
 *  - rawSubTotal           = rawQuantity * rawUnitPrice
 *  - rawMaterialTotalCost  = rawMaterialQuantity * (rawMaterialUnitPrice + rawAdditionalCost)
 *  - rawProfit             = rawSubTotal - rawMaterialTotalCost
 *  - mainPrice (Giá/kg)    = rawMaterialUnitPrice + rawAdditionalCost
 *  - quantity              = rawQuantity  + Σ(commission.quantity)
 *  - unitPrice             = rawUnitPrice + Σ(commission.price)
 *  - subTotal              = quantity * unitPrice
 *  - taxAmount             = subTotal * taxRate%
 *  - grossAmount           = subTotal + taxAmount
 *  - priceAmount           = commission.price * quantity
 *  - priceTaxRateAmount    = (taxRate - commission.priceTaxRate) * priceAmount
 *  - quantityAmount        = commission.quantity * rawUnitPrice
 *  - quantityTaxRateAmount = (taxRate - commission.quantityTaxRate) * quantityAmount
 *  - commissionAmount      = Σ per commission:
 *                            priceAmount + priceTaxRateAmount + quantityAmount + quantityTaxRateAmount
 */

export type QuotationCommissionEntry = {
  price?: number;
  priceTaxRate?: number;
  quantity?: number;
  quantityTaxRate?: number;
};

export type QuotationLineCalc = {
  rawQuantity?: number;
  rawUnitPrice?: number;
  rawMaterialQuantity?: number;
  rawMaterialUnitPrice?: number;
  rawAdditionalCost?: number;
  rawSubTotal?: number;
  rawMaterialTotalCost?: number;
  rawProfit?: number;
  quantity?: number;
  unitPrice?: number;
  taxRate?: number;
  subTotal?: number;
  taxAmount?: number;
  grossAmount?: number;
  commissionAmount?: number;
  [key: string]: any;
};

export type QuotationTotal = {
  quantity: number;
  subTotal: number;
  taxAmount: number;
  grossAmount: number;
  commissionAmount: number;
};

const num = (v: any) => Number(v) || 0;

export class QuotationCalculationUtil {
  // =========================
  // Raw (tạm tính)
  // =========================

  calculateRawSubTotal(data: QuotationLineCalc): number {
    return num(data.rawQuantity) * num(data.rawUnitPrice);
  }

  calculateRawMaterialTotalCost(data: QuotationLineCalc): number {
    return (
      num(data.rawMaterialQuantity) * (num(data.rawMaterialUnitPrice) + num(data.rawAdditionalCost))
    );
  }

  calculateRawProfit(data: QuotationLineCalc): number {
    return this.calculateRawSubTotal(data) - this.calculateRawMaterialTotalCost(data);
  }

  /** Giá (kg) — đơn giá vốn + chi phí phụ thêm của vật tư chính */
  calculateMainPrice(data: QuotationLineCalc): number {
    return num(data.rawMaterialUnitPrice) + num(data.rawAdditionalCost);
  }

  // =========================
  // Thực tế (raw + tổng hoa hồng)
  // =========================

  private sumCommissionField(
    commissions: QuotationCommissionEntry[] | undefined,
    field: "price" | "quantity",
  ): number {
    return (commissions || []).reduce((sum, c) => sum + num(c?.[field]), 0);
  }

  calculateQuantity(data: QuotationLineCalc, commissions?: QuotationCommissionEntry[]): number {
    return num(data.rawQuantity) + this.sumCommissionField(commissions, "quantity");
  }

  calculateUnitPrice(data: QuotationLineCalc, commissions?: QuotationCommissionEntry[]): number {
    return num(data.rawUnitPrice) + this.sumCommissionField(commissions, "price");
  }

  calculateSubTotal(data: QuotationLineCalc, commissions?: QuotationCommissionEntry[]): number {
    return this.calculateQuantity(data, commissions) * this.calculateUnitPrice(data, commissions);
  }

  calculateTaxAmount(data: QuotationLineCalc, commissions?: QuotationCommissionEntry[]): number {
    return (this.calculateSubTotal(data, commissions) * num(data.taxRate)) / 100;
  }

  calculateGrossAmount(data: QuotationLineCalc, commissions?: QuotationCommissionEntry[]): number {
    return this.calculateSubTotal(data, commissions) + this.calculateTaxAmount(data, commissions);
  }

  // =========================
  // Hoa hồng theo từng người hưởng
  // =========================

  calculatePriceAmount(commission: QuotationCommissionEntry, quantity: number): number {
    return num(commission.price) * num(quantity);
  }

  calculatePriceTaxRateAmount(
    commission: QuotationCommissionEntry,
    line: QuotationLineCalc,
    quantity: number,
  ): number {
    const rate = (num(line.taxRate) - num(commission.priceTaxRate)) / 100;
    return this.calculatePriceAmount(commission, quantity) * rate;
  }

  calculateQuantityAmount(commission: QuotationCommissionEntry, rawUnitPrice: number): number {
    return num(commission.quantity) * num(rawUnitPrice);
  }

  calculateQuantityTaxRateAmount(
    commission: QuotationCommissionEntry,
    line: QuotationLineCalc,
    rawUnitPrice: number,
  ): number {
    const rate = (num(line.taxRate) - num(commission.quantityTaxRate)) / 100;
    return this.calculateQuantityAmount(commission, rawUnitPrice) * rate;
  }

  calculateCommissionDetailTotal(
    commission: QuotationCommissionEntry,
    line: QuotationLineCalc,
    quantity: number,
    rawUnitPrice: number,
  ): number {
    return (
      this.calculatePriceAmount(commission, quantity) +
      this.calculatePriceTaxRateAmount(commission, line, quantity) +
      this.calculateQuantityAmount(commission, rawUnitPrice) +
      this.calculateQuantityTaxRateAmount(commission, line, rawUnitPrice)
    );
  }

  calculateCommissionAmount(
    line: QuotationLineCalc,
    commissions?: QuotationCommissionEntry[],
  ): number {
    const quantity = this.calculateQuantity(line, commissions);
    const rawUnitPrice = num(line.rawUnitPrice);
    return (commissions || []).reduce(
      (sum, c) => sum + this.calculateCommissionDetailTotal(c, line, quantity, rawUnitPrice),
      0,
    );
  }

  // =========================
  // Tính 1 dòng (mutate)
  // =========================

  calculateLine(
    data: QuotationLineCalc,
    commissions?: QuotationCommissionEntry[],
  ): QuotationLineCalc {
    const rawSubTotal = this.calculateRawSubTotal(data);
    const rawMaterialTotalCost = this.calculateRawMaterialTotalCost(data);
    const quantity = this.calculateQuantity(data, commissions);
    const unitPrice = this.calculateUnitPrice(data, commissions);
    const subTotal = quantity * unitPrice;
    const taxAmount = (subTotal * num(data.taxRate)) / 100;
    const grossAmount = subTotal + taxAmount;
    const commissionAmount = this.calculateCommissionAmount(data, commissions);

    data.rawSubTotal = rawSubTotal;
    data.rawMaterialTotalCost = rawMaterialTotalCost;
    data.rawProfit = rawSubTotal - rawMaterialTotalCost;
    data.quantity = quantity;
    data.unitPrice = unitPrice;
    data.subTotal = subTotal;
    data.taxAmount = taxAmount;
    data.grossAmount = grossAmount;
    data.commissionAmount = commissionAmount;
    return data;
  }

  // =========================
  // Tổng mảng dòng
  // =========================

  calculateTotalForArray(
    lines: QuotationLineCalc[],
    commissionsByLine?: QuotationCommissionEntry[][],
  ): QuotationTotal {
    return lines.reduce<QuotationTotal>(
      (total, item, index) => {
        const commissions = commissionsByLine?.[index] || [];
        this.calculateLine(item, commissions);
        total.quantity += num(item.quantity);
        total.subTotal += num(item.subTotal);
        total.taxAmount += num(item.taxAmount);
        total.grossAmount += num(item.grossAmount);
        total.commissionAmount += num(item.commissionAmount);
        return total;
      },
      { quantity: 0, subTotal: 0, taxAmount: 0, grossAmount: 0, commissionAmount: 0 },
    );
  }

  /**
   * Tiện ích: gom các field flat `commission_<id>_*` trên line (cách lưu của form)
   * thành mảng `QuotationCommissionEntry[]`.
   */
  static extractCommissionEntries(
    line: QuotationLineCalc,
    commissions?: Array<Partial<{ tempId?: string; id?: string }> & Record<string, any>>,
  ): QuotationCommissionEntry[] {
    return (commissions || [])
      .map((c) => {
        const id = c?.tempId || c?.id;
        if (!id) return null;
        return {
          price: num(line?.[`commission_${id}_price`]),
          priceTaxRate: num(line?.[`commission_${id}_priceTaxRate`]),
          quantity: num(line?.[`commission_${id}_quantity`]),
          quantityTaxRate: num(line?.[`commission_${id}_quantityTaxRate`]),
        };
      })
      .filter(Boolean) as QuotationCommissionEntry[];
  }
}
