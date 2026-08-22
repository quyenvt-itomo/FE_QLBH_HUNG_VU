import { Button, Divider, Drawer } from "antd";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { OrganizationTree } from "../organization.util";
import { SortPayload } from "../organization.model";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface UpdateSortDrawerProps {
  parent?: OrganizationTree;
  open: boolean;
  onClose: () => void;
  onSubmit?: (sortedChildren: SortPayload[]) => void;
}

export const UpdateSortDrawer: React.FC<UpdateSortDrawerProps> = ({
  parent,
  open,
  onClose,
  onSubmit,
}) => {
  const [childrenData, setChildrenData] = useState<OrganizationTree[]>([]);

  useEffect(() => {
    if (!open || !parent) {
      handleClose();
      return;
    }
    const children = parent.children || parent.hiddenChildren || [];
    setChildrenData(
      children.map((child) => ({
        ...child,
        key: child.id?.toString(),
      })),
    );
  }, [open, parent]);

  const handleClose = () => {
    setChildrenData([]);
    onClose();
  };

  const handleSort = (newList: any) => {
    setChildrenData(newList);
  };

  const handleSubmit = () => {
    const updateData: SortPayload[] = childrenData.map((child, index) => ({
      id: child.id,
      sortOrder: 10 * (index + 1),
    }));
    onSubmit?.(updateData);
  };

  return (
    <div className="flex w-full justify-end">
      <Drawer
        title={"Tùy chỉnh cơ cấu tổ Chức"}
        placement="right"
        onClose={handleClose}
        open={open}
        width={450}
      >
        <div className="flex flex-col h-full w-full">
          <div className="flex w-full items-center justify-between">
            <span className="font-medium">{parent?.name}</span>
            <div className="flex gap-2 flex-end">
              <Button onClick={handleClose} title="Đặt lại về mặc định">
                Hủy
              </Button>
              <Button onClick={handleSubmit} type="primary" title="Lưu">
                Lưu
              </Button>
            </div>
          </div>
          <Divider className="my-2" />
          <ReactSortable
            list={childrenData}
            setList={handleSort}
            animation={200}
            ghostClass="gu-transit"
            group="icon"
          >
            {childrenData.map((item) => (
              <div
                className="flex grow w-full items-center"
                key={item.id}
                style={{
                  cursor: "grab",
                  padding: "12px 12px",
                  marginTop: "8px",
                  borderRadius: "4px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <span className="font-normal grow pl-2">{item.name}</span>
                <div className="cursor-move drag-handle text-center">
                  <Bars3Icon className="h-5" />
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
      </Drawer>
    </div>
  );
};
