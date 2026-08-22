import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import AddSelect from "./AddSelect";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { IPartner } from "../../models/partner";
import { useCustomerData } from "../../hooks/partner/useCustomerData";
import AddModal from "../../pages/Private/partner/customer/components/AddModal";
import { usePartnerData } from "../../hooks/partner/usePartnerData";
import { PartnerTypeEnum } from "../../constants/enum";

const CustomerSelect: React.FC<SelectProps<IPartner>> = ({
  value,
  defaultData,
  offsetAt,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [listCustomer, setListCustomer] = useState<IPartner[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));
  const [modalPhone, setModalPhone] = useState<string>("");

  const { newCustomer, addCustomer } = useCustomerData({
    keyword,
    page,
    size: 10,
    isLockHook,
    onCloseModal: () => {
      setOpen(false);
      setIsLockHook(false);
      setPage(1);
      setKeywordTemp("");
    },
  });

  const { partners, loading, pagination, errors } = usePartnerData({
    type: PartnerTypeEnum.CUSTOMER,
    keyword,
    page,
    size: 10,
    isLockHook,
    offsetAt,
  });

  useEffect(() => {
    setPage(1);
  }, [offsetAt]);

  useEffect(() => {
    if (pagination?.currentPage === 1) {
      setListCustomer(partners);
      return;
    }

    setListCustomer((prevList) => {
      const newValues = new Set(partners.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...partners];
    });
  }, [partners, pagination]);
  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listCustomer.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListCustomer([defaultData, ...listCustomer]);
  }, [defaultData, listCustomer]);

  useEffect(() => {
    if (!newCustomer || !open) return;
    onChange?.(newCustomer?.id);
    onChangeData?.(newCustomer);
  }, [newCustomer]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listCustomer.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listCustomer.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<IPartner>[] = [
    { label: "Tên khách hàng", dataIndex: "name", className: "w-52" },
    { label: "Mã KH", dataIndex: "code", className: "w-24" },
    { label: "SĐT", dataIndex: "phone", className: "w-24" },
    {
      label: "Nợ phải thu",
      dataIndex: "receivableDebtAmount",
      className: "w-24",
      dataType: "number",
    },
    {
      label: "Điểm tích lũy",
      dataIndex: "loyaltyPoints",
      className: "w-24",
      dataType: "number",
    },
  ];

  return (
    <AddSelect<IPartner>
      placeholder="Chọn khách hàng"
      showAddButton={!!addCustomer}
      loading={loading}
      options={listCustomer}
      columns={columns}
      value={value}
      onChange={handleChange}
      onPopupScroll={handleScroll}
      onSearch={setKeywordTemp}
      onFocus={(e) => {
        setIsLockHook(false);
        onFocus?.(e);
      }}
      modal={
        <AddModal
          defaultPhone={modalPhone}
          open={open}
          errors={errors}
          onClose={() => setOpen(false)}
          onAdd={addCustomer}
        />
      }
      onOpen={() => {
        setModalPhone(keyword);
        setOpen(true);
      }}
      {...rest}
    />
  );
};

export default CustomerSelect;
