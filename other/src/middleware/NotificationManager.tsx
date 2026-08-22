/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../stores";
import useSmartNotification from "../hooks/core/useSmartNotification";
import { TypeMessage } from "../constants/enum";

// Store imports
import * as AuthStore from "../stores/auth/slice";
import * as AttributeStore from "../stores/attribute/slice";
import * as ExcelStore from "../stores/excel/slice";

import * as StoreStore from "../stores/store/slice";
import * as EmployeeStore from "../stores/employee/slice";
import * as UserStore from "../stores/user/slice";
import * as RoleStore from "../stores/role/slice";
import * as SystemRoleStore from "../stores/systemRole/slice";
import * as SettingStore from "../stores/setting/slice";

import * as SupplierStore from "../stores/supplier/slice";
import * as SupplierContactStore from "../stores/supplier/supplierContact/slice";
import * as SupplierSubTypeStore from "../stores/supplier/supplierSubType/slice";

import * as CustomerStore from "../stores/customer/slice";
import * as SubTypeStore from "../stores/customer/customerSubType/slice";
import * as CustomerContactStore from "../stores/customer/customerContact/slice";

import * as FundCategoryStore from "../stores/fundCategory/slice";

import * as ProductStore from "../stores/product/slice";
import * as ProductOptionStore from "../stores/product/productOption/slice";
import * as ProductVariantStore from "../stores/product/productVariant/slice";

import * as PurchaseStore from "../stores/purchase/slice";
import * as PurchaseLineStore from "../stores/purchase/line/slice";
import * as SaleStore from "../stores/sale/slice";
import * as SaleLineStore from "../stores/sale/line/slice";
import * as PurchaseReturnStore from "../stores/purchaseReturn/slice";
import * as PurchaseReturnLineStore from "../stores/purchaseReturn/line/slice";
import * as SaleReturnStore from "../stores/saleReturn/slice";
import * as SaleReturnLineStore from "../stores/saleReturn/line/slice";

import * as InventoryAdjustmentStore from "../stores/inventoryAdjustment/slice";
import * as InventoryAdjustmentLineStore from "../stores/inventoryAdjustment/inventoryAdjustmentLine/slice";

import * as StoreTransferStore from "../stores/storeTransfer/slice";
import * as StoreTransferLineStore from "../stores/storeTransfer/storeTransferLine/slice";

import * as FundStore from "../stores/fund/slice";
import * as IncomeExpenseStore from "../stores/incomeExpense/slice";
import * as FundAdjustmentStore from "../stores/fundAdjustment/slice";
import * as FundTransferStore from "../stores/fundTransfer/slice";

import * as DebtAdjustmentStore from "../stores/debtAdjustment/slice";
import * as DebtOffsetStore from "../stores/debtOffset/slice";

import * as VatAdjustment from "../stores/vatAdjustment/slice";

import * as Shift from "../stores/shift/slice";

type NotificationManagerProps = {
  children: React.ReactNode;
};

const NotificationManager: React.FC<NotificationManagerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notify } = useSmartNotification();

  const messages = useMemo(
    () => [
      {
        selector: (state: RootState) => state.Auth.message,
        clear: AuthStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.Attribute.message,
        clear: AttributeStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.Excel.message,
        clear: ExcelStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.Employee.message,
        clear: EmployeeStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.User.message,
        clear: UserStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.Role.message,
        clear: RoleStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.SystemRole.message,
        clear: SystemRoleStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.Store.message,
        clear: StoreStore.clearMessage,
      },

      // TODO: Customer
      {
        selector: (state: RootState) => state.Customer.message,
        clear: CustomerStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.SubType.message,
        clear: SubTypeStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.CustomerContact.message,
        clear: CustomerContactStore.clearMessage,
      },

      {
        selector: (state: RootState) => state.FundCategory.message,
        clear: FundCategoryStore.clearMessage,
      },

      // TODO: Product
      {
        selector: (state: RootState) => state.Product.message,
        clear: ProductStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.ProductOption.message,
        clear: ProductOptionStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.ProductVariant.message,
        clear: ProductVariantStore.clearMessage,
      },

      // TODO: Purchase
      {
        selector: (state: RootState) => state.Purchase.message,
        clear: PurchaseStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.PurchaseLine.message,
        clear: PurchaseLineStore.clearMessage,
      },

      // TODO: Sale
      {
        selector: (state: RootState) => state.Sale.message,
        clear: SaleStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.SaleLine.message,
        clear: SaleLineStore.clearMessage,
      },

      // TODO: PurchaseReturn
      {
        selector: (state: RootState) => state.PurchaseReturn.message,
        clear: PurchaseReturnStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.PurchaseReturnLine.message,
        clear: PurchaseReturnLineStore.clearMessage,
      },

      // TODO: SaleReturn
      {
        selector: (state: RootState) => state.SaleReturn.message,
        clear: SaleReturnStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.SaleReturnLine.message,
        clear: SaleReturnLineStore.clearMessage,
      },

      // TODO: Supplier
      {
        selector: (state: RootState) => state.Supplier.message,
        clear: SupplierStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.SupplierContact.message,
        clear: SupplierContactStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.SupplierSubType.message,
        clear: SupplierSubTypeStore.clearMessage,
      },

      // TODO: Inventory Adjustment
      {
        selector: (state: RootState) => state.InventoryAdjustment.message,
        clear: InventoryAdjustmentStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.InventoryAdjustmentLine.message,
        clear: InventoryAdjustmentLineStore.clearMessage,
      },

      // TODO: Store Transfer
      {
        selector: (state: RootState) => state.StoreTransfer.message,
        clear: StoreTransferStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.StoreTransferLine.message,
        clear: StoreTransferLineStore.clearMessage,
      },

      // TODO: Fund
      {
        selector: (state: RootState) => state.Fund.message,
        clear: FundStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.IncomeExpense.message,
        clear: IncomeExpenseStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.FundAdjustment.message,
        clear: FundAdjustmentStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.FundTransfer.message,
        clear: FundTransferStore.clearMessage,
      },

      // TODO: Debt
      {
        selector: (state: RootState) => state.DebtAdjustment.message,
        clear: DebtAdjustmentStore.clearMessage,
      },
      {
        selector: (state: RootState) => state.DebtOffset.message,
        clear: DebtOffsetStore.clearMessage,
      },

      // TODO: Vat
      {
        selector: (state: RootState) => state.VatAdjustment.message,
        clear: VatAdjustment.clearMessage,
      },

      // TODO: Shift
      {
        selector: (state: RootState) => state.Shift.message,
        clear: Shift.clearMessage,
      },
    ],
    [],
  );

  const errorHandlers = useMemo(
    () => [
      {
        selector: (state: RootState) => state.Auth.errors,
        reset: AuthStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.Setting.errors,
        reset: SettingStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.Store.errors,
        reset: StoreStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.Attribute.errors,
        reset: AttributeStore.resetErrors,
      },

      {
        selector: (state: RootState) => state.Employee.errors,
        reset: EmployeeStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.User.errors,
        reset: UserStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.Role.errors,
        reset: RoleStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.SystemRole.errors,
        reset: SystemRoleStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.Store.errors,
        reset: StoreStore.resetErrors,
      },

      // TODO: Customer
      {
        selector: (state: RootState) => state.Customer.errors,
        reset: CustomerStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.SubType.errors,
        reset: SubTypeStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.CustomerContact.errors,
        reset: CustomerContactStore.resetErrors,
      },

      {
        selector: (state: RootState) => state.FundCategory.errors,
        reset: FundCategoryStore.resetErrors,
      },

      // TODO: Product
      {
        selector: (state: RootState) => state.Product.errors,
        reset: ProductStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.ProductOption.errors,
        reset: ProductOptionStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.ProductVariant.errors,
        reset: ProductVariantStore.resetErrors,
      },

      //TODO: Purchase
      {
        selector: (state: RootState) => state.Purchase.errors,
        reset: PurchaseStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.PurchaseLine.errors,
        reset: PurchaseLineStore.resetErrors,
      },

      // TODO: Sale
      {
        selector: (state: RootState) => state.Sale.errors,
        reset: SaleStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.SaleLine.errors,
        reset: SaleLineStore.resetErrors,
      },

      // TODO: PurchaseReturn
      {
        selector: (state: RootState) => state.PurchaseReturn.errors,
        reset: PurchaseReturnStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.PurchaseReturnLine.errors,
        reset: PurchaseReturnLineStore.resetErrors,
      },

      // TODO: Supplier
      {
        selector: (state: RootState) => state.Supplier.errors,
        reset: SupplierStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.SupplierContact.errors,
        reset: SupplierContactStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.SupplierSubType.errors,
        reset: SupplierSubTypeStore.resetErrors,
      },

      // TODO: Inventory Adjustment
      {
        selector: (state: RootState) => state.InventoryAdjustment.errors,
        reset: InventoryAdjustmentStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.InventoryAdjustmentLine.errors,
        reset: InventoryAdjustmentLineStore.resetErrors,
      },

      // TODO: Store Transfer
      {
        selector: (state: RootState) => state.StoreTransfer.errors,
        reset: StoreTransferStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.StoreTransferLine.errors,
        reset: StoreTransferLineStore.resetErrors,
      },

      // TODO: Fund
      {
        selector: (state: RootState) => state.Fund.errors,
        reset: FundStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.FundAdjustment.errors,
        reset: FundAdjustmentStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.FundTransfer.errors,
        reset: FundTransferStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.IncomeExpense.errors,
        reset: IncomeExpenseStore.resetErrors,
      },

      // TODO: Debt
      {
        selector: (state: RootState) => state.DebtAdjustment.errors,
        reset: DebtAdjustmentStore.resetErrors,
      },
      {
        selector: (state: RootState) => state.DebtOffset.errors,
        reset: DebtOffsetStore.resetErrors,
      },

      // TODO: Vat
      {
        selector: (state: RootState) => state.VatAdjustment.errors,
        reset: VatAdjustment.resetErrors,
      },

      // TODO: Shift
      {
        selector: (state: RootState) => state.Shift.errors,
        reset: Shift.resetErrors,
      },
    ],
    [],
  );

  // Message handler component
  const MessageHandler: React.FC<{
    selector: (state: RootState) => any;
    clear: () => { type: string };
  }> = ({ selector, clear }) => {
    const messageState = useSelector(selector);

    useEffect(() => {
      if (messageState && messageState.type !== TypeMessage.none) {
        if (messageState.type === TypeMessage.error) {
          notify("error", messageState.message);
        } else if (messageState.type === TypeMessage.success) {
          notify("success", messageState.message);
        }

        dispatch(clear());
      }
    }, [messageState, dispatch, clear]);

    return null;
  };

  // Error handler component
  const ErrorHandler: React.FC<{
    selector: (state: RootState) => any;
    reset: () => { type: string };
  }> = ({ selector, reset }) => {
    const errors = useSelector(selector);

    useEffect(() => {
      if (errors) {
        dispatch(reset());
      }
    }, [errors, dispatch, reset]);

    return null;
  };

  return (
    <>
      {messages.map(({ selector, clear }, index) => (
        <MessageHandler key={`msg-${index}`} selector={selector} clear={clear} />
      ))}
      {errorHandlers.map(({ selector, reset }, index) => (
        <ErrorHandler key={`err-${index}`} selector={selector} reset={reset} />
      ))}
      {children}
    </>
  );
};

export default React.memo(NotificationManager);
