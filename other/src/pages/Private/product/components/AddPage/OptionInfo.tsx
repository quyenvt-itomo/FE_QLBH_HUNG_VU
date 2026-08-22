import { Form, Button, Input, Tag, FormInstance } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { PartialProps } from "../../AddPage";
import UnitSelect from "../../../../../components/manager_select/AttributeSelect";
import { AttributeTypeEnum } from "../../../../../constants/enum";
import Title from "../../../../../components/display/Title";
import { TrashIcon } from "@heroicons/react/24/outline";
import { collectTypeInPoductTypes, getDefaultVariant, randomId } from "../../../../../utils/common";

import dayjs from "dayjs";
import { IProduct, IProductOption, IProductVariant } from "../../../../../models/product";
import { IAttribute } from "../../../../../models/base/attribute";

interface SortableItemProps {
  id: string;
  field: any;
  index: number;
  values: string[];
  hideOptions?: IAttribute[];
  inputValues: { [key: number]: string };
  form: FormInstance<IProduct>;
  setInputValues: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  handleAddValue: (fieldName: number, value: string) => void;
  handleRemoveValue: (fieldName: number, indexToRemove: number) => void;
  onRemove?: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  field,
  index,
  values,
  inputValues,
  hideOptions,
  form,
  setInputValues,
  handleAddValue,
  handleRemoveValue,
  onRemove,
}) => {
  const { key, ...restField } = field;

  return (
    <tr>
      <td>
        <div className="p-1 pl-0">
          <Form.Item
            {...restField}
            name={[field.name, "typeId"]}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn phân loại",
              },
            ]}
            noStyle
          >
            <UnitSelect
              type={AttributeTypeEnum.PRODUCT_TYPE}
              hideOptions={hideOptions}
              className="!w-full"
              placeholder="Chọn phân loại"
              onChangeData={(data) =>
                form.setFieldValue(["productTypes", field.name, "type"], data)
              }
            />
          </Form.Item>
        </div>
      </td>

      <td>
        <div className="flex-1 flex flex-col p-1">
          <Form.Item
            {...restField}
            name={[field.name, "values"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ít nhất một giá trị",
              },
            ]}
            className="mb-0 hidden"
          >
            <Input />
          </Form.Item>
          <Form.Item {...restField} name={[field.name, "index"]} className="mb-0 hidden">
            <Input />
          </Form.Item>

          <div className="border border-gray-300 rounded-lg px-2 py-1 min-h-[36px] flex flex-wrap items-center hover:border-primary focus-within:border-primary focus-within:shadow-sm transition-all">
            {values.map((value: string, idx: number) => (
              <Tag
                key={idx}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleRemoveValue(field.name, idx);
                }}
                className="mb-0"
              >
                {value}
              </Tag>
            ))}
            <Input
              placeholder={values.length === 0 ? "Nhập giá trị và nhấn Enter" : ""}
              value={inputValues[field.name] || ""}
              onChange={(e) =>
                setInputValues((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddValue(field.name, inputValues[field.name] || "");
                }
              }}
              className="flex-1 border-none shadow-none outline-none focus:shadow-none min-w-[100px] px-0 h-6"
              variant="borderless"
            />
          </div>
        </div>
      </td>
      <td>
        {onRemove && (
          <Button
            type="text"
            htmlType="button"
            className="h-8 w-10 p-0 text-gray-400 hover:!text-red-500 transition-colors ease-in-out"
            onClick={onRemove}
          >
            <TrashIcon className="h-5" />
          </Button>
        )}
      </td>
    </tr>
  );
};

export const OptionInfo: React.FC<PartialProps> = ({ form, id }) => {
  const productTypes = Form.useWatch("productTypes", form) || [];
  const options = Form.useWatch("options", form) || [];
  const variants = Form.useWatch("variants", form) || [];
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});

  // Hàm tạo tổ hợp từ mảng các mảng
  const generateCombinations = (arrays?: any[][]): any[][] => {
    if (!arrays || arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0]?.map((item) => [item]);

    const [first, ...rest] = arrays;
    const restCombinations = generateCombinations(rest);

    const result: any[][] = [];
    first.forEach((item) => {
      restCombinations?.forEach((combination) => {
        result.push([item, ...combination]);
      });
    });

    return result;
  };

  // Tự động tạo options từ productTypes
  useEffect(() => {
    if (productTypes.length === 0) {
      form.setFieldValue("options", []);
      return;
    }

    const newOptions: Partial<IProductOption>[] = [];

    productTypes.forEach((pType, index) => {
      if (pType.typeId && pType.values?.length) {
        pType.values.forEach((value: string) => {
          const existingOption = options.find(
            (opt) => opt.typeId === pType.typeId && opt.value === value,
          );

          if (existingOption) {
            newOptions.push({
              ...existingOption,
              typeIndex: index,
            });
          } else {
            const id = randomId();
            newOptions.push({
              id,
              tempId: id,
              typeId: pType.typeId,
              type: pType.type,
              value: value,
              typeIndex: index,
            });
          }
        });
      }
    });

    form.setFieldValue("options", newOptions);
  }, [productTypes, form, id]);

  // Tự động tạo variants từ options
  useEffect(() => {
    if (!options || options.length === 0) {
      if (variants.length > 0) {
        const tempId = variants[0].tempId;
        form.setFieldValue("variants", [{ tempId }]);
      } else {
        const defaultData = getDefaultVariant();
        form.setFieldsValue(defaultData);
      }
      return;
    }

    const newVariants: Partial<IProductVariant>[] = [];

    const grouped: Record<number, IProductOption[]> = {};

    options.forEach((opt) => {
      if (!grouped[opt.typeIndex]) {
        grouped[opt.typeIndex] = [];
      }
      grouped[opt.typeIndex].push(opt);
    });

    const optionGroups = Object.keys(grouped)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => grouped[Number(k)]);

    const optionCombinations = generateCombinations(optionGroups);

    const findExistingVariant = (options: string[]) => {
      const key = options.slice().sort().join("-");
      return variants.find((v) => {
        return (v.options || []).slice().sort().join("-") === key;
      });
    };

    optionCombinations?.forEach((combo) => {
      const options = combo.map((o) => o.id);

      const existing = findExistingVariant(options);

      if (existing) {
        newVariants.push({
          ...existing,
          options,
        });
      } else {
        const tempId = randomId();
        newVariants.push({
          id: tempId,
          tempId,
          productId: id,
          options: combo,
        });
      }
    });

    form.setFieldValue("variants", newVariants);
  }, [options]);

  const handleAddValue = (fieldName: number, value: string) => {
    if (!value.trim()) return;

    const currentValues = form.getFieldValue(["productTypes", fieldName, "values"]) || [];
    const trimmedValue = value.trim();

    // Kiểm tra value đã tồn tại chưa
    if (currentValues.includes(trimmedValue)) {
      setInputValues((prev) => ({ ...prev, [fieldName]: "" }));
      return;
    }

    form.setFieldValue(["productTypes", fieldName, "values"], [...currentValues, trimmedValue]);
    setInputValues((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleRemoveValue = (fieldName: number, indexToRemove: number) => {
    const currentValues = form.getFieldValue(["productTypes", fieldName, "values"]) || [];
    form.setFieldValue(
      ["productTypes", fieldName, "values"],
      currentValues.filter((_: string, index: number) => index !== indexToRemove),
    );
  };

  return (
    <div className="flex flex-col mt-2">
      <Title content="Quy cách & phân loại" className="mt-4 my-2" />
      <Form.Item name="options" hidden />

      <Form.List name="productTypes">
        {(fields, { add, remove }) => (
          <table>
            <colgroup>
              <col style={{ width: "40%" }} />
              <col />
              <col style={{ width: "40px" }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-100 h-8 font-medium">
                <th>
                  <span className="px-3 flex items-center font-medium">Tên quy cách</span>
                </th>
                <th>
                  <span className="px-3 flex items-center font-medium">Giá trị</span>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                const itemData = productTypes[index];
                const values = itemData?.values || [];
                const itemId = itemData?.id || `temp-${field.key}`;

                return (
                  <SortableItem
                    key={itemId}
                    id={itemId}
                    field={field}
                    index={index}
                    values={values}
                    inputValues={inputValues}
                    form={form}
                    hideOptions={collectTypeInPoductTypes(productTypes)}
                    setInputValues={setInputValues}
                    handleAddValue={handleAddValue}
                    handleRemoveValue={handleRemoveValue}
                    onRemove={productTypes?.length > 1 ? () => remove(field.name) : undefined}
                  />
                );
              })}
              <tr>
                <td colSpan={3}>
                  <Button
                    type="link"
                    onClick={() => {
                      const currentLength = fields.length;
                      const id = randomId();
                      add({
                        id,
                        tempId: id,
                        index: currentLength,
                        values: [],
                      });
                    }}
                    icon={<PlusOutlined />}
                    className="self-start px-3"
                  >
                    Thêm quy cách
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </Form.List>
    </div>
  );
};
