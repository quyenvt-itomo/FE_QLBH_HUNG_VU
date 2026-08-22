import { Pagination, Select } from "antd";
import { IconArrowDown } from "./icon/ArrowDown";
import { PaginationProps } from "../models/base/api";

const { Option } = Select;

export interface CustomPaginationProps {
  pagination: PaginationProps | null | undefined;
  length: number;
  itemName: string;
  showTotal?: boolean;
  setPage?: (value: number) => void;
  setSize?: (value: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  pagination,
  length,
  itemName,
  showTotal,
  setPage,
  setSize,
}) => {
  const { currentPage = 1, size = 20, totalPages = 1, totalRecords = 0 } = pagination || {};

  return (
    <div className="flex justify-between items-center w-full pt-2">
      {/* <div></div> */}

      {/* <div className="flex gap-6 items-center"> */}
      <div className="flex gap-2 items-center text-gray-500">
        {showTotal && <span className="hidden lg:flex">{`Số ${itemName} trên một trang`}</span>}
        <Select
          value={pagination?.size || 20}
          style={{ width: 80 }}
          onChange={(value) => {
            setSize?.(value);
            setPage?.(1);
          }}
          suffixIcon={<IconArrowDown />}
        >
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
        </Select>
      </div>
      {showTotal && (
        <div className="hidden lg:flex text-gray-500">
          {`Đang hiển thị ${length} trên tổng số ${totalRecords || 0} ${itemName}`}
        </div>
      )}
      <div className="w-fit min-w-96 flex justify-end">
        <Pagination
          current={currentPage}
          pageSize={size}
          total={totalRecords}
          showSizeChanger={false}
          onChange={(newPage: number) => setPage?.(newPage)}
        />
      </div>
      {/* </div> */}
    </div>
  );
};

export default CustomPagination;
