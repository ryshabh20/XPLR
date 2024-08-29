import Link from "next/link";
import { Img } from "../img";

export const SidebarIcons = () => {
  return (
    <div className="flex w-full justify-between max-md:border-t-[1px] max-md:border-t-neutral-700 max-md:px-16 max-md:py-4  md:flex-col gap-8">
      <div className="flex items-center justify-center md:hidden">
        <Img
          src="/white_xplore_icon.svg"
          width={25}
          height={25}
          alt="xplore-icon"
        />
      </div>

      <Link href={"/"}>
        <div className="flex items-center justify-center">
          <Img
            src="/sidebar_home_icon.svg"
            width={22}
            height={22}
            alt="home-icon"
          />
        </div>
      </Link>

      <div className="flex items-center justify-center">
        <Img
          src="/sidebar_search_icon.svg"
          width={22}
          height={22}
          alt="search-icon"
        />
      </div>
      <Link href={"/chat"}>
        <div className="flex items-center justify-center">
          <Img
            src="/sidebar_chat_icon.svg"
            width={22}
            height={22}
            alt="chat-icon"
          />
        </div>
      </Link>
    </div>
  );
};
