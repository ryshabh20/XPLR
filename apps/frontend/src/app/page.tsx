"use client";
import useApi from "../../custom-hooks/useApi";
import IconSpinner from "../../custom-ui/IconSpinner";

export default function Home() {
  const getError = useApi({
    method: "GET",
    queryKey: ["getError"],
    url: "user/debug",
  })?.get;
  console.log(getError);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div>
        <IconSpinner height={100} width={100} />
      </div>
    </div>
  );
}
