import React from "react";

const NoData: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-1 leading-none select-none">
      {/* <img src={FileText} alt="No Data" /> */}
      <span
        style={{
          fontSize: ".9375rem",
          fontWeight: 600,
          color: "#999",
          margin: "16px 0 4px",
        }}
      >
        Không có dữ liệu
      </span>
    </div>
  );
};

export default NoData;
