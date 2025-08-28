export const getDefaultImageUrl = (destination: string) => {
  // Opción 1: placehold.co
  return `https://placehold.co/300x200/EAEAEA/31304D?text=${encodeURIComponent(
    destination
  )}`;

  // Opción 2: placeholder.com
  // return `https://via.placeholder.com/300x200?text=${encodeURIComponent(destination)}`;

  // Opción 3: dummyimage.com
  // return `https://dummyimage.com/300x200/eaeaea/31304d&text=${encodeURIComponent(destination)}`;
};

// Agregamos una función para generar imágenes de Unsplash
export const getUnsplashImageUrl = (query: string) => {
  // Limpia y normaliza el término de búsqueda
  const cleanQuery = query.replace(/\s+/g, "");
  return `https://source.unsplash.com/random/300x200/?${cleanQuery}`;
};

// Ruta a la imagen local de fallback
export const getLocalFallbackImageUrl = () => {
  return "/images/default-travel.jpg";
};
