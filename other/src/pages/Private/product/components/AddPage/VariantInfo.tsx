import { Checkbox, Form, Input } from "antd";
import { PartialProps } from "../../AddPage";
import Title from "../../../../../components/display/Title";
import { getVariantOptionContent } from "../../../../../utils/common";
import { InputMoney } from "../../../../../components/input";
import AvatarUpload from "../../../../../components/upload/AvatarUpload";
import { FileCategoryEnum, FileEntityEnum } from "../../../../../constants/enum";

export const VariantInfo: React.FC<PartialProps> = ({ form, id }) => {
  const variants = Form.useWatch("variants", form) || [];
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col">
        <div className="bg-white w-full pt-3">
          <Title content="Thông tin hàng hóa" />
        </div>
        <div className="flex h-4 bg-gradient-to-t from-transparent to-white" />
      </div>
      <div className="w-full h-[calc(100%-100px)] overflow-x-auto border rounded">
        <div className="overflow-y-scroll w-fit min-w-full">
          <table className="w-full min-w-[900px]">
            <colgroup>
              <col />
              <col style={{ width: 36 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 80 }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-100 h-6 font-medium border-l">
                <th className="px-3 text-left font-medium">Quy cách</th>
                <th className="text-center font-medium border-l">Ảnh</th>
                <th className="px-3 font-medium border-l">SKU</th>
                <th className="px-3 font-medium border-l">Mã vạch</th>
                <th className="px-3 font-medium border-l">Giá nhập</th>
                <th className="px-3 font-medium border-l">Giá bán</th>
                <th className="font-medium border-l">Đang bán</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex flex-col h-[calc(100%-24px)] overflow-y-scroll w-fit min-w-full">
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <table className="w-full min-w-[900px] table-auto border-collapse">
                <colgroup>
                  <col />
                  <col style={{ width: 36 }} />
                  <col style={{ width: 150 }} />
                  <col style={{ width: 150 }} />
                  <col style={{ width: 150 }} />
                  <col style={{ width: 150 }} />
                  <col style={{ width: 80 }} />
                </colgroup>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.key} className="hover:bg-gray-50 transition-all ease-in-out">
                      <td>
                        <div className="px-3">
                          {!!variants[index]?.options?.length && (
                            <span className="px-3 py-px bg-slate-100 rounded">
                              {getVariantOptionContent(variants?.[index])}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <AvatarUpload
                          category={FileCategoryEnum.IMAGE}
                          entity={FileEntityEnum.PRODUCT_VARIANT}
                          oId={variants?.[index]?.tempId || ""}
                          size={36}
                        />
                      </td>
                      <td>
                        <div className="flex-1 flex flex-col p-px">
                          <Form.Item {...field} name={[field.name, "sku"]} noStyle>
                            <Input className="h-8" />
                          </Form.Item>
                        </div>
                      </td>
                      <td>
                        <div className="flex-1 flex flex-col p-px">
                          <Form.Item {...field} name={[field.name, "barcode"]} noStyle>
                            <Input className="h-8" />
                          </Form.Item>
                        </div>
                      </td>
                      <td>
                        <div className="flex-1 flex flex-col p-px">
                          <Form.Item {...field} name={[field.name, "costPrice"]} noStyle>
                            <InputMoney />
                          </Form.Item>
                        </div>
                      </td>
                      <td>
                        <div className="flex-1 flex flex-col p-px">
                          <Form.Item {...field} name={[field.name, "price"]} noStyle>
                            <InputMoney />
                          </Form.Item>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={variants[index]?.isActive}
                            onChange={(e) =>
                              form.setFieldValue(["variants", index, "isActive"], e.target.checked)
                            }
                            disabled={!variants[index]?.sku}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Form.List>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex w-full h-4 bg-gradient-to-t from-white to-transparent" />
        <div className="flex bg-white">
          <p className="italic text-gray-400">
            SKU là bắt buộc đối với sản phẩm đưa vào kinh doanh
          </p>
        </div>
      </div>
    </div>
  );
};
