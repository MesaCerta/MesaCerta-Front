import { useState, useEffect } from "react";
import {
  getAverageRatingDish,
  getAverageRatingRestaurant,
} from "../../service";
import { IListData } from "@/app/shared/@types";

const useRatings = (items: IListData[], itemType: "restaurant" | "dish") => {
  const [ratings, setRatings] = useState<{
    [key: string]: { averageRating: number; totalReviews: number };
  }>({});

  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsData: {
        [key: string]: { averageRating: number; totalReviews: number };
      } = {};

      for (const item of items) {
        let ratingData;
        if (itemType === "restaurant") {
          ratingData = await getAverageRatingRestaurant(item.id);
        } else {
          ratingData = await getAverageRatingDish(item.id);
        }

        ratingsData[item.id] = ratingData;
      }

      setRatings(ratingsData);
    };

    fetchRatings();
  }, [items, itemType]);

  return ratings;
};

export default useRatings;
