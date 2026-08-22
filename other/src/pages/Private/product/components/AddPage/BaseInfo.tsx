import { Col, Form, Input, Row } from "antd";
import { PartialProps } from "../../AddPage";
import Label from "../../../../../components/display/Label";
import AttributeSelect from "../../../../../components/manager_select/AttributeSelect";
import { AttributeTypeEnum, FileCategoryEnum, FileEntityEnum } from "../../../../../constants/enum";
import Title from "../../../../../components/display/Title";
import ImageUploadBox from "../../../../../components/upload/ImageUploadBox";
import { InputPercentage } from "../../../../../components/input";

export const BaseInfo: React.FC<PartialProps> = ({ form, id }) => {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex flex-col">
        <div className="bg-white w-full pt-3">
          <Title content="Thông tin hàng hóa" />
        </div>
        <div className="flex h-4 bg-gradient-to-t from-transparent to-white" />
      </div>
      <Row gutter={[48, 0]}>
        <Col span={12}>
          <Form.Item
            name="code"
            label={<Label title="Mã sản phẩm" required />}
            rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm" }]}
          >
            <Input className="h-8" placeholder="Nhập mã sản phẩm" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="name"
            label={<Label title="Tên sản phẩm" required />}
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input className="h-8" placeholder="Nhập tên sản phẩm" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="categoryId"
            label={<Label title="Danh mục" required />}
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <AttributeSelect type={AttributeTypeEnum.PRODUCT_CATEGORY} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="unitId"
            label={<Label title="Đơn vị tính" required />}
            rules={[{ required: true, message: "Vui lòng chọn đơn vị tính" }]}
          >
            <AttributeSelect type={AttributeTypeEnum.PRODUCT_UNIT} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="note" label={<Label title="Mô tả sản phẩm" />}>
            <Input.TextArea
              placeholder="Nhập mô tả sản phẩm"
              autoSize={{ minRows: 2, maxRows: 6 }}
              count={{ max: 500, show: true }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="taxRate" label={<Label title="%VAT" />}>
            <InputPercentage placeholder="Nhập %VAT" notRightAlign />
          </Form.Item>
        </Col>
        <Col span={24}>
          <div className="flex flex-col">
            <Label title="Hình ảnh" width={100} />
            <ImageUploadBox
              entity={FileEntityEnum.PRODUCT}
              oId={id}
              maxCount={12}
              category={FileCategoryEnum.ALBUM}
              hasSetMain
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
