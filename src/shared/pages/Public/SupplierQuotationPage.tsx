import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, message, Row, Spin } from "antd";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { Organization, useOrganizationStore } from "@/modules/organization";
import CompanyImage from "@/shared/components/image/CompanyImage";
import { getMainFile } from "@/shared/utils/file.util";
import {
  PurchaseQuotation,
  PurchaseQuotationLine,
  usePurchaseQuotationStore,
} from "@/modules/purchaseQuotation";
import Label from "@/shared/components/display/Label";
import { EntityFile, FileCategory } from "@/shared/constants/enum";
import { randomId } from "@/shared/utils/common.util";
import { FormSection } from "@/shared/components/form/FormSection";
import { ProvinceSelect, WardSelect } from "@/shared/components/select/AddressSelect";
import { useAddressSelector } from "@/shared/hooks/useAddressSelector";
import FormListTable, { FormColumn } from "@/shared/components/form/FormListTable";
import { InputMoney, InputPercentage } from "@/shared/components/input";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { CLASSNAME } from "@/shared/constants/ui";
import { makeFormListEnterHandler } from "@/shared/utils/formListKeyboard";
import { useReferralCodeStore, ReferralCodeCardPublic } from "@/modules/referralCode";
import { getPhoneRules, getTaxCodeRules, taxCodeRule } from "@/shared/constants/formItemRule";
import { CalculationUtil } from "@/shared/utils/calculation.util";
import { usePartnerStore } from "@/modules/partner";
import useDebounce from "@/shared/hooks/useDebounce";
import { publicRoutes } from "@/routes";
import { publicRoutesName } from "@/shared/constants/routerName";
import { maskText } from "@/shared/utils/common.util";
import { Modal } from "antd";
import { Icon } from "@iconify/react";

const SupplierQuotationPage: React.FC = () => {
  const { companyCode } = useParams();
  const id = randomId();
  const [form] = Form.useForm<PurchaseQuotation>();
  const [company, setCompany] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const { getByCode: getOrgByCode } = useOrganizationStore({ isLocked: true });
  const { getByTaxCode: getPartnerByTaxCode } = usePartnerStore({
    isLocked: true,
  });
  const { getByCode: getRCByCode } = useReferralCodeStore({ isLocked: true });
  const { createPublic } = usePurchaseQuotationStore({ isLocked: true });
  const supplier = Form.useWatch("supplier", form);
  const taxCode = Form.useWatch(["supplierSnapshot", "taxCode"], form);
  const quoterPhone = Form.useWatch(["quoterSnapshot", "phone"], form);
  const debouncedTaxCode = useDebounce(taxCode, 600);
  const debouncedQuoterPhone = useDebounce(quoterPhone, 600);
  const code = Form.useWatch("code", form);
  const referralCode = Form.useWatch("referralCode", form);
  const lines = Form.useWatch("lines", form) || [];
  const state = Form.useWatch(["supplierSnapshot", "address", "state"], form);
  const calculateAmountUtil = new CalculationUtil();
  const { provinceOptions, wardOptions } = useAddressSelector(state);
  const [pendingCodeData, setPendingCodeData] = useState<any>(null);
  const [verifyTaxCodeInput, setVerifyTaxCodeInput] = useState("");
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdCode, setCreatedCode] = useState("");

  const handleFetchCompany = async (code: string) => {
    const companyData = await getOrgByCode(code);

    setCompany(companyData);
    setLoading(false);
    if (!companyData) {
      localStorage.removeItem("x-company-id");
      return;
    }
    localStorage.setItem("x-company-id", companyData.id);
  };

  useEffect(() => {
    if (!companyCode) return;
    handleFetchCompany(companyCode);
  }, [companyCode]);

  // Debounce: khi nhập mã số thuế → tìm partner → auto-fill form
  useEffect(() => {
    if (!debouncedTaxCode || !taxCodeRule.pattern.test(debouncedTaxCode)) {
      // Không đúng định dạng MST → xóa hidden fields, giữ snapshot
      form.setFieldsValue({
        supplierId: undefined,
        supplier: undefined,
        quoterId: undefined,
        quoter: undefined,
      });
      return;
    }
    (async () => {
      const partner = await getPartnerByTaxCode(debouncedTaxCode);
      if (!partner) {
        // Không tìm thấy → xóa hidden fields
        form.setFieldsValue({
          supplierId: undefined,
          supplier: undefined,
          quoterId: undefined,
          quoter: undefined,
        });
        return;
      }
      form.setFieldsValue({
        supplierId: partner.id,
        supplier: partner,
        quoterId: undefined,
        quoter: undefined,
        supplierSnapshot: partner,
      } as any);
    })();
  }, [debouncedTaxCode]);

  // Debounce: khi nhập SĐT người báo giá → tìm contact trong supplier
  useEffect(() => {
    if (!debouncedQuoterPhone || debouncedQuoterPhone.length < 8) return;

    if (!supplier) {
      form.setFieldsValue({ quoterId: undefined, quoter: undefined });
      return;
    }

    const contacts = supplier.contacts || [];
    const existingContact = contacts.find((c) => c.phone === debouncedQuoterPhone);

    if (existingContact) {
      form.setFieldsValue({
        quoterId: existingContact.id,
        quoter: existingContact,
        quoterSnapshot: existingContact,
      } as any);
    } else {
      form.setFieldsValue({
        quoterId: undefined,
        quoter: undefined,
      });
    }
  }, [debouncedQuoterPhone, supplier]);

  const handleSetCode = async () => {
    try {
      if (!code) return;
      const codeData = await getRCByCode(code);
      if (!codeData) {
        message.error("Mã giới thiệu không hợp lệ hoặc đã hết hạn");
        return;
      }

      // Nếu mã giới thiệu có thông tin đơn vị, yêu cầu xác thực MST
      const p = codeData.partner || codeData.partnerSnapshot;
      if (p?.taxCode) {
        setPendingCodeData(codeData);
        setVerifyTaxCodeInput("");
        setVerifyError("");
        setVerifyModalOpen(true);
        return;
      }

      applyCodeData(codeData);
    } catch (error) {
      console.error("Mã không hợp lệ", error);
      message.error("Mã không hợp lệ hoặc đã bị hỏng");
    }
  };

  const applyCodeData = (codeData: any) => {
    form.setFieldValue("referralCodeId", codeData.id);
    form.setFieldValue("referralCode", codeData);
    form.setFieldValue("lines", codeData.linesSnapshot || []);
    if (codeData.partner || codeData.partnerSnapshot) {
      const p = codeData.partner || codeData.partnerSnapshot;
      form.setFieldValue("supplierId", p?.id);
      form.setFieldValue("supplierSnapshot", p);
      form.setFieldValue("staffId", codeData?.staffId);
    }
  };

  const handleVerifyTaxCode = () => {
    const p = pendingCodeData?.partner || pendingCodeData?.partnerSnapshot;
    if (verifyTaxCodeInput !== p?.taxCode) {
      setVerifyError("Mã số thuế không chính xác");
      return;
    }
    setVerifyModalOpen(false);
    setPendingCodeData(null);
    applyCodeData(pendingCodeData);
  };

  const handleRemoveCode = () => {
    form.setFieldValue("code", undefined);
    form.setFieldValue("referralCodeId", undefined);
    form.setFieldValue("referralCode", undefined);
    form.setFieldValue("lines", []);
  };

  const onFinish = async (values: PurchaseQuotation) => {
    setLoading(true);
    try {
      const { code, ...submitValues } = values;
      submitValues.companyId = company?.id;
      submitValues.tempId = id;
      const newPurchaseQuotation = await createPublic(submitValues);

      if (newPurchaseQuotation) {
        setCreatedCode(newPurchaseQuotation.code || "");
        setSuccessModalOpen(true);
      }
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Gửi thất bại");
    } finally {
      setLoading(false);
    }
  };

  const columns: FormColumn<PurchaseQuotationLine>[] = useMemo(
    () => [
      {
        title: "Tên hàng hóa",
        dataIndex: "productName",
        width: 140,
        fixed: "left",
        render: (ctx) => (
          <span className="cursor-not-allowed text-wrap">{ctx.record?.productName}</span>
        ),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        width: 100,
        align: "center",
        render: (ctx) => {
          let quantityText = formatQuantity(ctx.record?.quantity);
          if (ctx.record?.unitName) {
            quantityText += ` ${ctx.record.unitName}`;
          }
          return <span className="cursor-not-allowed">{quantityText}</span>;
        },
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        width: 100,
        align: "right",
        editable: true,
        rules: [{ required: true, message: "Nhập đơn giá" }],
        render: () => <InputMoney variant="borderless" />,
      },
      {
        title: "Thành tiền",
        dataIndex: "subTotal",
        width: 120,
        align: "right",
        render: (ctx) => {
          const subTotal = calculateAmountUtil.calculateGrossAmount(ctx?.record);
          return <span className="cursor-not-allowed">{formatQuantity(subTotal)}</span>;
        },
      },
      {
        title: "%VAT",
        dataIndex: "taxRate",
        width: 62,
        align: "right",
        editable: true,
        fillable: true,
        render: () => <InputPercentage variant="borderless" />,
      },
      {
        title: "Tiền VAT",
        dataIndex: "taxAmount",
        width: 80,
        align: "right",
        render: (ctx) => {
          const taxAmount = calculateAmountUtil.calculateTaxAmount(ctx?.record);
          return <span className="cursor-not-allowed">{formatQuantity(taxAmount)}</span>;
        },
      },
      {
        title: "Tổng tiền",
        dataIndex: "grossAmount",
        width: 150,
        align: "right",
        render: (ctx) => {
          const grossAmount = calculateAmountUtil.calculateGrossAmount(ctx?.record);
          return <span className="cursor-not-allowed">{formatQuantity(grossAmount)}</span>;
        },
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        editable: true,
        render: () => <Input className={`${CLASSNAME.inputHeight} w-full`} variant="borderless" />,
      },
    ],
    [],
  );

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

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-gray-100 relative">
      <div className="flex justify-center left-0 w-full h-12 xl:h-16 flex-shrink-0 bg-primary shadow-sm">
        <div className="flex justify-between items-center w-full max-w-7xl h-full px-4">
          <div className="flex items-center gap-6">
            <CompanyImage image={getMainFile(company?.logo)} />
            <span className="text-white text-base md:text-xl lg:text-2xl font-bold text-left uppercase">
              {company?.name}
            </span>
          </div>
          <span className="text-white text-base md:text-xl lg:text-2xl font-bold text-left uppercase">
            Báo giá từ nhà cung cấp
          </span>
        </div>
      </div>
      <div className="w-full h-[calc(100%-48px)] xl:h-[calc(100%-64px)] overflow-x-hidden overflow-y-auto scrollbar-hide px-10 py-6">
        <div className="flex flex-col min-h-full h-fit w-full max-w-screen-2xl bg-white shadow-lg rounded-lg mx-auto">
          <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ lines: [] }}>
            <Form.Item name="supplierId" hidden />
            <Form.Item name="supplier" hidden />
            <div className="flex flex-col lg:flex-row overflow-y-auto gap-x-4 p-6 pb-4">
              <div className="w-full lg:w-2/5 flex flex-col">
                <FormSection title="Thông tin đơn vị báo giá">
                  <Row gutter={[32, 0]}>
                    <Col span={12}>
                      <Form.Item
                        name={["supplierSnapshot", "name"]}
                        label={<Label title="Tên đơn vị" required />}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên đơn vị",
                          },
                        ]}
                      >
                        <Input placeholder="Tên đơn vị báo giá" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["supplierSnapshot", "taxCode"]}
                        label={<Label title="Mã số thuế" required />}
                        rules={getTaxCodeRules(true)}
                      >
                        <Input placeholder="Mã số thuế" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["supplierSnapshot", "phone"]}
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
                      <Form.Item name={["supplierSnapshot", "address", "state"]}>
                        <ProvinceSelect
                          options={provinceOptions}
                          onChange={(value) => {
                            form.setFieldValue(["supplierSnapshot", "address", "state"] as any, value);
                            form.setFieldValue(["supplierSnapshot", "address", "ward"] as any, undefined);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name={["supplierSnapshot", "address", "ward"]}>
                        <WardSelect options={wardOptions} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name={["supplierSnapshot", "address", "detail"]}>
                        <Input placeholder="Địa chỉ chi tiết" />
                      </Form.Item>
                    </Col>
                  </Row>
                </FormSection>

                <Form.Item name="quoterId" hidden />
                <Form.Item name="quoter" hidden />
                <FormSection title="Thông tin người báo giá">
                  <Row gutter={[32, 0]}>
                    <Col span={12}>
                      <Form.Item
                        name={["quoterSnapshot", "name"]}
                        label={<Label title="Tên người báo giá" required />}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên người báo giá",
                          },
                        ]}
                      >
                        <Input placeholder="Tên người báo giá" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["quoterSnapshot", "phone"]}
                        label={<Label title="Số điện thoại" required />}
                        rules={getPhoneRules(true)}
                      >
                        <Input placeholder="Số điện thoại người báo giá" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["quoterSnapshot", "email"]}
                        label={<Label title="Email" />}
                        rules={[
                          {
                            type: "email",
                            message: "Vui lòng nhập email hợp lệ",
                          },
                        ]}
                      >
                        <Input placeholder="Email người báo giá" />
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
                  <div className="flex flex-col">
                    <div className="flex w-full gap-8">
                      <FileUploadBox
                        category={FileCategory.DOCUMENT}
                        entity={EntityFile.PURCHASE_QUOTATION}
                        oId={id}
                        maxCount={1}
                        placeholder={
                          <div className="flex flex-col">
                            <span className="text-xs">Tài liệu báo giá (PDF, Excel, Word)</span>
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

                    <div className="flex mt-5">
                      <Label title="Mã giới thiệu" />
                      <Form.Item
                        name="code"
                        className="flex-1"
                        rules={[
                          {
                            pattern: /^[A-Za-z0-9]{4}( [A-Za-z0-9]{4}){3}$/,
                            message: "Mã giới thiệu không hợp lệ",
                          },
                        ]}
                      >
                        <Input
                          placeholder="xxxx xxxx xxxx xxxx"
                          className="w-full rounded-e-none"
                        />
                      </Form.Item>
                      <Form.Item name="referralCodeId" hidden />
                      <Form.Item name="referralCode" hidden />
                      <Form.Item name="staffId" hidden />
                      <Button
                        type="primary"
                        className="rounded-s-none"
                        disabled={!code}
                        onClick={handleSetCode}
                      >
                        Áp dụng
                      </Button>
                    </div>

                    {/* Hiển thị thông tin referralCode */}
                    {referralCode && (
                      <ReferralCodeCardPublic item={referralCode} onDelete={handleRemoveCode} />
                    )}

                    <div className="flex flex-col mt-5">
                      <FormListTable
                        form={form}
                        fieldName="lines"
                        columns={columns}
                        records={lines}
                        title="Hàng hóa"
                        fillableColumns={["taxRate"]}
                        emptyText={
                          <div className="flex flex-col">
                            <span>
                              Sử dụng mã giới thiệu để có được danh sách hàng hóa cần báo giá
                            </span>
                            <span>Hoặc có thể chào giá hàng hóa bất kỳ qua tài liệu báo </span>
                          </div>
                        }
                        renderSummary={() => {
                          const total = calculateAmountUtil.calculateTotalForArray([...lines]);
                          return (
                            <>
                              <td className="border-r text-end font-semibold px-3">Tổng</td>
                              <td className="border-r text-center px-3">
                                {formatQuantity(total.quantity)}
                              </td>
                              <td />
                              <td className="border-r text-end px-3">
                                {formatMoney(total.subTotal)}
                              </td>
                              <td />
                              <td className="border-r text-end px-3">
                                {formatQuantity(total.taxAmount)}
                              </td>
                              <td className="border-r text-end px-3">
                                {formatMoney(total.grossAmount)}
                              </td>
                              <td />
                            </>
                          );
                        }}
                        onKeyDown={makeFormListEnterHandler(
                          {
                            type: "select",
                            message: "Vui lòng chọn hàng hóa ở ô tìm kiếm để thêm vào phiếu nhập",
                          },
                          { messageApi: message },
                        )}
                      />
                    </div>
                  </div>
                </FormSection>
              </div>
            </div>
          </Form>
          <div className="flex justify-center gap-4 pb-4 mt-auto mb-0">
            <Button
              type="primary"
              htmlType="button"
              loading={loading}
              onClick={() => form.submit()}
              className="h-11 w-36 uppercase font-semibold"
            >
              Gửi báo giá
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
        title="Xác thực mã số thuế"
        open={verifyModalOpen}
        onOk={handleVerifyTaxCode}
        onCancel={() => {
          setVerifyModalOpen(false);
          setPendingCodeData(null);
        }}
        okText="Xác thực"
        cancelText="Hủy"
      >
        <p className="text-sm text-gray-500 mb-3">
          Vui lòng nhập chính xác mã số thuế của Đơn vị báo giá để sử dụng mã giới thiệu
        </p>

        {pendingCodeData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-600 font-medium mb-1">MST GỢI Ý</p>
            <span className="font-mono text-lg font-bold text-blue-700 tracking-wider">
              {maskText(
                (pendingCodeData.partner || pendingCodeData.partnerSnapshot)?.taxCode || "",
                3,
              )}
            </span>
          </div>
        )}

        <Input
          placeholder="Nhập mã số thuế"
          value={verifyTaxCodeInput}
          onChange={(e) => {
            setVerifyTaxCodeInput(e.target.value);
            setVerifyError("");
          }}
          onPressEnter={handleVerifyTaxCode}
          autoFocus
        />
        {verifyError && <p className="text-red-500 text-sm mt-2">{verifyError}</p>}
      </Modal>

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
                const url = publicRoutesName.supplierQuotation
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

          <h3 className="text-xl font-semibold text-gray-800 mb-2">Gửi báo giá thành công!</h3>

          <p className="text-gray-500 mb-5">Cảm ơn bạn đã gửi yêu cầu đến chúng tôi.</p>

          <div className="w-full max-w-md rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 mb-5">
            <p className="text-sm text-gray-500 mb-1">Số báo giá</p>
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

export default SupplierQuotationPage;
