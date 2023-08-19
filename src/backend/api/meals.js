const express = require("express");
const router = express.Router();
const knex = require("../database");

// GET /api/meals
router.get("/", async (request, response) => {
  try {
    let query = knex("meal");

    // Check if maxPrice is provided in the query parameters
    if ("maxPrice" in request.query) {
      const maxPrice = parseInt(request.query.maxPrice);
      if (!isNaN(maxPrice)) {
        query = query.where("price", "<", maxPrice);
      } else {
        return response.status(400).json({ error: "Invalid maxPrice value" });
      }
    }

    // Execute the query and return the results
    const meals = await query;
    response.json(meals);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});
// api/meals?availableReservations=true
if (request.query.availableReservations === "true") {
  query = query
    .select(
      "meal.title",
      "meal.id",
      "meal.max_reservations",
      knex.raw("(sum(reservation.number_of_guests)) AS Total_reserved_yet"),
      knex.raw(
        "(meal.max_reservations - sum(reservation.number_of_guests)) as Available_slot"
      )
    )
    .join("reservation", "meal.id", "=", "reservation.meal_id")
    .groupBy("reservation.meal_id")
    .having("meal.max_reservations", ">", "Total_reserved_yet");
}
// api/meals?title
if ("title" in request.query) {
  const title = request.query.title;
  query = query.where("title", "like", `%${title}%`);
}
// api/meals?dateAfter
if ("dateAfter" in request.query) {
  console.log("dateAfter");
  // Date.parse -> To check if date is valid
  const dateAfter = new Date(request.query.dateAfter);
  if (!isNaN(Date.parse(dateAfter))) {
    query = query.where("when", ">", dateAfter);
  } else {
    return response
      .status(404)
      .json({ err: "Please enter valid Dates only please" });
  }
}
// api/meals?dateBefore
if ("dateBefore" in request.query) {
  console.log("dateBefore");
  // Date.parse -> To check if date is valid
  const dateBefore = new Date(request.query.dateBefore);
  if (!isNaN(Date.parse(dateBefore))) {
    query = query.where("when", "<", dateBefore);
  } else {
    return response
      .status(404)
      .json({ err: "Please enter valid Dates only please" });
  }
}
// api/meals?limit=7
if ("limit" in request.query) {
  const limit = parseInt(request.query.limit);
  if (!isNaN(limit)) {
    query = query.limit(limit);
  } else {
    return response.status(404).json({ err: "Numbers only please" });
  }
}
// api/meals?limit=7
if ("limit" in request.query) {
  const limit = parseInt(request.query.limit);
  if (!isNaN(limit)) {
    query = query.limit(limit);
  } else {
    return response.status(404).json({ err: "Numbers only please" });
  }
}

// api/meals?limit=7
if ("limit" in request.query) {
  const limit = parseInt(request.query.limit);
  if (!isNaN(limit)) {
    query = query.limit(limit);
  } else {
    return response
      .status(400)
      .json({ error: "Invalid limit value (Numbers only please)" });
  }
}

// api/meals?sortKey=price
if ("sortKey" in request.query) {
  const orderBy = request.query.sortKey.toString().trim();
  if (["price", "when", "max_reservations"].includes(orderBy)) {
    if ("sortDir" in request.query) {
      const sortDir = request.query.sortDir.toString().trim();
      if (sortDir === "asc" || sortDir === "desc") {
        query = query.orderBy(request.query.sortKey, sortDir);
      } else {
        return response
          .status(400)
          .json({ error: "Invalid sortDir value (asc or desc)" });
      }
    } else {
      query = query.orderBy(request.query.sortKey, "asc");
    }
  } else {
    return response.status(400).json({ error: "Invalid sortKey value" });
  }
}

try {
  const meal = await query;
  meal.length
    ? response.status(200).json(meal)
    : response.status(404).send("No meals found");
} catch (error) {
  response.status(500).send(error.message);
}

module.exports = router;
