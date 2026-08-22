import React from "react";
import Title from "../../../../../components/display/Title";
import Label from "../../../../../components/display/Label";
import { Col, Input, Row } from "antd";
import UnitSelect from "../../../../../components/manager_select/AttributeSelect";
import { AttributeTypeEnum, FileCategoryEnum, FileEntityEnum } from "../../../../../constants/enum";
import ImageUploadBox from "../../../../../components/upload/ImageUploadBox";
import { PartialProps } from "../../DetailPage";
import { IProduct } from "../../../../../models/product";
import EditableInfoCol from "../../../../../components/display/EditableInfoCol";
import { InputPercentage } from "../../../../../components/input";
import { formatPercentage } from "../../../../../utils/formatNumber";
import SquareImageGroup from "../../../../../components/image/SquareImageGroup";

export const BasicInfo: React.FC<PartialProps> = ({ data, onReload, onUpdate }) => {
  if (!data) return <></>;

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex flex-col">
        <div className="bg-white w-full pt-3">
          <Title content="Thông tin hàng hóa" />
        </div>
        <div className="flex h-4 bg-gradient-to-t from-transparent to-white" />
      </div>

      <Row gutter={[48, 22]}>
        <Col span={12}>
          <EditableInfoCol<IProduct>
            label="Mã sản phẩm"
            value={data.code}
            fieldKey="code"
            required
            editComponent={<Input className="h-8" placeholder="Nhập mã sản phẩm" />}
            onUpdate={onUpdate}
          />
        </Col>
        <Col span={12}>
          <EditableInfoCol<IProduct>
            label="Tên sản phẩm"
            value={data.name}
            fieldKey="name"
            required
            editComponent={<Input className="h-8" placeholder="Nhập tên sản phẩm" />}
            onUpdate={onUpdate}
          />
        </Col>
        <Col span={12}>
          <EditableInfoCol<IProduct>
            label="Danh mục"
            value={data.category?.name}
            editValue={data.categoryId}
            fieldKey="categoryId"
            required
            editComponent={
              <UnitSelect type={AttributeTypeEnum.PRODUCT_CATEGORY} defaultData={data.category} />
            }
            onUpdate={onUpdate}
          />
        </Col>
        <Col span={12}>
          <EditableInfoCol<IProduct>
            label="Đơn vị tính"
            value={data.unit?.name}
            editValue={data.unitId}
            fieldKey="unitId"
            required
            editComponent={
              <UnitSelect type={AttributeTypeEnum.PRODUCT_UNIT} defaultData={data.unit} />
            }
            onUpdate={onUpdate}
          />
        </Col>
        <Col span={12} className="min-h-36">
          <EditableInfoCol<IProduct>
            label="Mô tả"
            value={data.note}
            fieldKey="note"
            editComponent={
              <Input.TextArea
                placeholder="Nhập mô tả"
                rows={3}
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            }
            isTextArea
            onUpdate={onUpdate}
          />
        </Col>
        <Col span={12}>
          <EditableInfoCol<IProduct>
            label="%VAT"
            value={formatPercentage(data.taxRate)}
            fieldKey="taxRate"
            editComponent={<InputPercentage placeholder="Nhập %VAT" notRightAlign />}
            onUpdate={onUpdate}
          />
        </Col>
        <Col span={24}>
          <div className="flex flex-col">
            <Label title="Hình ảnh" />
            {onUpdate ? (
              <ImageUploadBox
                entity={FileEntityEnum.PRODUCT}
                oId={data.id}
                maxCount={12}
                category={FileCategoryEnum.ALBUM}
                defaultFiles={data.album}
                hasSetMain
                isActive
                onReload={onReload}
              />
            ) : (
              <SquareImageGroup images={data.album} />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};
