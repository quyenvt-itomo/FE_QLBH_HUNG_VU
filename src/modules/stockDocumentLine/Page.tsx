import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components";
import { Panel } from "@/shared/components";
import { Tabs } from "antd";
import { useStockDocumentLineStore } from "./stockDocumentLine.store";
import {
  StockDocumentLine,
  StockDocumentLineType,
  stockDocumentLineTypeOptions,
} from "./stockDocumentLine.model";
import { StockDocumentLineTable } from "./components";

const StockDocumentLinePage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<StockDocumentLine>();
  const [type, setType] = useState<StockDocumentLineType>(StockDocumentLineType.PURCHASE_RECEIPT);

  const { data, loading, pagination } = useStockDocumentLineStore({ keyword, page, size, type });

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-start gap-3">
        <Tabs
          activeKey={type}
          onChange={(key) => setType(key as StockDocumentLineType)}
          items={stockDocumentLineTypeOptions}
          className="custom-tabs"
        />
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
      </div>
      <Panel>
        <StockDocumentLineTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
        />
      </Panel>
    </div>
  );
};
export default StockDocumentLinePage;
