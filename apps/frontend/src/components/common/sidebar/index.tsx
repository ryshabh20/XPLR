"use client";

import { Img } from "@/components/common/img";
import clsx from "clsx";
import { SidebarIcons } from "./sidebar.icons";
import { useAuth } from "../../../../custom-hooks/useAuth";

export const MainSideBar = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return (
    <div
      className={clsx("flex h-full bg-white flex-col-reverse md:flex-row", {
        "!bg-black": user,
      })}
    >
      <div
        className={clsx(
          "h-sidebar w-full max-md:flex md:h-full md:w-sidebar bg-black border-r-[1px] border-r-neutral-800 ",
          {
            hidden: !user,
          }
        )}
      >
        <div className=" items-center justify-center py-14 pt-8 hidden md:flex">
          <Img
            src="/white_xplore_icon.svg"
            width={25}
            height={25}
            alt="xplore-icon"
          />
        </div>
        <SidebarIcons />
      </div>
      <div className="h-full w-full ">{children}</div>
    </div>
  );
};
