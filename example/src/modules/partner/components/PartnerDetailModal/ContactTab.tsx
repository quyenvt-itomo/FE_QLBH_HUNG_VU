import React from "react";
import {
  PhoneOutlined,
  MailOutlined,
  CreditCardOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { Partner } from "../../partner.model";

export const ContactTab: React.FC<{ data: Partner }> = ({ data }) => (
  <div className="">
    {!data.contacts?.length ? (
      <p className="text-gray-400 text-sm italic">Chưa có người liên hệ nào</p>
    ) : (
      <div className="flex flex-col gap-4">
        {data.contacts.map((contact, idx) => (
          <div
            key={idx}
            className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <ContactsOutlined className="text-green-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base">{contact.name}</span>
                  {contact.position && (
                    <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {contact.position}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-0.5">
                  {contact.phone && (
                    <span>
                      <PhoneOutlined className="mr-1" />
                      {contact.phone}
                    </span>
                  )}
                  {contact.email && (
                    <span>
                      <MailOutlined className="mr-1" />
                      {contact.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact banks */}
            {contact.banks && contact.banks.length > 0 && (
              <div className="ml-[52px] mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 mb-2">Tài khoản ngân hàng</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contact.banks.map((bank, bi) => (
                    <div
                      key={bi}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <CreditCardOutlined className="text-gray-400 text-sm" />
                      <div className="text-sm">
                        <span className="font-medium">
                          {bank.accountHolder} - {bank.accountNumber}
                        </span>
                        <span className="text-gray-400 mx-1">|</span>
                        <span className="font-medium">
                          {bank.bankName}
                          {bank.branch ? ` - ${bank.branch}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);
