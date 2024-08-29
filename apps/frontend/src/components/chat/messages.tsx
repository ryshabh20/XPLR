import useApi from "../../../custom-hooks/useApi";
import Text from "../common/text";

export default function Messages() {
  // const getConversations = useApi({
  //   method: "GET",
  //   queryKey: ["getConversations"],
  //   url: "/conversations",
  // });
  return (
    <div className="w-full flex flex-col flex-1">
      <div className="w-full justify-between  hidden mobile:flex">
        <Text size="basesemibold" className="text-white">
          Messages
        </Text>
        <Text size="basesemibold" className="text-neutral-500">
          Requests
        </Text>
      </div>
      <div className="  flex justify-center items-center h-full">
        <Text size="base" className="text-white hidden mobile:block">
          No Messages found.
        </Text>
      </div>
    </div>
  );
}
