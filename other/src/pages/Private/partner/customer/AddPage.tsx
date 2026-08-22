import { Form, FormInstance, Upload, UploadFile, UploadProps } from "antd";
import { IPartner } from "../../../../models/partner";
import { useEffect, useRef, useCallback, useState } from "react";
import { formatFormData, parseFormDataDates } from "../../../../utils/dateUtils";
import { setFormErrors } from "../../../../utils/formUtils";
import { useNavigate } from "react-router-dom";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { privateRoutesName } from "../../../../constants/routerName";
import { CustomerInfo } from "./components/AddPage/CustomerInfo";
import ContactList from "./components/AddPage/Contact";
import SubmitButton from "../../../../components/button/SubmitButton";
import { handlePreview } from "../../../../utils/base64";
import UserImage from "../../../../components/image/UserImage";
import { useClientData } from "../../../../hooks/core/useClientData";
import AnchorInfo from "./components/AddPage/Anchor";
import Title from "../../../../components/display/Title";
import { FileCategoryEnum, FileEntityEnum, PartnerTypeEnum } from "../../../../constants/enum";
import { randomId } from "../../../../utils/common";
import { useCustomerData } from "../../../../hooks/partner/useCustomerData";
import AvatarUpload from "../../../../components/upload/AvatarUpload";

export interface PartialProps {
  form: FormInstance<IPartner>;
  onFormChange?: () => void;
  loading?: boolean;
}

const AddPage: React.FC = () => {
  const [form] = Form.useForm<IPartner>();
  const { horizontal } = useClientData();
  const isOrganization = Form.useWatch("isOrganization", form);
  const tempId = Form.useWatch("tempId", form) || "";

  const navigate = useNavigate();

  const { loading, errors, newCustomer, addCustomer } = useCustomerData({
    isLockHook: true,
    onCloseModal: () => {
      navigate(privateRoutesName.customer.page, { replace: true });
    },
  });

  useEffect(() => {
    setFormErrors(form, errors);
  }, [errors]);

  const handleFinish = (values: IPartner) => {
    addCustomer?.({
      ...values,
      subTypes: values.subTypes?.filter((i) => i.groupId !== undefined),
    });
  };
  const handleFormChange = () => {};

  return (
    <div className="flex flex-col gap-4 h-full w-full relative">
      <div className="flex gap-4">
        <div className="flex flex-col h-full gap-4 employee-info bg-white rounded-lg pt-8">
          <div style={{ width: 100, height: 100 }} className="ml-auto mr-auto select-none mb-4">
            <AvatarUpload
              shape="circle"
              size={100}
              limit={50}
              entity={FileEntityEnum.CUSTOMER}
              category={FileCategoryEnum.AVATAR}
              oId={tempId}
            />
          </div>

          <div
            className={`flex-1 w-full overflow-x-hidden ml-4 overflow-y-auto ${
              horizontal ? "pr-4" : "pr-0"
            }`}
          >
            <AnchorInfo />
          </div>
        </div>
        <Form
          form={form}
          onFinish={handleFinish}
          className="flex w-full gap-4 h-[calc(100vh-80px)]"
          initialValues={{
            tempId: randomId(),
            isOrganization: false,
            subTypes: [
              {
                type: PartnerTypeEnum.SUPPLIER,
                enabled: false,
              },
              {
                type: PartnerTypeEnum.SHIPPER,
                enabled: false,
              },
            ],
          }}
        >
          <Form.Item name="tempId" hidden />
          <div className="w-full flex flex-col bg-white rounded-lg px-12 gap-4 overflow-y-auto overflow-x-hidden">
            <div className="sticky top-0 z-10 bg-white border-b py-4 flex justify-between items-center">
              <Title content="Thêm khách hàng" level={2} />
              <SubmitButton
                onCancel={() => {
                  navigate(privateRoutesName.customer.page);
                }}
                loading={loading}
              />
            </div>
            <CustomerInfo form={form} onFormChange={handleFormChange} />
            {isOrganization && <ContactList form={form} onFormChange={handleFormChange} />}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddPage;
