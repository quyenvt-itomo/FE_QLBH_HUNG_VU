import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

interface CustomizeColumnDisplayProps {
  title: string;
  content: React.ReactNode;
}

const CustomizeColumnDisplay: React.FC<CustomizeColumnDisplayProps> = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-w-[46px] w-full justify-end items-center">
      <div className="w-[46px] flex justify-center">
        <Button type="text" className="px-2 text-secondary border-0" onClick={() => setOpen(true)}>
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
    </div>
  );
};

export default CustomizeColumnDisplay;
