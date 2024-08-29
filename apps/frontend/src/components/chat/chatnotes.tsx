import { useAuth } from "../../../custom-hooks/useAuth";
import { Img } from "../common/img";
import Text from "../common/text";

export default function ChatNotes() {
  const { user } = useAuth();
  return (
    <div className="h-32 mt-12 hidden mobile:block ">
      <Img
        src={user?.avatar ? user?.avatar : "/profile.svg"}
        width={60}
        height={60}
        alt="avatar"
      />
      <Text size="base" className="text-white ">
        Your note
      </Text>
    </div>
  );
}
