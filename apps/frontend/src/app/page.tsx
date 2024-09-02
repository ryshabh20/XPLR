"use client";
import IconSpinner from "../../custom-ui/IconSpinner";

export default function Home() {
  // const getError = useApi({
  //   method: "GET",
  //   queryKey: ["getError"],
  //   url: "user/debug",
  // })?.get;
  return (
    <div className="h-dvh w-dvh flex justify-center items-center">
      <div>
        <IconSpinner height={100} width={100} />
      </div>
    </div>
  );
}
