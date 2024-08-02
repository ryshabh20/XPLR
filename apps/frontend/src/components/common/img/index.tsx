import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_PATH;

type Props = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};
export const Img: React.FC<React.PropsWithChildren<Props>> = ({
  src,
  width,
  height,
  alt,
  className,
  ...restProps
}) => {
  return (
    <Image
      src={BASE_URL + src}
      width={width}
      height={height}
      alt={alt}
      className={className}
      {...restProps}
    />
  );
};
