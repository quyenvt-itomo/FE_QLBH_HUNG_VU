import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, Form, Input, message, Modal, Row, Select, Spin } from "antd";
import { Organization, useOrganizationStore } from "@/modules/organization";
import StoreImage from "@/shared/components/image/StoreImage";
import { getMainFile } from "@/shared/utils/file.util";
import {
  QuotationRequest,
  QuotationRequestLine,
  useQuotationRequestStore,
} from "@/modules/quotationRequest";
import Label from "@/shared/components/display/Label";
import { FormSection } from "@/shared/components/form/FormSection";
import { getPhoneRules, getTaxCodeRules, taxCodeRule } from "@/shared/constants/formItemRule";
import { publicRoutesName } from "@/shared/constants/routerName";
import { PublicProductMultipleSelect } from "@/modules/product/components/Select";
import { InputQuantity } from "@/shared/components/input";
import { FormColumn, FormListTable } from "@/shared/components/form/FormListTable";
import { randomId, resolveByPath } from "@/shared/utils/common.util";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { EntityFile, FileCategory } from "@/shared/constants/enum";
import { ProvinceSelect, WardSelect } from "@/shared/components/select/AddressSelect";
import { useAddressSelector } from "@/shared/hooks/useAddressSelector";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { collectProduct, collectUnits, Product } from "@/modules/product";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { AppSelect } from "@/shared/components/select/AppSelect";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import useDebounce from "@/shared/hooks/useDebounce";
import { usePartnerStore } from "@/modules/partner/partner.store";
import { Icon } from "@iconify/react";

const QuotationRequestPage: React.FC = () => {
  const { companyCode } = useParams();
  const id = randomId();
  const [form] = Form.useForm<QuotationRequest>();
  const { createPublic } = useQuotationRequestStore({ isLocked: true });
  const { getByTaxCode: getPartnerByTaxCode } = usePartnerStore({
    isLocked: true,
  });

  const customer = Form.useWatch("customer", form);
  const taxCode = Form.useWatch(["customerSnapshot", "taxCode"], form);
  const requesterPhone = Form.useWatch(["requesterSnapshot", "phone"], form);

  const debouncedTaxCode = useDebounce(taxCode, 600);
  const debouncedRequesterPhone = useDebounce(requesterPhone, 600);

  const lines = Form.useWatch("lines", form) || [];
  const state = Form.useWatch(["customerSnapshot", "address", "state"], form);
  const [defaultProduct, setDefaultProduct] = useAutoResetItem<Product>();
  const [company, setStore] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdCode, setCreatedCode] = useState("");
  const { getByCode: getOrgByCode } = useOrganizationStore({ isLocked: true });
  const { message, showFormErrorMessages } = useAppMessage();

  const { provinceOptions, wardOptions } = useAddressSelector(state);
  useEffect(() => {
    if (!companyCode) return;
    (async () => {
      const org = await getOrgByCode(companyCode);
      setStore(org);
      if (org) localStorage.setItem("x-company-id", org.id);
      setLoading(false);
    })();
  }, [companyCode]);

  // Debounce: khi nhập mã số thuế → tìm partner → auto-fill form
  useEffect(() => {
    if (!debouncedTaxCode || !taxCodeRule.pattern.test(debouncedTaxCode)) {
      // Không đúng định dạng MST → xóa hidden fields, giữ snapshot
      form.setFieldsValue({
        customerId: undefined,
        customer: undefined,
        requesterId: undefined,
        requester: undefined,
      });
      return;
    }
    (async () => {
      const partner = await getPartnerByTaxCode(debouncedTaxCode);
      if (!partner) {
        // Không tìm thấy → xóa hidden fields
        form.setFieldsValue({
          customerId: undefined,
          customer: undefined,
          requesterId: undefined,
          requester: undefined,
          staffId: undefined,
        });
        return;
      }
      form.setFieldsValue({
        customerId: partner.id,
        customer: partner,
        customerSnapshot: partner,
        requesterId: undefined,
        requester: undefined,
        staffId: partner.staffId,
      } as any);
    })();
  }, [debouncedTaxCode]);

  // Debounce: khi nhập SĐT người báo giá → tìm contact trong customer
  useEffect(() => {
    if (!debouncedRequesterPhone || debouncedRequesterPhone.length < 8) return;

    if (!customer) {
      form.setFieldsValue({ requesterId: undefined, requester: undefined });
      return;
    }

    const contacts = customer.contacts || [];
    const existingContact = contacts.find((c) => c.phone === debouncedRequesterPhone);

    if (existingContact) {
      form.setFieldsValue({
        requesterId: existingContact.id,
        requester: existingContact,
        requesterSnapshot: existingContact,
      } as any);
    } else {
      form.setFieldsValue({
        requesterId: undefined,
        requester: undefined,
      });
    }
  }, [debouncedRequesterPhone, customer]);

  const onFinish = async (values: QuotationRequest) => {
    if (!values.lines || values.lines.length === 0) {
      message.error("Vui lòng thêm ít nhất 1 hàng hóa");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createPublic({
        ...values,
        storeId: company?.id,
      });
      if (result) {
        setCreatedCode(result.code || "");
        setSuccessModalOpen(true);
      }
    } catch (err: any) {
      message.error(err?.message || "Gửi yêu cầu thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && !company) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-white">
        <img
          src="/images/not-found-company.svg"
          alt="Không tìm thấy công ty"
          className="w-full max-w-md"
        />
        <p className="text-gray-500 text-lg">Công ty không tồn tại hoặc đường dẫn không hợp lệ.</p>
      </div>
    );
  }

  const lineColumns: FormColumn<QuotationRequestLine>[] = [
    {
      title: "STT",
      dataIndex: "__idx",
      width: 50,
      align: "center",
      render: ({ index }) => index + 1,
    },
    {
      title: "Hàng hóa",
      dataIndex: "productName",
      width: 250,
      render: ({ record }) => resolveByPath(record, ["product", "name"]) || "--",
    },
    {
      title: "ĐVT",
      dataIndex: "unitId",
      width: 100,
      align: "center",
      render: ({ record, form, name }) => {
        const p = record?.product;
        if (!p) return null;
        const units = collectUnits(p, record?.unit);
        return (
          <AppSelect
            className={`text-center w-full`}
            options={units.map((u) => ({ value: u.id, label: u.name }))}
            suffixIcon={null}
            value={record?.unitId}
            onChange={(value: string) => {
              const unit = units.find((u) => u.id === value);
              form.setFieldValue(["lines", name, "unitId"], value);
              form.setFieldValue(["lines", name, "unit"], unit);
            }}
            variant="borderless"
          />
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 100,
      align: "center",
      editable: true,
      rules: [
        { required: true, message: "Nhập SL" },
        {
          min: 1,
          type: "number",
          message: "Số lượng tối thiếu là 1",
        },
      ],
      render: () => <InputQuantity min={1} placeholder="SL" variant="borderless" />,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      editable: true,
      render: () => <Input placeholder="Ghi chú" variant="borderless" />,
    },
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-gray-100 relative">
      <div className="flex justify-center left-0 w-full h-12 xl:h-16 flex-shrink-0 bg-primary shadow-sm">
        <div className="flex justify-between items-center w-full max-w-7xl h-full px-4">
          <div className="flex items-center gap-6">
            <StoreImage image={getMainFile(company?.logo)} />
            <span className="text-white text-base md:text-xl lg:text-2xl font-bold uppercase">
              {company?.name}
            </span>
          </div>
          <span className="text-white text-base md:text-xl lg:text-2xl font-bold uppercase">
            Đề nghị báo giá
          </span>
        </div>
      </div>

      <div className="w-full h-[calc(100%-48px)] xl:h-[calc(100%-64px)] overflow-x-hidden overflow-y-auto px-10 py-6">
        <div className="flex flex-col min-h-full h-fit w-full max-w-screen-2xl bg-white shadow-lg rounded-lg mx-auto">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={showFormErrorMessages}
            initialValues={{ lines: [] }}
          >
            <div className="flex flex-col lg:flex-row overflow-y-auto gap-x-4 p-6 pb-4">
              <div className="w-full lg:w-2/5 flex flex-col">
                <FormSection title="Thông tin đơn vị đề nghị">
                  <Row gutter={[32, 0]}>
                    <Col span={12}>
                      <Form.Item name="customerId" hidden />
                      <Form.Item name="customer" hidden />
                      <Form.Item name="staffId" hidden />
                      <Form.Item
                        name={["customerSnapshot", "name"]}
                        label={<Label title="Tên đơn vị" required />}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên đơn vị",
                          },
                        ]}
                      >
                        <Input placeholder="Tên đơn vị đề nghị" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["customerSnapshot", "taxCode"]}
                        label={<Label title="Mã số thuế" required />}
                        rules={getTaxCodeRules(true)}
                      >
                        <Input placeholder="Mã số thuế" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["customerSnapshot", "phone"]}
                        label={<Label title="Số điện thoại" />}
                        rules={getPhoneRules()}
                      >
                        <Input placeholder="Số điện thoại liên hệ" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label={<Label title="Email" />}
                        rules={[
                          {
                            type: "email",
                            message: "Vui lòng nhập email hợp lệ",
                          },
                        ]}
                      >
                        <Input placeholder="Email chính" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Label title="Địa chỉ" bold height={20} />
                    </Col>
                    <Col span={12}>
                      <Form.Item name={["customerSnapshot", "address", "state"]}>
                        <ProvinceSelect
                          options={provinceOptions}
                          onChange={(value) => {
                            form.setFieldValue(
                              ["customerSnapshot", "address", "state"] as any,
                              value,
                            );
                            form.setFieldValue(
                              ["customerSnapshot", "address", "ward"] as any,
                              undefined,
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name={["customerSnapshot", "address", "ward"]}>
                        <WardSelect options={wardOptions} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name={["customerSnapshot", "address", "detail"]}>
                        <Input placeholder="Địa chỉ chi tiết" />
                      </Form.Item>
                    </Col>
                  </Row>
                </FormSection>

                <Form.Item name="requesterId" hidden />
                <Form.Item name="requester" hidden />
                <FormSection title="Thông tin người đề nghị">
                  <Row gutter={[32, 0]}>
                    <Col span={12}>
                      <Form.Item
                        name={["requesterSnapshot", "name"]}
                        label={<Label title="Họ và tên" required />}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên người đề nghị",
                          },
                        ]}
                      >
                        <Input placeholder="Họ và tên" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["requesterSnapshot", "phone"]}
                        label={<Label title="Số điện thoại" required />}
                        rules={getPhoneRules(true)}
                      >
                        <Input placeholder="Số điện thoại người đề nghị" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["requesterSnapshot", "email"]}
                        label={<Label title="Email" />}
                        rules={[
                          {
                            type: "email",
                            message: "Vui lòng nhập email hợp lệ",
                          },
                        ]}
                      >
                        <Input placeholder="Email người đề nghị" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="note" label={<Label title="Lời nhắn" />}>
                        <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </FormSection>
              </div>

              <div className="w-full flex flex-col lg:w-3/5">
                <FormSection title="Tài liệu báo giá">
                  <div className="flex flex-col gap-5">
                    <div className="flex w-full gap-8">
                      <FileUploadBox
                        category={FileCategory.DOCUMENT}
                        entity={EntityFile.PURCHASE_QUOTATION}
                        oId={id}
                        maxCount={1}
                        placeholder={
                          <div className="flex flex-col">
                            <span className="text-xs">Tài liệu đề nghị (PDF, Excel, Word)</span>
                            <span className="text-2xs text-gray-400">
                              Tối đa 1 file, dung lượng tối đa 10MB/file
                            </span>
                          </div>
                        }
                      />
                      <FileUploadBox
                        category={FileCategory.ATTACHMENT}
                        entity={EntityFile.PURCHASE_QUOTATION}
                        oId={id}
                        maxCount={3}
                        placeholder={
                          <div className="flex flex-col">
                            <span className="text-xs">Tệp đính kèm (PDF, Excel, Word)</span>
                            <span className="text-2xs text-gray-400">
                              Tối đa 3 file, dung lượng tối đa 10MB/file
                            </span>
                          </div>
                        }
                      />
                    </div>
                    <FormListTable
                      form={form}
                      fieldName="lines"
                      columns={lineColumns}
                      records={lines}
                      showDelete
                      title="Danh sách hàng hóa đề nghị báo giá"
                      renderAdd={(add) => (
                        <PublicProductMultipleSelect
                          defaultData={defaultProduct ? [defaultProduct] : undefined}
                          value={defaultProduct ? [defaultProduct.id] : undefined}
                          onChangeData={(values) => {
                            const data = values?.[0];
                            setDefaultProduct(data);
                            if (!data) return;
                            add({
                              productId: data.id,
                              product: data,
                              unitId: data.baseUnitId,
                              unit: data.baseUnit,
                            });
                          }}
                          hideOptions={collectProduct(lines)}
                          prefix={<MagnifyingGlassIcon className="w-6 h-6 text-secondary" />}
                          suffixIcon={false}
                          placeholder="Tìm kiếm và chọn hàng hóa để thêm"
                        />
                      )}
                    />
                  </div>
                </FormSection>
              </div>
            </div>
          </Form>

          <div className="flex justify-center gap-4 pb-4 mt-auto mb-0">
            <Button
              type="primary"
              htmlType="button"
              loading={submitting}
              onClick={() => form.submit()}
              className="h-11 w-44 uppercase font-semibold"
            >
              Gửi yêu cầu
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex h-full w-full items-center justify-center absolute top-0 left-0 bg-white/20">
          <Spin size="large" />
        </div>
      )}

      <Modal
        open={successModalOpen}
        closeIcon={false}
        maskClosable={false}
        width={680}
        footer={
          <div className="flex items-center justify-center gap-3">
            <Button
              key="close"
              danger
              onClick={() => {
                window.close();
              }}
            >
              Đóng trang
            </Button>
            <Button
              key="continue"
              onClick={() => {
                window.location.reload();
              }}
            >
              Tiếp tục tạo
            </Button>
            <Button
              key="detail"
              type="primary"
              onClick={() => {
                const url = publicRoutesName.quotationRequestDetail
                  .replace(":companyCode", companyCode || "")
                  .replace(":code", createdCode);
                window.location.href = url;
              }}
            >
              Xem chi tiết
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center py-2">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-5">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100">
              <Icon icon="meteor-icons:badge-check" className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Gửi đề nghị báo giá thành công!
          </h3>

          <p className="text-gray-500 mb-5">Cảm ơn bạn đã gửi yêu cầu đến chúng tôi.</p>

          <div className="w-full max-w-md rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 mb-5">
            <p className="text-sm text-gray-500 mb-1">Số đề nghị báo giá</p>
            <p className="text-lg font-semibold text-gray-800">{createdCode}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon icon="meteor-icons:clock" className="w-4 h-4" />
            <span>Chúng tôi sẽ xử lý và phản hồi trong thời gian sớm nhất.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuotationRequestPage;
