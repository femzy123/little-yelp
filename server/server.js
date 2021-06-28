require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();
const morgan = require("morgan");

const port = process.env.PORT || 3002;

// app.use(morgan("dev"));

// app.use((req, res, next) => {
//   console.log("yeah our middleware");
//   next();
// });

app.use(cors());
app.use(express.json());

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const results = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id"
    );
    res.status(200).json({
      status: "success",
      results: results.rowCount,
      data: { restaurants: results.rows },
    });
  } catch (err) {
    res.status(500).json({
      error: err.name,
    });
  }
});

// Get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      [id]
    );

    const reviews = await db.query(
      "SELECT * FROM reviews where restaurant_id = $1",
      [id]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: err.name,
    });
  }
});

// Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  console.log(req.body);
  try {
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );
    console.log(results);
    res.status(201).json({
      status: "success",
      data: { restaurant: results.rows },
    });
  } catch (error) {
    console.log(error);
  }
});

// Update a restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );
    console.log(results);
    res.status(200).json({
      status: "success",
      data: { restuarant: results.rows },
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const results = await db.query("DELETE FROM restaurants where id = $1", [
      req.params.id,
    ]);
    console.log(results);
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

// Add a review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO reviews(restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning * ",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    res.status(201).json({
      status: 'success',
      data: {
        review: results.rows[0],
      }
    })
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("Server is up and listening on port " + port);
});
