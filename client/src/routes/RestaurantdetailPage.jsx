import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router";
import RestaurantFinder from "../apis/RestaurantFinder";
import AddReview from "../components/AddReview";
import Reviews from "../components/Reviews";
import StarRating from "../components/StarRating";
import { RestaurantsContext } from "../context/RestaurantsContext";

const RestaurantdetailPage = () => {
  const { id } = useParams();
  const { selectedRestaurant, setSelectedRestaurant } =
    useContext(RestaurantsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get(`/${id}`);
        setSelectedRestaurant(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {selectedRestaurant && (
        <>
          <h1 className="text-center display-1">
            {selectedRestaurant.restaurant.name}
          </h1>
          {selectedRestaurant.restaurant.count < 1 ? (
            <div className="text-center text-info mb-4">
              No review yet! Be the first to add a review.
            </div>
          ) : (
            <>
              <div className="text-center mt-1 mb-3">
                <StarRating rating={selectedRestaurant.restaurant.average_rating} /><span className="text-warning">(
                {selectedRestaurant.restaurant.count})</span>
              </div>
              <div className="mt-3">
                <Reviews reviews={selectedRestaurant.reviews} />
              </div>
            </>
          )}
          <AddReview />
        </>
      )}
    </div>
  );
};

export default RestaurantdetailPage;
