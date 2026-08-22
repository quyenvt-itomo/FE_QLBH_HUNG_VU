import React, { useEffect, useState } from "react";
import { SelectProps as AntdSelectProps } from "antd";
import { IAttribute } from "../../models/base/attribute";
import { useAttributeData } from "../../hooks/core/useAttributeData";
import InputSelect from "./InputSelect";
import { AttributeTypeEnum } from "../../constants/enum";

interface AttributeSelectProps extends AntdSelectProps {
  type: AttributeTypeEnum;
}

const AttributeSelect: React.FC<AttributeSelectProps> = ({
  type,
  onFocus,
  ...rest
}) => {
  const [isLockHook, setIsLockHook] = useState<boolean>(true);
  const [listAttribute, setListAttribute] = useState<IAttribute[]>([]);

  const { attributes, loading } = useAttributeData({
    isLockHook: isLockHook,
    onCloseModal: () => {},
    type,
  });

  useEffect(() => {
    if (attributes.length === 0 || attributes[0].type !== type) return;

    setListAttribute(attributes);
  }, [attributes, type]);

  const options = listAttribute.map((attr) => ({
    label: attr.name,
    value: attr.name,
  }));

  return (
    <InputSelect
      options={options}
      loading={loading}
      onFocus={(e) => {
        setIsLockHook(false);
        onFocus?.(e);
      }}
      {...rest}
    />
  );
};

export default AttributeSelect;
