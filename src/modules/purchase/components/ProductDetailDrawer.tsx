import React from "react";
import { Drawer, Tag } from "antd";
import { Product } from "@/modules/product";
import { InfoTab } from "@/modules/product/components/ProductDetailModal/InfoTab";

interface Props {
  open: boolean;
  product?: Product;
  onClose: () => void;
}

export const ProductDetailDrawer: React.FC<Props> = ({ open, product, onClose }) => {
  if (!product) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={680}
      destroyOnClose
      title={
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-semibold">{product.name}</span>
          <Tag color="blue" className="shrink-0 font-mono">
            {product.code}
          </Tag>
        </div>
      }
    >
      <InfoTab data={product} />
    </Drawer>
  );
};
