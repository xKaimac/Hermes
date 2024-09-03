/// <reference types="vite/client" />
declare module "@tabler/icons-react" {
  import { FC, SVGAttributes } from "react";
  export interface TablerIconProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    stroke?: string | number;
  }
  export type TablerIcon = FC<TablerIconProps>;
  export const IconBrandGoogle: TablerIcon;
  // Add other icons you might use here
}

declare module "react";

declare module "react-dom/client";

declare module "react/jsx-runtime";
