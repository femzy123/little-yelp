import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import RestaurantFinder from '../apis/RestaurantFinder';

const UpdateRestaurant = () => {
  const {id} = useParams();
  let history = useHistory();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await RestaurantFinder.get(`/${id}`)
      console.log(response);
      setName(response.data.data.restaurant.name)
      setLocation(response.data.data.restaurant.location);
      setPriceRange(response.data.data.restaurant.price_range);
    }
    fetchData();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await RestaurantFinder.put(`/${id}`, {
        name,
        location,
        price_range: priceRange,
      });
      console.log(response)
      history.push("/")
    } catch (error) {}
  }

  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price_range">Price Range</label>
          <input
            id="price_range"
            type="number"
            className="form-control"
            min="1"
            max="4"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          />
        </div>
        <button type="submit" className="mt-2 btn btn-primary" onClick={e => handleSubmit(e)}>
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateRestaurant;
