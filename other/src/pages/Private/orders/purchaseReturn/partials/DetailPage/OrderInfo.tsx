import { Input } from "antd";
import EditableInfoRow from "../../../../../../components/display/EditableInfoRow";
import { formatDateTimeDDMMYYYY } from "../../../../../../utils/dateUtils";
import { IOrder } from "../../../../../../models/store/order";
import { EditDiscountRow } from "../../../../../../components/display/EditDiscountRow";
import { PartialProps } from "../../DetailPage";
import EmployeeSelect from "../../../../../../components/select/EmployeeSelect";
import { CalendarDaysIcon, DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";

const OrderInfo: React.FC<PartialProps> = ({ data, onUpdate }) => {
  if (!data) return <></>;

  return (
    <div className="flex flex-col bg-white border rounded-lg p-4 pb-0">
      <div className="flex justify-between items-center pb-3">
        <span className="flex items-center gap-1 font-semibold bg-primary/10 w-fit px-2 py-px text-primary rounded-md">
          <DocumentCurrencyDollarIcon className="h-4 mr-1" /> {data.code}
        </span>
        <span className="flex items-center gap-1 font-semibold bg-primary/10 w-fit px-2 py-px text-primary rounded-md">
          <CalendarDaysIcon className="w-4 h-4 mr-1 mb-0.5" />{" "}
          {formatDateTimeDDMMYYYY(data.orderAt)}
        </span>
      </div>

      <EditableInfoRow<IOrder> label="Khách hàng" value={data.partner?.name} />

      <EditDiscountRow<IOrder> data={data} onUpdate={onUpdate} />

      <EditableInfoRow<IOrder>
        label="NV thực hiện"
        value={data.employee?.name}
        editValue={data.employeeId}
        fieldKey="employeeId"
        required
        editComponent={<EmployeeSelect defaultData={data.employee} />}
        onUpdate={onUpdate}
      />

      <EditableInfoRow<IOrder>
        label="Ghi chú đơn hàng"
        value={data.note}
        editValue={data.note}
        fieldKey="note"
        editComponent={<Input className="h-8" placeholder="Nhập ghi chú" />}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default OrderInfo;
