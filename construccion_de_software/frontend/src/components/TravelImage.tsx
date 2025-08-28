import { getDefaultImageUrl, getUnsplashImageUrl } from "@/utils/imageUtils";
import ImageWithFallback from "@/components/ImageWithFallback";

// Componente de imagen con fallback mejorado
export default function TravelImage({ destination }: { destination: string }) {
  // Intentar con Unsplash primero
  const unsplashUrl = getUnsplashImageUrl(destination);

  // Usar placeholder como fallback
  const placeholderUrl = getDefaultImageUrl(destination);

  return (
    <div className="relative h-full w-full">
      <ImageWithFallback
        src={unsplashUrl}
        fallbackSrc={placeholderUrl}
        alt={destination}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
    </div>
  );
}
