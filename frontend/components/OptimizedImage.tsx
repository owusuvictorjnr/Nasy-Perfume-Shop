import { CldImage } from "next-cloudinary";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 800,
  className,
  fill,
}: OptimizedImageProps) {
  // Extract public ID from Cloudinary URL if it's a Cloudinary image
  const getPublicId = (url: string) => {
    if (url.includes("cloudinary.com")) {
      const parts = url.split("/");
      const uploadIndex = parts.indexOf("upload");
      if (uploadIndex !== -1) {
        return parts
          .slice(uploadIndex + 2)
          .join("/")
          .split(".")[0];
      }
    }
    return url;
  };

  const publicId = getPublicId(src);

  // If it's a Cloudinary image, use CldImage for optimization
  if (src.includes("cloudinary.com")) {
    return (
      <CldImage
        src={publicId}
        alt={alt}
        width={width}
        height={height}
        crop="fill"
        gravity="auto"
        quality="auto"
        format="auto"
        className={className}
        fill={fill}
      />
    );
  }

  // Fallback to regular img tag for non-Cloudinary images
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
