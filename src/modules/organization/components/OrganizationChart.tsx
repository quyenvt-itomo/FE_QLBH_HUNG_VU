import React, { useEffect, useRef, useState, useCallback } from "react";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";
import {
  BookmarkIcon,
  CameraIcon,
  ChevronDownIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { OrganizationTypeEnum, organizationTypeMap } from "../organization.enum";
import { Organization } from "../organization.model";
import { ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { buildTree, OrganizationTree } from "../organization.util";
import { OrganizationActionButtons } from "./OrganizationActionButtons";
import { COLORS } from "@/shared/constants/ui";
import { Icon } from "@iconify/react";
import { getMainFile } from "@/shared/utils/file.util";
import StoreImage from "@/shared/components/image/StoreImage";

type MyNodeComponentProps = {
  node: OrganizationTree;
  toggleNode: (node: OrganizationTree) => void;
  handleAdd?: (node: OrganizationTree) => void;
  handleEdit?: (node: OrganizationTree) => void;
  handleSetting?: (node: OrganizationTree) => void;
  handleDelete?: (id: string) => void;
};

const MyNodeComponent: React.FC<MyNodeComponentProps> = ({
  node,
  toggleNode,
  handleAdd,
  handleEdit,
  handleSetting,
  handleDelete,
}) => {
  const hasChildren = (node.children?.length ?? 0) > 0 || (node.hiddenChildren?.length ?? 0) > 0;
  const typeLabel = organizationTypeMap[node.type] || "N/A";

  const canDelete = node?.type !== "headquarter";

  return (
    <div
      className={`
        initechNode group relative px-5 py-2.5 border rounded-md mr-2.5
        inline-block h-44 ${node?.type !== OrganizationTypeEnum.HEADQUARTER ? "bg-slate-50" : "bg-blue-50"}
      `}
    >
      <OrganizationActionButtons
        onAdd={handleAdd ? () => handleAdd(node) : undefined}
        onSetting={hasChildren && handleSetting ? () => handleSetting(node) : undefined}
        onEdit={handleEdit ? () => handleEdit(node) : undefined}
        onDelete={canDelete && handleDelete ? () => handleDelete(node?.id) : undefined}
      />
      <div className="mb-4 w-[200px]">
        <div className="flex items-center gap-1 mb-2">
          {getMainFile(node.logo) && (
            <StoreImage size={42} image={getMainFile(node.logo)} shape="square" />
          )}
          <div className="font-semibold h-[42px] flex-1 line-clamp-2">{node?.name}</div>
        </div>
        <div className="flex items-center justify-start gap-1 mb-1 h-4">
          <BookmarkIcon className="h-4 w-4 text-primary shrink-0 block" />
          {typeLabel}
        </div>
        {node?.manager && (
          <div className="flex items-center justify-start gap-1 mt-2 h-4">
            <UserIcon className="h-4 w-4 text-primary shrink-0 block" /> {node?.manager?.name}{" "}
            {node?.manager?.phone && `(${node.manager.phone})`}
          </div>
        )}
        {node?.phone && (
          <div className="flex items-center justify-start gap-1 mt-2 h-4">
            <PhoneIcon className="h-4 w-4 text-primary shrink-0 block" /> {node?.phone}
          </div>
        )}
        {node?.operations && node.operations.length > 0 && (
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              lineHeight: "16px",
            }}
          >
            <Icon icon="ion:hammer-outline" className="h-4 w-4 text-primary shrink-0 block" />{" "}
            {node.operations.length} công đoạn
          </div>
        )}
      </div>
      {hasChildren && (
        <button
          className={`
            absolute -bottom-[15px] left-[114px] bg-white ease-in-out transition-all border
            flex justify-center w-6 h-6 my-1 items-center rounded-full ${
              node.children ? "text-primary" : "-rotate-180"
            }`}
          style={{
            borderColor: node.children ? COLORS.PRIMARY : "#ccc",
          }}
          onClick={(e) => {
            e.stopPropagation();
            toggleNode(node);
          }}
          title={node.children ? "Thu gọn" : "Mở rộng"}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

interface Props extends ObjectTableProps {
  dataSource: Organization[];
  onAdd?: (data: Organization) => void;
  onSetting?: (data: Organization) => void;
}

export const OrganizationChart: React.FC<Props> = ({
  dataSource,
  onAdd,
  onEdit,
  onDelete,
  onSetting,
}) => {
  const [tree, setTree] = useState<OrganizationTree[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  useEffect(() => {
    if (!dataSource?.length) {
      setTree([]);
      return;
    }
    const treeData = buildTree(dataSource);
    setTree(treeData);
  }, [dataSource]);

  // Space key tracking
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setSpaceHeld(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setSpaceHeld(false);
        setIsPanning(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!spaceHeld) return;
      e.preventDefault();
      setIsPanning(true);
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: chartRef.current?.scrollLeft ?? 0,
        scrollTop: chartRef.current?.scrollTop ?? 0,
      };
    },
    [spaceHeld],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      e.preventDefault();
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      if (chartRef.current) {
        chartRef.current.scrollLeft = panStart.current.scrollLeft - dx;
        chartRef.current.scrollTop = panStart.current.scrollTop - dy;
      }
    },
    [isPanning],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const toggleNode = (nodeToToggle: OrganizationTree) => {
    const toggleChildrenVisibility = (node: OrganizationTree): OrganizationTree => {
      if (node === nodeToToggle) {
        return {
          ...node,
          children: node.children ? null : (node.hiddenChildren ?? null),
          hiddenChildren: node.children ? node.children : (node.hiddenChildren ?? null),
        };
      }
      return {
        ...node,
        children: node.children?.map(toggleChildrenVisibility) || null,
      };
    };

    setTree((prevTree) => prevTree.map(toggleChildrenVisibility));
  };

  const exportToPDF = () => {
    const chartElement = document.getElementById("orgchart");

    if (!chartElement) {
      console.error("Không tìm thấy phần tử OrgChart.");
      return;
    }

    html2canvas(chartElement, {
      scale: 2, // tăng độ nét
      useCORS: true, // nếu có hình ảnh từ server khác
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("orgchart.pdf");
    });
  };

  return (
    <div className="flex flex-col relative h-full w-full">
      <div className="absolute top-1 left-1">
        <button onClick={exportToPDF} title="Xuất PDF">
          <CameraIcon className="h-5 w-5" />
        </button>
      </div>
      <div
        id="orgchart"
        ref={chartRef}
        className={`overflow-auto p-16  h-full w-full scrollbar-hide ${spaceHeld ? `select-none ${isPanning ? "cursor-grabbing" : "cursor-grab"}` : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {(Array.isArray(tree) ? tree : []).map((node) => (
          <OrgChart
            key={node.id}
            tree={node}
            NodeComponent={(props: any) => (
              <MyNodeComponent
                {...props}
                key={props.node.id}
                toggleNode={toggleNode}
                handleAdd={onAdd}
                handleSetting={onSetting}
                handleEdit={onEdit}
                handleDelete={onDelete}
              />
            )}
          />
        ))}
      </div>
    </div>
  );
};
