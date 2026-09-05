import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Drawer, Spin, Tag } from "antd";
import React, { useState } from "react";

import { useProductStore } from "../product.store";
import { Product } from "../product.model";
import { InfoTab } from "./ProductDetailModal/InfoTab";

interface Props {
  productId: string;
}

/**
 * Nút xem nhanh hàng hóa dùng ở các màn hình nghiệp vụ.
 * Chỉ tải chi tiết khi người dùng thực sự mở drawer; dữ liệu được giữ lại
 * trong component để những lần mở sau không gọi lại API.
 */
export const ProductDetailButton: React.FC<Props> = ({ productId }) => {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<Product>();
  const { getById, fetching } = useProductStore({ isLocked: true });

  const handleOpen = () => {
    setOpen(true);
    if (product || !getById) return;

    getById(productId, {
      onSuccess: (data) => {
        if (data) setProduct(data);
      },
    });
  };

  return (
    <>
      <Button
        type="text"
        size="small"
        className="!h-5 !w-5 !p-0 !text-slate-500 hover:!text-primary"
        icon={<InfoCircleOutlined />}
        title="Xem chi tiết hàng hóa"
        aria-label="Xem chi tiết hàng hóa"
        onClick={(event) => {
          event.stopPropagation();
          handleOpen();
        }}
      />

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={680}
        destroyOnClose
        title={
          product ? (
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate font-semibold">{product.name}</span>
              <Tag color="blue" className="shrink-0 font-mono">
                {product.code}
              </Tag>
            </div>
          ) : (
            "Chi tiết hàng hóa"
          )
        }
      >
        {product ? (
          <InfoTab data={product} />
        ) : fetching ? (
          <div className="flex min-h-40 items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">Không tìm thấy hàng hóa</div>
        )}
      </Drawer>
    </>
  );
};
