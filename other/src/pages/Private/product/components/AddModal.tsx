import React, { useEffect } from "react";
import { Input, Modal, Form, Row, Col } from "antd";
import { FormProps } from "antd/lib";
import { AddUpdateModalProps } from "../../../../models/base/interface";
import { setFormCode, setFormErrors } from "../../../../utils/formUtils";
import { formatFormData } from "../../../../utils/dateUtils";
import SubmitButton from "../../../../components/button/SubmitButton";
import AttributeSelect from "../../../../components/manager_select/AttributeSelect";
import { AttributeTypeEnum, FileCategoryEnum, FileEntityEnum } from "../../../../constants/enum";
import { randomId } from "../../../../utils/common";
import Label from "../../../../components/display/Label";
import { IProduct } from "../../../../models/product";
import { InputMoney, InputPercentage } from "../../../../components/input";
import ImageUploadBox from "../../../../components/upload/ImageUploadBox";
import ProductGroupSelect from "../../../../components/tree_select/ProductGroupSelect";
import { useClientData } from "../../../../hooks/core/useClientData";
import { checkAnyModule } from "../../../../utils/permissionUtils";

const AddModal: React.FC<AddUpdateModalProps<IProduct>> = ({
  open,
  loading,
  errors,
  onAdd,
  onClose,
}) => {
  const [form] = Form.useForm<IProduct>();
  const id = randomId();
  const { permissions } = useClientData();

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<IProduct>["onFinish"] = async (values: IProduct) => {
    const formattedData = formatFormData({
      ...values,
      id,
      tempId: id,
    });

    onAdd?.(formattedData);
  };

  const handleCancel = () => {
    onClose?.();
    form.resetFields();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.resetFields();
      return;
    }
    setFormCode({ form, type: "product", field: "code" });
  };

  return (
    <Modal
      title={"Thêm sản phẩm mới"}
      open={open}
      footer={null}
      destroyOnClose
      maskClosable={false}
      centered
      width={752}
      onCancel={handleCancel}
      afterOpenChange={handleOpenChange}
    >
      <Form
        layout="vertical"
        className="flex flex-col mt-4 pt-4"
        form={form}
        onFinish={onFinish}
        initialValues={{
          hasVariant: false,
          variants: [
            {
              isActive: true,
            },
          ],
        }}
      >
        <Form.Item name="hasVariant" hidden />
        <Form.Item name={["variants", 0, "isActive"]} hidden />
        <Row gutter={[64, 0]}>
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
              <ProductGroupSelect />
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
          {checkAnyModule(permissions, ["purchaseOrder", "purchaseReturn"]) && (
            <Col span={12}>
              <Form.Item name={["variants", 0, "costPrice"]} label={<Label title="Giá nhập" />}>
                <InputMoney placeholder="Giá nhập hàng" notRightAlign />
              </Form.Item>
            </Col>
          )}

          {checkAnyModule(permissions, ["saleOrder", "saleReturn"]) && (
            <Col span={12}>
              <Form.Item name={["variants", 0, "price"]} label={<Label title="Giá bán" />}>
                <InputMoney placeholder="Giá bán" notRightAlign />
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item name={["variants", 0, "barcode"]} label={<Label title="Mã vạch" />}>
              <Input placeholder="Nhập mã vạch" className="h-8" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="taxRate" label={<Label title="%VAT" />}>
              <InputPercentage placeholder="Nhập %VAT" notRightAlign />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="note" label={<Label title="Mô tả sản phẩm" />}>
              <Input.TextArea
                placeholder="Nhập mô tả sản phẩm"
                autoSize={{ minRows: 3, maxRows: 6 }}
                count={{ max: 500, show: true }}
              />
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

        <div className="flex w-full justify-center mt-4">
          <SubmitButton loading={loading} onCancel={handleCancel} />
        </div>
      </Form>
    </Modal>
  );
};

export default AddModal;
