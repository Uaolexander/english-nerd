"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function ImageWithFallback({ src, alt, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  if (failed) {
    return <div className="absolute inset-0 skeleton-shimmer" />;
  }

  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton-shimmer" />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
