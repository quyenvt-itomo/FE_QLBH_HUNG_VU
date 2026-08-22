import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { IconSetting } from "../icon/Setting";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

interface CustomizeColumnDisplayProps {
  title: string;
  content: React.ReactNode;
}

const CustomizeColumnDisplay: React.FC<CustomizeColumnDisplayProps> = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-[46px] flex justify-center absolute right-2.5 top-0 z-10">
      <Button type="primary" className="px-2" onClick={() => setOpen(true)}>
        <Cog6ToothIcon className="h-6 w-6" />
      </Button>
      <Drawer
        title={title}
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={440}
      >
        {content}
      </Drawer>
    </div>
  );
};

export default CustomizeColumnDisplay;
