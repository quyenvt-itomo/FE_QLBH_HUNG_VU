import { Checkbox, Form } from "antd";
import { PartialProps } from "../../AddPage";
import Label from "../../../../../../components/display/Label";
import { InputMoney } from "../../../../../../components/input";
import PartnerSelect from "../../../../../../components/select/PartnerSelect";
import { PartnerTypeEnum } from "../../../../../../constants/enum";
import { useSaleOrderCache } from "../../../../../../hooks/cache/useSaleOrderCache";

const ShippingInfo: React.FC<PartialProps> = ({ form }) => {
  const { currentOrder, updateCurrentCache } = useSaleOrderCache();
  const shipper = Form.useWatch("shipper", form);
  return (
    <div className="flex flex-col w-full h-fit shrink-0">
      <div className="flex items-end gap-4">
        <div className="flex flex-col flex-1">
          <Label title="Đơn vị giao hàng" />
          <Form.Item name="shipperId" noStyle>
            <PartnerSelect
              className="w-full"
              defaultData={shipper}
              onChangeData={(val) => {
                form.setFieldValue("shipper", val);
              }}
              placeholder="Chọn đơn vị giao hàng"
              type={PartnerTypeEnum.SHIPPER}
            />
          </Form.Item>
          <Form.Item name="shipper" hidden />
        </div>

        <div className="flex flex-col w-80">
          <div className="h-8 flex items-center justify-between">
            <Label title="Phí giao hàng" bold />
            <Form.Item name="isFreeShipping" valuePropName="checked" noStyle>
              <Checkbox>Miễn phí giao hàng</Checkbox>
            </Form.Item>
          </div>
          <Form.Item name="shippingFee" noStyle>
            <InputMoney notRightAlign />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
