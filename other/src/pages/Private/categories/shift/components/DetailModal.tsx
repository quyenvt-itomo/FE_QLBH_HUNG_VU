import React, { useRef } from "react";
import { Modal } from "antd";
import { IShift } from "../../../../../models/store/shift";
import { ShiftCard } from "../../../../../components/card/Shift";
import { Icon } from "@iconify/react";
import SubmitButton from "../../../../../components/button/SubmitButton";
import { ShiftStatusEnum } from "../../../../../constants/enum";
// using ShiftPrint component for printing
import { useReactToPrint } from "react-to-print";
import { ShiftPrint } from "../../../../../components/print";

interface DetailModalProps {
  data?: IShift;
  open: boolean;
  loading: boolean;
  onClose?: () => void;
  onUpdate?: (data: Partial<IShift>) => void;
  onReload?: () => void;
}

export const DetailShiftModal: React.FC<DetailModalProps> = ({ data, open, onClose }) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: printContentRef });

  if (!data) return <></>;

  const handleExportFile = () => {
    reactToPrintFn();
  };

  return (
    <Modal
      title={"Chi tiết thông tin ca làm việc"}
      open={open}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      centered
      width={580}
      destroyOnClose
    >
      <div className="flex flex-col gap-4 h-full w-full mt-8">
        <ShiftCard item={data} />
        {data.status === ShiftStatusEnum.CLOSED && (
          <div className="flex w-full justify-center">
            <SubmitButton
              onCancel={onClose}
              cancelText="Đóng"
              submitText="In"
              submitIcon={
                <Icon icon="material-symbols-light:print-outline-rounded" width="24" height="24" />
              }
              onSubmit={() => handleExportFile()}
            />
          </div>
        )}
      </div>

      <div style={{ display: "none" }}>
        <div ref={printContentRef}>{data && <ShiftPrint data={data} />}</div>
      </div>
    </Modal>
  );
};
