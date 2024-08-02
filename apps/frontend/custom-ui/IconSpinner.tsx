import { Img } from "@/components/common/img";
const IconSpinner = ({ height, width }: { height: number; width: number }) => {
  return (
    <Img
      src="/image.png"
      height={height}
      width={width}
      alt="asdfasdf"
      className="animate-spin-slow "
    />
  );
};

export default IconSpinner;
