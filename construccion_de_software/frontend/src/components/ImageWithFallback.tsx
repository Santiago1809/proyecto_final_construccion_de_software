"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { getLocalFallbackImageUrl } from "@/utils/imageUtils";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc: string;
  alt: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [errorCount, setErrorCount] = useState<number>(0);

  const handleError = () => {
    if (errorCount === 0) {
      // Primer error: usar el primer fallback
      setImgSrc(fallbackSrc);
      setErrorCount(1);
    } else if (errorCount === 1) {
      // Segundo error: usar el fallback local
      setImgSrc(getLocalFallbackImageUrl());
      setErrorCount(2);
    }
    // No hacemos nada si ya hemos llegado al fallback local
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      unoptimized={
        imgSrc.includes("unsplash.com") || imgSrc.includes("placehold.co")
      }
    />
  );
}
