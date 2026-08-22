import React from "react";
import { CreditCardOutlined } from "@ant-design/icons";
import { Partner } from "../../partner.model";

export const BankTab: React.FC<{ data: Partner }> = ({ data }) => (
  <div className="">
    {!data.banks?.length ? (
      <p className="text-gray-400 text-sm italic">Chưa có tài khoản ngân hàng nào</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.banks.map((bank, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <CreditCardOutlined className="text-blue-500 text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Ngân hàng</span>
                  <span className="text-sm font-medium">{bank.bankName || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Chủ TK</span>
                  <span className="text-sm font-medium">{bank.accountHolder || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Số TK</span>
                  <span className="text-sm font-mono">{bank.accountNumber || "—"}</span>
                </div>
                {bank.branch && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-16">Chi nhánh</span>
                    <span className="text-sm">{bank.branch}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
