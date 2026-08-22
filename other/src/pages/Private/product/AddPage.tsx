import { Button, Form, FormInstance } from "antd";
import { BaseInfo } from "./components/AddPage/BaseInfo";
import { getDefaultVariant, randomId } from "../../../utils/common";
import { OptionInfo } from "./components/AddPage/OptionInfo";
import { useEffect } from "react";
import { setFormCode, setFormErrors } from "../../../utils/formUtils";
import { useNavigate } from "react-router-dom";
import { buildUrlWithId } from "../../../utils/paramUtils";
import { privateRoutesName } from "../../../constants/routerName";
import { IProduct } from "../../../models/product";
import { useProductData } from "../../../hooks/product/useProductData";
import { VariantInfo } from "./components/AddPage/VariantInfo";
import CustomPageTitle from "../../../layout/Private/header/components/PageTitle";
import { BackButton } from "../../../components/button/BackButton";
import { Icon } from "@iconify/react";

export interface PartialProps {
  form: FormInstance<IProduct>;
  id: string;
}

const AddPage: React.FC = () => {
  const [form] = Form.useForm<IProduct>();
  const id = randomId();
  const navigate = useNavigate();

  const { newProduct, loading, errors, addProduct } = useProductData({
    isLockHook: true,
  });

  const handleFinish = (values: IProduct) => {
    addProduct?.({
      ...values,
      id,
      tempId: id,
    });
  };

  useEffect(() => {
    const defaultData = getDefaultVariant();
    form.setFieldsValue(defaultData);
    setFormCode({ form, type: "product", field: "code" });
  }, []);

  useEffect(() => {
    if (!newProduct) return;
    form.resetFields();
    const url = buildUrlWithId(privateRoutesName.product.detail, newProduct.id);
    navigate(url, { replace: true });
  }, [newProduct]);

  useEffect(() => {
    setFormErrors(form, errors);
  }, [errors, form]);

  return (
    <Form
      layout="vertical"
      form={form}
      className="flex flex-col gap-2 h-full w-full relative"
      onFinish={handleFinish}
      initialValues={{ hasVariant: true }}
    >
      <div className="flex justify-between items-center">
        <CustomPageTitle />
        <div className="flex gap-3">
          <BackButton align="right" />
          <Button type="primary" htmlType="submit" loading={loading} className="w-1/2 h-8 rounded">
            <Icon icon="material-symbols-light:save-outline" width="24" height="24" />
            Lưu
          </Button>
        </div>
      </div>
      <Form.Item name="hasVariant" hidden />
      <div className="flex gap-6 w-full h-[calc(100%-40px)]">
        <div className="w-[684px] h-full bg-white border rounded-lg px-6 overflow-y-auto scrollbar-hide pb-6">
          <BaseInfo form={form} id={id} />
          <OptionInfo form={form} id={id} />
        </div>
        <div className="w-[calc(100%-708px)] h-full bg-white border rounded-lg px-6 overflow-y-auto scrollbar-hide">
          <VariantInfo form={form} id={id} />
        </div>
      </div>

      {/* <div
        className="
        flex justify-center items-center w-full gap-6 absolute bottom-0 pt-4 pb-4
        bg-gradient-to-t from-[#f8f9fd] to-[#f8f9fd0A]
        "
      >
        <SubmitButton size="large" loading={loading} onCancel={() => navigate(-1)} />
      </div> */}
    </Form>
  );
};

export default AddPage;
