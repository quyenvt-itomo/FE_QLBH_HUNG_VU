/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Menu, MenuProps } from "antd";
import { privateRoutesName } from "../../../../constants/routerName";
import { useClientData } from "../../../../hooks/core/useClientData";
import { extractPathsFromRouteObject, isActivePath } from "./MenuItem";

type MenuItem = Required<MenuProps>["items"][number];

export type CustomeMenuProps = {
  items: MenuItem[];
};

const CustomMenu: React.FC<CustomeMenuProps> = ({ items }) => {
  const [selectedKeys, setSelectedKeys] = useState("/");
  const { horizontal, handleSetCustomTitle } = useClientData();

  useEffect(() => {
    const currentPath = window.location.pathname;
    handleSetCustomTitle(null);
    const { purchase, sale, purchaseReturn, saleReturn, product, inventory, customer, supplier } =
      privateRoutesName;

    // TODO: Purchase Order
    if (isActivePath(extractPathsFromRouteObject(purchase))) {
      setSelectedKeys(purchase.page);
      return;
    }

    // TODO: Sell Order
    if (isActivePath(extractPathsFromRouteObject(sale))) {
      setSelectedKeys(sale.page);
      return;
    }

    // TODO: Purchase Return
    if (isActivePath(extractPathsFromRouteObject(purchaseReturn))) {
      setSelectedKeys(purchaseReturn.page);
      return;
    }

    // TODO: Sell Return
    if (isActivePath(extractPathsFromRouteObject(saleReturn))) {
      setSelectedKeys(saleReturn.page);
      return;
    }

    // TODO: Product
    if (isActivePath(extractPathsFromRouteObject(product))) {
      setSelectedKeys(product.page);
      return;
    }

    // TODO: Customer
    if (isActivePath(extractPathsFromRouteObject(customer))) {
      setSelectedKeys(customer.page);
      return;
    }

    // TODO: Supplier
    if (isActivePath(extractPathsFromRouteObject(supplier))) {
      setSelectedKeys(supplier.page);
      return;
    }

    // TODO: Inventory
    if (isActivePath(extractPathsFromRouteObject(inventory))) {
      setSelectedKeys(inventory.page);
      return;
    }

    setSelectedKeys(currentPath);
  }, [location.pathname]);

  return (
    <Menu
      theme="light"
      mode={horizontal ? "horizontal" : "inline"}
      className={`${horizontal ? "" : "overflow-auto"} sidebar-menu select-none flex-1 my-2`}
      items={items}
      selectedKeys={[selectedKeys]}
    />
  );
};

export default CustomMenu;
