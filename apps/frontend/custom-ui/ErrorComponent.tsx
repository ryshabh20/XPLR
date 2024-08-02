import Text from "@/components/common/text";

const ErrorComponent = ({ message }: { message: string }) => {
  return (
    <Text
      size="sm"
      color="text-red-400"
      className={`${message ? "block" : "hidden"}`}
    >
      {message}
    </Text>
  );
};

export default ErrorComponent;
