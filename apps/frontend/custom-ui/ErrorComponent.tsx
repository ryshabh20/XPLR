import Text, { sizes } from "@/components/common/text";

const ErrorComponent = ({
  message,
  className,
  size = "sm",
  color = "text-red-400",
}: {
  message: string;
  className?: string;
  size?: keyof typeof sizes;
  color?: string;
}) => {
  return (
    <Text
      size={size}
      color={color}
      className={`${message ? `block ${className}` : "hidden"}`}
    >
      {message}
    </Text>
  );
};

export default ErrorComponent;
