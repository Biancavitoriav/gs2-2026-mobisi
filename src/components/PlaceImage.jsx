import { useEffect, useState } from "react";

export default function PlaceImage({ place, className }) {
  const [src, setSrc] = useState(place.image || place.fallbackImage);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    setSrc(place.image || place.fallbackImage);
    setUsingFallback(false);
  }, [place.id, place.image, place.fallbackImage]);

  const handleError = () => {
    if (!usingFallback && place.fallbackImage && src !== place.fallbackImage) {
      setUsingFallback(true);
      setSrc(place.fallbackImage);
    }
  };

  return (
    <img
      src={src}
      alt={`Imagem de ${place.name}`}
      className={className}
      onError={handleError}
    />
  );
}
