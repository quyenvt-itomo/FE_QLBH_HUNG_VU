import React from "react";
import { Input, Modal, Form, Row, Col } from "antd";
import { AddUpdateModalProps } from "../../../../models/base/interface";
import AttributeSelect from "../../../../components/manager_select/AttributeSelect";
import { AttributeTypeEnum, FileCategoryEnum, FileEntityEnum } from "../../../../constants/enum";
import Label from "../../../../components/display/Label";
import { IProduct, IProductVariant } from "../../../../models/product";
import { InputMoney, InputPercentage } from "../../../../components/input";
import ImageUploadBox from "../../../../components/upload/ImageUploadBox";
import EditableInfoCol from "../../../../components/display/EditableInfoCol";
import { useProductVariantData } from "../../../../hooks/product/useProductVariantData";
import { formatMoney, formatPercentage } from "../../../../utils/formatNumber";
import SquareImageGroup from "../../../../components/image/SquareImageGroup";
import ProductGroupSelect from "../../../../components/tree_select/ProductGroupSelect";

interface Props extends AddUpdateModalProps<IProduct> {
  onReload?: () => void;
}

const DetailModal: React.FC<Props> = ({ open, editData, onEdit, onReload, onClose }) => {
  const { updateProductVariant } = useProductVariantData({
    productId: editData?.id,
    onCloseModal: onReload,
  });

  if (!editData) return null;

  const handleUpdate = onEdit
    ? (data: Partial<IProduct>) => {
        onEdit?.({ ...data, id: editData.id });
      }
    : undefined;

  const handleVariantUpdate = updateProductVariant
    ? (data: Partial<IProductVariant>) => {
        updateProductVariant({ ...data, id: editData.variants[0].id });
      }
    : undefined;

  return (
    <Modal
      title={"Chi tiết sản phẩm"}
      open={open}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
      width={752}
      onCancel={onClose}
    >
      <div className="flex flex-col mt-4 pt-4 max-h-[85vh] overflow-y-auto scrollbar-hide">
        <Row gutter={[96, 22]}>
          <Col span={12}>
            <EditableInfoCol<IProduct>
              label="Mã sản phẩm"
              value={editData.code}
              fieldKey={"code"}
              required
              editComponent={<Input className="h-8" placeholder="Nhập mã sản phẩm" />}
              onUpdate={handleUpdate}
            />
          </Col>
          <Col span={12}>
            <EditableInfoCol<IProduct>
              label="Tên sản phẩm"
              value={editData.name}
              fieldKey={"name"}
              required
              editComponent={<Input className="h-8" placeholder="Nhập tên sản phẩm" />}
              onUpdate={handleUpdate}
            />
          </Col>
          <Col span={12}>
            <EditableInfoCol<IProduct>
              label="Danh mục"
              value={editData.category?.name}
              fieldKey={"categoryId"}
              required
              editComponent={<ProductGroupSelect defaultData={editData.category} />}
              onUpdate={handleUpdate}
            />
          </Col>
          <Col span={12}>
            <EditableInfoCol<IProduct>
              label="Đơn vị tính"
              value={editData.unit?.name}
              fieldKey={"unitId"}
              required
              editComponent={
                <AttributeSelect
                  type={AttributeTypeEnum.PRODUCT_UNIT}
                  defaultData={editData.unit}
                />
              }
              onUpdate={handleUpdate}
            />
          </Col>
          <Col span={12}>
            <EditableInfoCol<IProductVariant>
              label="Giá nhập hàng"
              value={formatMoney(editData.variants[0]?.costPrice)}
              fieldKey={"costPrice"}
              editComponent={<InputMoney placeholder="Giá nhập hàng" notRightAlign />}
              onUpdate={handleVariantUpdate}
            />
          </Col>
          <Col span={12}>
            <EditableInfoCol<IProductVariant>
              label="Giá bán"
              value={formatMoney(editData.variants[0]?.price)}
              fieldKey={"price"}
              editComponent={<InputMoney placeholder="Giá bán" notRightAlign />}
              onUpdate={handleVariantUpdate}
            />
          </Col>
          <Col span={12}>
            <EditableInfoCol<IProductVariant>
              label="Mã vạch"
              value={editData.variants[0]?.barcode}
              fieldKey={"barcode"}
              editComponent={<Input placeholder="Nhập mã vạch" className="h-8" />}
              onUpdate={handleVariantUpdate}
            />
          </Col>
          <Col span={12}>
            <EditableInfoCol<IProduct>
              label="%VAT"
              value={formatPercentage(editData.taxRate)}
              fieldKey={"taxRate"}
              editComponent={<InputPercentage placeholder="Nhập %VAT" notRightAlign />}
              onUpdate={handleUpdate}
            />
          </Col>
          <Col span={24} className=" min-h-[132px]">
            <EditableInfoCol<IProduct>
              label="Mô tả sản phẩm"
              value={editData.note}
              fieldKey={"note"}
              editComponent={
                <Input.TextArea
                  placeholder="Nhập mô tả sản phẩm"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  count={{ max: 500, show: true }}
                />
              }
              onUpdate={handleUpdate}
            />
          </Col>
          <Col span={24}>
            <div className="flex flex-col">
              <Label title="Hình ảnh" width={100} />
              {handleUpdate ? (
                <ImageUploadBox
                  entity={FileEntityEnum.PRODUCT}
                  oId={editData.id}
                  maxCount={12}
                  category={FileCategoryEnum.ALBUM}
                  defaultFiles={editData.album}
                  hasSetMain
                  isActive
                  onReload={onReload}
                />
              ) : (
                <SquareImageGroup images={editData.album} size={100} />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default DetailModal;
