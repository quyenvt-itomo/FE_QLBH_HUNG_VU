import { Checkbox } from "antd";
import Title from "../../../../../../components/display/Title";
import EditableInfoCol from "../../../../../../components/display/EditableInfoCol";
import { formatMoney } from "../../../../../../utils/formatNumber";
import { useClientData } from "../../../../../../hooks/core/useClientData";
import { InputMoney } from "../../../../../../components/input";
import { IOrder } from "../../../../../../models/store/order";
import PartnerSelect from "../../../../../../components/select/PartnerSelect";
import { PartnerTypeEnum } from "../../../../../../constants/enum";
import { PartialProps } from "../../DetailPage";

const ShippingInfo: React.FC<PartialProps> = ({ data, onUpdate }) => {
  const { format } = useClientData();
  if (!data) return <></>;

  return (
    <div className="flex flex-col w-full h-fit shrink-0">
      <div className="flex items-end justify-between gap-4">
        <div className="max-w-96 flex-1">
          <EditableInfoCol<IOrder>
            label="Đơn vị vận chuyển"
            value={data.shippingProvider?.name}
            fieldKey="shippingProviderId"
            editComponent={<PartnerSelect type={PartnerTypeEnum.SHIPPER} />}
            onUpdate={onUpdate}
          />
        </div>

        <div className="flex flex-col w-80 relative">
          <div className="absolute right-0 flex items-center h-8">
            <Checkbox
              checked={data.isFreeShipping}
              disabled={!onUpdate}
              onChange={(e) => {
                onUpdate?.({
                  isFreeShipping: e.target.checked,
                });
              }}
            >
              Miễn phí giao hàng
            </Checkbox>
          </div>
          <EditableInfoCol<IOrder>
            label="Phí giao hàng"
            bold
            value={formatMoney(data?.shippingFee, format)}
            fieldKey="shippingFee"
            editComponent={<InputMoney notRightAlign />}
            onUpdate={onUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
