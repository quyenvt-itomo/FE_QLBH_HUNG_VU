import { useEffect, useState } from "react";
import { SelectProps } from "../../models/base/select";
import useDebounce from "../../hooks/core/useDebounce";
import AddSelect from "./AddSelect";
import { DropdownColumn } from "../core/CustomSelectLayout";
import { IPartner } from "../../models/partner";
import { useSupplierData } from "../../hooks/partner/useSupplierData";
import AddModal from "../../pages/Private/partner/supplier/components/AddModal";
import { usePartnerData } from "../../hooks/partner/usePartnerData";
import { PartnerTypeEnum } from "../../constants/enum";

const SupplierSelect: React.FC<SelectProps<IPartner>> = ({
  value,
  defaultData,
  offsetAt,
  onChange,
  onChangeData,
  onFocus,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [listSupplier, setListSupplier] = useState<IPartner[]>([]);
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [keywordTemp, setKeywordTemp] = useState<string>("");
  const keyword = useDebounce(keywordTemp, 300, () => setPage(1));

  const { newSupplier, addSupplier } = useSupplierData({
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
    type: PartnerTypeEnum.SUPPLIER,
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
      setListSupplier(partners);
      return;
    }

    setListSupplier((prevList) => {
      const newValues = new Set(partners.map((item) => item.id));
      const filteredPrevList = prevList.filter((item) => !newValues.has(item.id));
      return [...filteredPrevList, ...partners];
    });
  }, [partners, pagination]);
  useEffect(() => {
    if (!defaultData?.id) return;

    const exists = listSupplier.some((item) => item.id === defaultData.id);
    if (exists) return;

    setListSupplier([defaultData, ...listSupplier]);
  }, [defaultData, listSupplier]);

  useEffect(() => {
    if (!newSupplier || !open) return;
    onChange?.(newSupplier?.id);
    onChangeData?.(newSupplier);
  }, [newSupplier]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
      if (!pagination || listSupplier.length >= pagination.totalRecords) return;
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (id: string) => {
    onChange?.(id);
    const data = listSupplier.find((item) => item.id === id);
    onChangeData?.(data);
  };

  const columns: DropdownColumn<IPartner>[] = [
    { label: "Tên NCC", dataIndex: "name", className: "w-52" },
    { label: "Mã NCC", dataIndex: "code", className: "w-24" },
    { label: "SĐT", dataIndex: "phone", className: "w-24" },
    {
      label: "Nợ phải trả hiện tại",
      dataIndex: "payableDebtAmount",
      className: "w-24",
      dataType: "number",
    },
  ];

  return (
    <AddSelect<IPartner>
      placeholder="Chọn nhà cung cấp"
      showAddButton={!!addSupplier}
      loading={loading}
      options={listSupplier}
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
        <AddModal open={open} errors={errors} onClose={() => setOpen(false)} onAdd={addSupplier} />
      }
      onOpen={() => setOpen(true)}
      {...rest}
    />
  );
};

export default SupplierSelect;
