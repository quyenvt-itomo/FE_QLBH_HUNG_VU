import React, { useEffect, useMemo } from "react";
import { Modal, Form, Input, FormProps, App, Row, Col } from "antd";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { PurchaseRequisition } from "../purchaseRequisition.model";
import { handleCloseWithPendingFiles, randomId } from "@/shared/utils/common.util";
import { setFormCode, setFormErrors } from "@/shared/utils/form.util";
import SubmitButton from "@/shared/components/button/SubmitButton";
import Title from "@/shared/components/display/Title";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { deletePendingFiles } from "@/shared/utils/file.util";
import { formatFormData, parseFormDataDates } from "@/shared/utils/date.util";
import { EmployeeSelect } from "@/modules/employee";
import Label from "@/shared/components/display/Label";
import { OrderSelect } from "@/modules/order";
import { ProductionSelect } from "@/modules/production";
import { AppDatePicker } from "@/shared/components/input/AppDatePicker";
import dayjs from "dayjs";
import { departmentTypes, OrganizationSelect } from "@/modules/organization";
import { FileUploadBox } from "@/shared/components/upload/FileUploadBox";
import { EntityFile, FileCategory } from "@/shared/constants/enum";
import { PurchaseRequisitionLineFormList } from "./PurchaseRequisitionLineFormList";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

export const PurchaseRequisitionAddUpdateModal: React.FC<
  AddUpdateModalProps<PurchaseRequisition>
> = ({ open, editData, loading, errors, onAdd, onEdit, onClose }) => {
  const { showFormErrorMessages } = useAppMessage();
  const { currentCompany } = useGlobalData();
  const { modal } = App.useApp();
  const [form] = Form.useForm<PurchaseRequisition>();
  const requester = Form.useWatch("requester", form);
  const order = Form.useWatch("order", form);
  const production = Form.useWatch("production", form);
  const department = Form.useWatch("department", form);

  const id = editData?.id || randomId();

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps<PurchaseRequisition>["onFinish"] = async (
    values: PurchaseRequisition,
  ) => {
    const formattedData = formatFormData({ ...values, id, tempId: id });

    modal.confirm({
      title: editData
        ? "Xác nhận sửa phiếu đề nghị mua vật tư?"
        : "Xác nhận thêm phiếu đề nghị mua vật tư?",
      content: editData
        ? "Bạn có chắc chắn muốn sửa phiếu đề nghị mua vật tư này không?"
        : "Bạn có chắc chắn muốn thêm phiếu đề nghị mua vật tư này không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        editData ? onEdit?.(formattedData) : onAdd?.(formattedData);
      },
    });
  };

  return (
    <Modal
      title={editData ? "Sửa phiếu đề nghị mua vật tư" : "Thêm phiếu đề nghị mua vật tư"}
      open={open}
      onCancel={() => handleCloseWithPendingFiles(id, onClose)}
      footer={null}
      maskClosable={false}
      centered
      width="100vw"
      className="fullscreen-modal"
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }

        if (editData) {
          const formattedData = parseFormDataDates(editData);
          form.setFieldsValue(formattedData);
          return;
        }
      }}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={showFormErrorMessages}
        className="flex flex-col gap-3 w-full h-full overflow-hidden"
        initialValues={{ timeAt: dayjs() }}
      >
        <div className="flex w-full">
          <Row gutter={[96, 0]}>
            <Col span={8}>
              <Form.Item
                name="requesterId"
                label={<Label title="Người đề nghị" required />}
                rules={[{ required: true, message: "Vui lòng chọn người đề nghị" }]}
              >
                <EmployeeSelect
                  defaultData={requester}
                  onChangeData={(val) => {
                    form.setFieldValue("requester", val);
                    form.setFieldValue("departmentId", val?.workingOrganizationId);
                    form.setFieldValue("department", val?.workingOrganization);
                  }}
                />
              </Form.Item>
              <Form.Item name="requester" hidden />
            </Col>
            <Col span={8}>
              <Form.Item name="orderId" label={<Label title="Mua theo ĐH" />}>
                <OrderSelect
                  defaultData={order}
                  onChangeData={(val) => {
                    form.setFieldValue("order", val);
                    form.setFieldValue("productionId", undefined);
                    form.setFieldValue("production", undefined);
                  }}
                />
              </Form.Item>
              <Form.Item name="order" hidden />
            </Col>
            <Col span={8}>
              <Form.Item name="code" label={<Label title="Số phiếu" />}>
                <Input disabled placeholder="Tự động tạo sau khi lưu" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={["requester", "code"]} label={<Label title="Mã nhân sự" />}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="productionId" label={<Label title="Mua theo LSX" />}>
                <ProductionSelect
                  defaultData={production}
                  onChangeData={(val) => {
                    form.setFieldValue("production", val);
                    form.setFieldValue("orderId", undefined);
                    form.setFieldValue("order", undefined);
                  }}
                />
              </Form.Item>
              <Form.Item name="production" hidden />
            </Col>
            <Col span={8}>
              <Form.Item
                name="timeAt"
                label={<Label title="Ngày" required />}
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <AppDatePicker />
              </Form.Item>
              <Form.Item name="requester" hidden />
            </Col>
            <Col span={8}>
              <Form.Item name={["requester", "phone"]} label={<Label title="Số điện thoại" />}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="departmentId" label={<Label title="Bộ phận đề nghị" />}>
                <OrganizationSelect
                  placeholder="Chọn bộ phận"
                  defaultData={department}
                  onChangeData={(val) => form.setFieldValue("department", val)}
                  query={{
                    types: departmentTypes,
                    parentId: currentCompany?.id,
                  }}
                />
              </Form.Item>
              <Form.Item name="department" hidden />
            </Col>
            <Col span={8}>
              <Form.Item name="note" label={<Label title="Ghi chú" />}>
                <Input placeholder="Nhập ghi chú" />
              </Form.Item>
              <Form.Item name="requester" hidden />
            </Col>
          </Row>
        </div>

        <div className="flex flex-col h-[calc(100%-236px)]">
          <PurchaseRequisitionLineFormList form={form} />
        </div>

        <div className="flex justify-between items-end">
          <div className="flex w-[520px]">
            <FileUploadBox
              defaultFiles={editData?.document}
              oId={id}
              entity={EntityFile.PURCHASE_REQUISITION}
              category={FileCategory.DOCUMENT}
              maxCount={5}
              onMoveToTrash={(file) => {
                const trashFileIds: string[] = form?.getFieldValue("__trashFileIds") || [];
                if (trashFileIds.includes(file.id)) return;
                form?.setFieldValue("__trashFileIds", [...trashFileIds, file.id]);
              }}
            />
            <Form.Item name="__trashFileIds" hidden />
          </div>
          <SubmitButton
            loading={loading}
            onCancel={() => handleCloseWithPendingFiles(id, onClose)}
          />
        </div>
      </Form>
    </Modal>
  );
};
