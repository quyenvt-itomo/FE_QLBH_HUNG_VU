import { Input, Popover, Radio } from "antd";
import { IPartner } from "../../../../../../models/partner";
import EditInfoRow from "./EditInfoRow";
import {
  AttributeTypeEnum,
  FileCategoryEnum,
  FileEntityEnum,
  PartnerTypeEnum,
} from "../../../../../../constants/enum";
import { useEffect, useState } from "react";
import { IPartnerSubType } from "../../../../../../models/partnerSubType";
import { PencilIcon } from "@heroicons/react/24/outline";
import AttributeSelect from "../../../../../../components/manager_select/AttributeSelect";
import Title from "../../../../../../components/display/Title";
import { useCustomerSubTypeData } from "../../../../../../hooks/partner/useCustomerSubTypeData";
import AvatarUpload from "../../../../../../components/upload/AvatarUpload";
import { getMainImage } from "../../../../../../utils/fileUtil";
import EditSubTypeRow from "../../../../../../components/select/EditSubTypeRow";
import EditableHeaderText from "../../../../../../components/display/EditableHeaderText";

interface CardInfoProps {
  customer?: IPartner;
  onUpdate?: (data: Partial<IPartner>) => void | Promise<void>;
  onReload?: () => void;
}

export const CardInfo: React.FC<CardInfoProps> = ({ customer, onUpdate, onReload }) => {
  const [subTypes, setSubTypes] = useState<IPartnerSubType[]>([]);

  const { canUpdate, addSubType, updateSubType, deleteSubType } = useCustomerSubTypeData({
    partnerId: customer?.id,
    onCloseModal: () => {
      onReload?.();
    },
  });

  // Sync subTypes from customer data
  useEffect(() => {
    if (!customer?.subTypes) return;
    setSubTypes(customer.subTypes);
  }, [customer?.subTypes]);

  if (!customer) return <></>;

  const handleAddSubType = async (type: PartnerTypeEnum, groupId: string) => {
    addSubType?.({
      type,
      groupId,
    });
  };

  const handleUpdateSubType = async (type: PartnerTypeEnum, groupId: string) => {
    const existing = customer.subTypes.find((i) => i.type === type);
    if (!existing?.id) return;

    updateSubType?.({
      id: existing.id,
      groupId,
    });
  };

  const handleDeleteSubType = async (type: PartnerTypeEnum) => {
    const existing = customer.subTypes.find((i) => i.type === type);
    if (!existing?.id) return;

    deleteSubType?.(existing.id);
  };

  return (
    <div className="overflow-y-auto h-full px-2 pb-2 -mx-2 scrollbar-hide w-[380px]">
      <div className="shadow-md rounded-2xl overflow-hidden slide-right border border-gray-100 mb-4">
        <div className="w-full bg-gradient-to-br from-primary via-primary to-primary/80">
          <Radio.Group
            value={customer.isOrganization}
            optionType="button"
            buttonStyle="solid"
            size="small"
            className="
            p-4
            [&_.ant-radio-button-wrapper]:bg-white/20
            [&_.ant-radio-button-wrapper]:text-white
            [&_.ant-radio-button-wrapper]:border-white/40
            [&_.ant-radio-button-wrapper-checked]:!bg-white
            [&_.ant-radio-button-wrapper-checked]:!text-primary
            [&_.ant-radio-button-wrapper-checked]:ring-2
            [&_.ant-radio-button-wrapper-checked]:ring-white/70
            "
            onChange={(e) => {
              onUpdate?.({ isOrganization: e.target.value });
            }}
          >
            <Radio.Button value={true}>Tổ chức</Radio.Button>
            <Radio.Button value={false}>Cá nhân</Radio.Button>
          </Radio.Group>
          <div className="flex flex-col items-center p-8 pt-4">
            <div className="relative">
              <AvatarUpload
                shape="circle"
                size={64}
                entity={FileEntityEnum.CUSTOMER}
                category={FileCategoryEnum.AVATAR}
                oId={customer.id}
                defaultFile={getMainImage(customer.avatar)}
                isActive
                limit={50}
              />
            </div>
            <EditableHeaderText<IPartner>
              value={customer.name}
              fieldKey="name"
              onUpdate={onUpdate}
              placeholder="Nhập tên nhà cung cấp"
              className="mt-4 mb-1"
              inputClassName="h-8 text-center font-bold text-xl"
              displayComponent={
                <h2 className="flex items-center justify-center h-8 text-xl font-bold text-white">
                  {customer.name}
                </h2>
              }
            />
            <EditableHeaderText<IPartner>
              value={customer.code}
              fieldKey="code"
              onUpdate={onUpdate}
              placeholder="Nhập mã nhà cung cấp"
              className="mb-4"
              inputClassName="h-[22px] w-36 text-center"
              displayComponent={<p className="text-white/90 text-center">{customer.code}</p>}
            />
            <div className="relative inline-flex items-center group">
              <Popover
                trigger="click"
                placement="bottom"
                content={
                  <div className="w-80 p-1">
                    <Title content="Chọn nhóm khách hàng" />
                    <AttributeSelect
                      type={AttributeTypeEnum.CUSTOMER_GROUP}
                      placeholder=""
                      value={customer.groupId || undefined}
                      defaultData={customer.group}
                      className="mt-2"
                      onChange={(value) => {
                        onUpdate?.({
                          groupId: value,
                          id: customer.id,
                        });
                      }}
                    />
                  </div>
                }
              >
                {/* WRAPPER là anchor */}
                <div className="inline-flex items-center relative cursor-pointer">
                  {/* Badge */}
                  <span
                    className="
                    inline-flex items-center
                    px-4 py-1
                    rounded-full
                    text-sm font-medium
                    bg-white/20
                    text-white
                    border border-white/40
                    backdrop-blur-sm
                    "
                  >
                    {customer.group?.name || ""}
                  </span>

                  {/* Icon */}
                  <button
                    type="button"
                    title="Chỉnh sửa"
                    className="
                    absolute left-full ml-1
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    p-1 rounded
                    hover:bg-white/20
                    "
                  >
                    <PencilIcon className="h-4 w-4 text-white/70 hover:text-white" />
                  </button>
                </div>
              </Popover>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white">
          <div className="space-y-1">
            <div className="flex items-center gap-3 border-b border-gray-100">
              <EditInfoRow<IPartner>
                label="Email"
                value={customer.email}
                fieldKey="email"
                required
                onUpdate={onUpdate}
                editComponent={<Input className="h-8" placeholder="Nhập email" />}
                width={100}
              />
            </div>
            <div className="flex items-center gap-3 border-b border-gray-100">
              <EditInfoRow<IPartner>
                label="Số điện thoại"
                value={customer.phone}
                fieldKey="phone"
                required
                onUpdate={onUpdate}
                editComponent={<Input className="h-8" placeholder="Nhập số điện thoại" />}
                width={100}
              />
            </div>
            <div className="flex items-center gap-3 border-b border-gray-100">
              <EditInfoRow<IPartner>
                label="Mã số thuế"
                value={customer.taxCode}
                fieldKey="taxCode"
                onUpdate={onUpdate}
                editComponent={<Input className="h-8" placeholder="Nhập mã số thuế" />}
                width={100}
              />
            </div>
            <div className="flex items-center gap-3 border-b border-gray-100">
              <EditInfoRow<IPartner>
                label="Ghi chú"
                value={customer.note}
                fieldKey="note"
                onUpdate={onUpdate}
                editComponent={<Input className="h-8" placeholder="Nhập ghi chú" />}
                width={100}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-md rounded-2xl overflow-hidden slide-right border border-gray-100">
        <div className="p-4 bg-white">
          <div className="space-y-1">
            <div className="flex items-center gap-3 border-b border-gray-100">
              <EditSubTypeRow
                value={subTypes?.find((i) => i.type === PartnerTypeEnum.SUPPLIER)}
                attributeType={AttributeTypeEnum.SUPPLIER_GROUP}
                disabled={!canUpdate}
                onAdd={(groupId) => handleAddSubType(PartnerTypeEnum.SUPPLIER, groupId)}
                onUpdate={(groupId) => handleUpdateSubType(PartnerTypeEnum.SUPPLIER, groupId)}
                onDelete={() => handleDeleteSubType(PartnerTypeEnum.SUPPLIER)}
              />
            </div>
            <div className="flex items-center gap-3 border-b border-gray-100">
              <EditSubTypeRow
                label="Là đơn vị vận chuyển"
                value={subTypes?.find((i) => i.type === PartnerTypeEnum.SHIPPER)}
                attributeType={AttributeTypeEnum.SHIPPER_GROUP}
                disabled={!canUpdate}
                onAdd={(groupId) => handleAddSubType(PartnerTypeEnum.SHIPPER, groupId)}
                onUpdate={(groupId) => handleUpdateSubType(PartnerTypeEnum.SHIPPER, groupId)}
                onDelete={() => handleDeleteSubType(PartnerTypeEnum.SHIPPER)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
