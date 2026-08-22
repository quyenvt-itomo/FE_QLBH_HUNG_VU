import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Quotation, QuotationCommissionDetail } from "../quotation";
import { Product, ProductSnapshot } from "../product";
import { Service, ServiceSnapshot } from "../service";
import { Attribute, AttributeSnapshot } from "../attribute";
import { SaleLineType } from "@/shared/constants/enum";

export interface QuotationLine extends Entity {
  quotationId: string;

  type: SaleLineType;

  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  product: Product | null;

  serviceId: string | null;
  serviceSnapshot: ServiceSnapshot | null;
  service: Service | null;

  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;
  unit: Attribute | null;

  // TODO: Các thông tin tạm tính
  // Số lượng tạm tính
  // Đây là số lượng tạm tính do người dùng nhập vào
  // Chưa bao gồm số lượng cộng thêm từ người liên hệ
  rawQuantity: number;
  // Giá tạm tính
  // Đây là giá tạm tính do người dùng nhập vào, FE tự động fill vào từ giá của hàng hóa hoặc giá bán của dịch vụ
  // Chưa bao gồm giá cộng thêm từ người liên hệ
  rawUnitPrice: number;
  // Thành tiền tạm tính (rawQuantity * rawUnitPrice)
  rawSubTotal: number;

  // Số lượng Kg tạm tính (Do NVL mặc định có đvt chính là Kg)
  // FE dựa vào bom để tính ra số lượng Kg cho vật tư chính
  // Nếu là dịch vụ thì số lượng này sẽ bằng số lượng tạm tính
  rawMaterialQuantity: number;
  // Giá vốn tạm tính của vật tư chính hoặc của dịch vụ
  rawMaterialUnitPrice: number;
  // Chi phí tạm tính cộng thêm vào giá vốn của vật tư chính hoặc của dịch vụ
  // Phát sinh do sản xuất, tồn kho, hoặc các yếu tố khác mà người dùng muốn cộng thêm vào giá vốn để tính ra giá bán
  rawAdditionalCost: number;
  // Thành tiền tổng chi phí của vật tư chính hoặc dịch vụ
  // = rawMaterialQuantity * (rawMaterialUnitPrice + rawAdditionalCost)
  rawMaterialTotalCost: number;

  // Lợi nhuận tạm tính của dòng này
  // = rawSubTotal - rawMaterialTotalCost
  rawProfit: number;

  // TODO: Thông tin cho hàng hóa
  // Vật tư chính cấu thành hàng hóa (FE dùng để tự đống tính giá vốn sản xuất và giá bán)
  materialId: string | null;
  materialSnapshot: ProductSnapshot | null;
  material: Product | null;

  // Số lượng thực tế = số lượng tạm tính + tổng số lượng cộng thêm từ người liên hệ
  quantity: number;

  // Giá thực tế = giá tạm tính + giá cộng thêm từ người liên hệ
  unitPrice: number;

  taxRate: number;

  subTotal: number; // Tổng tiền trước thuế và chiết khấu = quantity * unitPrice

  taxAmount: number; // Số tiền thuế của dòng này (subTotal * taxRate)

  grossAmount: number; // Số tiền sau thuế (subTotal + taxAmount)

  // Số tiền hoa hồng
  // = tổng số tiền hoa hồng của tất cả người liên hệ đối với dòng này
  commissionAmount: number;

  // ============================== RELATIONSHIPS ==============================
  quotation: Quotation;

  commissionDetails: QuotationCommissionDetail[];
}

export interface QuotationLineQuery extends ApiRequestQuery {
  quotationId?: string;
  productId?: string;
}
