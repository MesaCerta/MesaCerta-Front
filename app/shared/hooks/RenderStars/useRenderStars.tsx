import { useMemo } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const useRenderStars = (averageRating: number) => {
  const stars = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      if (averageRating >= starValue) {
        return <FaStar key={index} style={{ color: "#ffc107" }} />;
      } else if (averageRating >= starValue - 0.5) {
        return <FaStarHalfAlt key={index} style={{ color: "#ffc107" }} />;
      } else {
        return <FaStar key={index} style={{ color: "#e4e5e9" }} />;
      }
    });
  }, [averageRating]);

  return stars;
};

export default useRenderStars;
