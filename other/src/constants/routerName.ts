import store from "../stores";

export const publicRoutesName = {
  login: "/login",
  errorNetwork: "/error-network",
  error404: "/error-404",
  forgotPassword: "/forgot-password",
  confirmOtp: "/confirm-otp",
  confirmPassword: "/confirm-password",
  confirmEmail: "/confirm-email",
  newPassword: "/new-password",
  blank: "/blank-page",

  // invite
  confirmInviteSuccess: "/accept-invitation-success",
  confirmInviteFailed: "/accept-invitation-failed",
  auth: "auth",
  refreshToken: "auth/refresh-token",
};

export const privateRoutesName = {
  // TODO: New
  dashboard: "/",

  // TODO: Purchase
  purchase: {
    page: "/purchases",
    add: "/purchases/add",
    detail: "/purchases/:id",
  },

  // TODO: Sell
  sale: {
    page: "/sales",
    add: "/sales/add",
    detail: "/sales/:id",
  },

  // TODO: Purchase Return
  purchaseReturn: {
    page: "/purchase-returns",
    add: "/purchase-returns/add",
    detail: "/purchase-returns/:id",
  },

  // TODO: Sell Return
  saleReturn: {
    page: "/sale-returns",
    add: "/sale-returns/add",
    detail: "/sale-returns/:id",
  },

  // TODO: fund
  cashBook: {
    page: "/cash-books",
  },
  fundManager: {
    page: "/fund-managers",
  },

  // TODO: Product
  product: {
    page: "/products",
    detail: "/products/:id",
    add: "/products/add",
    update: "/products/:id/update",

    inventory: "/products/:id/inventory",

    report: "/products/:id/report",
  },

  // TODO: Export to project
  exportToProject: {
    page: "/export-to-projects",
    add: "/export-to-projects/add",
    detail: "/export-to-projects/:id",
  },

  // TODO: Customer
  customer: {
    page: "/customers",
    add: "/customers/add",
    detail: "/customers/:id",
  },

  // TODO: Supplier
  supplier: {
    page: "/suppliers",
    add: "/suppliers/add",
    detail: "/suppliers/:id",
  },

  // TODO: Debt Manager
  debtManager: {
    page: "/debt-managers",
  },

  // TODO: VAT Manager
  vatManager: {
    page: "/vat-managers",
  },

  // TODO: import
  import: {
    page: "/import",
  },

  // TODO: export
  export: {
    page: "/export",
  },

  // TODO: Inventory Adjustment
  inventoryAdjustment: {
    page: "/inventory-adjustments",
  },

  // TODO: Store Transfer
  storeTransfer: {
    page: "/store-transfers",
  },

  // TODO: Inventory
  inventory: {
    page: "/inventories",
    detail: "/inventories/:id",
  },

  // TODO: Employee
  employee: {
    page: "/employees",
    detail: "/employees/:id",
  },

  // TODO: Shift
  shift: {
    page: "/shifts",
  },

  // TODO: Category
  categories: {
    store: "/categories/stores",
    user: "/categories/users",
    permission: "/categories/permission",
    systemPermission: "/categories/system-permissions",
    setting: "/categories/settings",
  },

  // TODO: Profile
  profile: "/profile",

  // TODO: Setting
  setting: "/setting",

  // TODO: My Shift
  myShift: "/my-shift",
};
