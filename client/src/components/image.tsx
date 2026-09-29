import { useState } from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
};

export function Image({
  src,
  alt = "",
  fallback,
  priority = false,
  width,
  height,
  fill = false,
  className = "",
  onError,
  ...props
}: ImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
    }

    onError?.(event);
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`
        ${fill ? "absolute inset-0 h-full w-full" : ""}
        ${className}
      `}
      onError={handleError}
      {...props}
    />
  );
}
