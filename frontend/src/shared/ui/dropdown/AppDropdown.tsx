import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ReactElement } from "react";

interface DropdownItem {
  label: string;
  onClick?: () => void;
}

interface AppDropdownProps {
  trigger: ReactElement;
  items: DropdownItem[];
}

export const AppDropdown = ({ trigger, items }: AppDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />

      <DropdownMenuContent align="end">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onClick={item.onClick}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
