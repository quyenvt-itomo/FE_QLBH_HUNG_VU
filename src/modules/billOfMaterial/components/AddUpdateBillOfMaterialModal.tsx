import React, { useEffect } from "react";
import { Button, Form, InputNumber, Modal, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { BillOfMaterial } from "../billOfMaterial.model";
import { randomId } from "@/shared/utils/common.util";
import { setFormErrors } from "@/shared/utils/form.util";
import { SubmitButton } from "@/shared";
import { Title } from "@/shared";
import { ProductSelect, ProductType, productTypeOptions } from "@/modules/product";
import { AttributeManagerSelect, AttributeType } from "@/modules/attribute";
import { InputMoney } from "@/shared";

const materialTypeOptions = productTypeOptions.filter((o) => o.value !== ProductType.FINISHED);

export const AddUpdateBillOfMaterialModal: React.FC<AddUpdateModalProps<BillOfMaterial>> = ({
  open,
  editData,
  loading,
  errors,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [form] = Form.useForm<BillOfMaterial>();
  const id = editData?.id || randomId();
  const operations = Form.useWatch("operations", form) || [];

  useEffect(() => {
    if (errors) setFormErrors(form, errors);
  }, [errors, form]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }
    if (editData) form.setFieldsValue({ ...editData, operations: editData.operations || [] });
    else form.setFieldsValue({ id, operations: [] });
  }, [open, editData, form, id]);

  return (
    <Modal
      title={editData ? "S?a Ð?nh m?c NVL" : "Thêm Ð?nh m?c NVL"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="fullscreen-modal"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(v) => (editData ? onEdit?.({ ...v, id: editData.id }) : onAdd?.(v))}
      >
        <Title content="Hàng hóa" />
        <Form.Item
          name="productId"
          label="Hàng hóa (thành ph?m)"
          rules={[{ required: true, message: "Vui l?ng ch?n hàng hóa" }]}
        >
          <ProductSelect
            query={{ type: ProductType.FINISHED }}
            onChangeData={(data) => {
              if (!data) return;
              form.setFieldValue("product", data);
              form.setFieldValue("unitId", data.baseUnitId);
              form.setFieldValue("unit", data.baseUnit);
            }}
          />
        </Form.Item>
        <Form.Item name="product" hidden />
        <Form.Item name="unitId" hidden />
        <Form.Item name="unit" hidden />

        <Title content="Công ðo?n & Nguyên v?t li?u" />
        <Form.List name="operations">
          {(opFields, { add: addOperation, remove: removeOperation }) => (
            <div className="flex flex-col gap-3">
              {opFields.map(({ key, name, ...restField }) => {
                const op = operations?.[name];
                const opMaterials = op?.materials || [];
                return (
                  <div key={key} className="border rounded p-3 bg-gray-50/70 flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                      <Form.Item
                        {...restField}
                        name={[name, "operationId"]}
                        label="Công ðo?n"
                        className="mb-0 flex-1"
                        rules={[{ required: true, message: "Ch?n công ðo?n" }]}
                      >
                        <AttributeManagerSelect
                          type={AttributeType.OPERATION}
                          defaultData={op?.operation}
                          onChangeData={(v) =>
                            form.setFieldValue(["operations", name, "operation"], v)
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "unitProductionCost"]}
                        label="Giá s?n xu?t"
                        className="mb-0 w-44"
                      >
                        <InputMoney placeholder="0" />
                      </Form.Item>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeOperation(name)}
                      />
                      <Form.Item {...restField} name={[name, "operation"]} hidden />
                    </div>

                    {/* FormList l?ng: materials c?a công ðo?n này */}
                    <Form.List name={[name, "materials"]}>
                      {(matFields, { add: addMaterial, remove: removeMaterial }) => (
                        <div className="ml-4 border-l pl-3 flex flex-col gap-2">
                          <div className="text-xs font-semibold text-gray-500">Nguyên v?t li?u</div>
                          {matFields.map(({ key: matKey, name: matName, ...matRest }) => {
                            const matType =
                              opMaterials?.[matName]?.type ?? ProductType.SUB_MATERIAL;
                            return (
                              <div key={matKey} className="flex items-end gap-2">
                                <Form.Item
                                  {...matRest}
                                  name={[matName, "type"]}
                                  className="mb-0 w-32"
                                >
                                  <Select options={materialTypeOptions} />
                                </Form.Item>
                                {matType === ProductType.MAIN_MATERIAL ? (
                                  <Form.Item
                                    {...matRest}
                                    name={[matName, "materialGroupId"]}
                                    className="mb-0 flex-1"
                                  >
                                    <AttributeManagerSelect
                                      type={AttributeType.MAIN_MATERIAL_GROUP}
                                      defaultData={opMaterials?.[matName]?.materialGroup}
                                      placeholder="Nhóm NVL chính"
                                      onChangeData={(v) =>
                                        form.setFieldValue(
                                          [
                                            "operations",
                                            name,
                                            "materials",
                                            matName,
                                            "materialGroup",
                                          ],
                                          v,
                                        )
                                      }
                                    />
                                  </Form.Item>
                                ) : (
                                  <Form.Item
                                    {...matRest}
                                    name={[matName, "materialId"]}
                                    className="mb-0 flex-1"
                                  >
                                    <ProductSelect
                                      query={{ type: ProductType.SUB_MATERIAL }}
                                      defaultData={opMaterials?.[matName]?.material}
                                      placeholder="Ch?n NVL"
                                      onChangeData={(data) => {
                                        if (!data) return;
                                        form.setFieldValue(
                                          [
                                            "operations",
                                            name,
                                            "materials",
                                            matName,
                                            "material",
                                          ] as any,
                                          data,
                                        );
                                        form.setFieldValue(
                                          [
                                            "operations",
                                            name,
                                            "materials",
                                            matName,
                                            "unitId",
                                          ] as any,
                                          data.baseUnitId,
                                        );
                                        form.setFieldValue(
                                          ["operations", name, "materials", matName, "unit"] as any,
                                          data.baseUnit,
                                        );
                                      }}
                                    />
                                  </Form.Item>
                                )}
                                <Form.Item
                                  {...matRest}
                                  name={[matName, "quantity"]}
                                  className="mb-0 w-24"
                                >
                                  <InputNumber min={0} placeholder="SL" style={{ width: "100%" }} />
                                </Form.Item>
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => removeMaterial(matName)}
                                />
                                <Form.Item {...matRest} name={[matName, "material"]} hidden />
                                <Form.Item {...matRest} name={[matName, "materialGroup"]} hidden />
                                <Form.Item {...matRest} name={[matName, "unitId"]} hidden />
                                <Form.Item {...matRest} name={[matName, "unit"]} hidden />
                              </div>
                            );
                          })}
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() =>
                              addMaterial({ type: ProductType.SUB_MATERIAL, quantity: 1 })
                            }
                            className="self-start"
                          >
                            Thêm NVL
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </div>
                );
              })}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => addOperation({ unitProductionCost: 0, materials: [] })}
                className="self-start"
              >
                Thêm công ðo?n
              </Button>
            </div>
          )}
        </Form.List>

        <div className="flex justify-end mt-4">
          <SubmitButton loading={loading} onCancel={onClose} />
        </div>
      </Form>
    </Modal>
  );
};
