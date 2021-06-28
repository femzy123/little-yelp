import React, { useState } from 'react';
import { useParams } from 'react-router';
import RestaurantFinder from "../apis/RestaurantFinder";

const AddReview = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const {id} = useParams();

  const handleSubmit = async (e) => {
    try {
      const response = await RestaurantFinder.post(`/${id}/addReview`, {
        name,
        review,
        rating,
      });
      console.log(response.data.data);
    } catch (error) {}
  };

  return (
    <div className="mb-2">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-8">
            <label htmlFor="name">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              type="text"
              placeholder="name"
              className="form-control"
            />
          </div>

          <div className="form-group col-4">
            <label htmlFor="rating">Rating</label>
            <input
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              id="rating"
              type="number"
              className="form-control"
              min="1"
              max="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="review">Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              id="review"
              placeholder="Add review"
              className="form-control"
            ></textarea>
          </div>
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default AddReview;
