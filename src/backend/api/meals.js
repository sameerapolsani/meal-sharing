const express = require("express");
const router = express.Router();
const knex = require("../database");

// getting all meals

router.get("/", async (request, response) => {
  try {
    // knex syntax for selecting things. Look up the documentation for knex for further info
    const titles = await knex("meals").select("title");
    response.json(titles);
  } catch (error) {
    throw error;
  }
});

// adding new meal to database
router.post("/", async (request, response) => {
  try {
    const { title, description, location, when, max_reservations, price } =
      request.body;
    // insert to database
    await knex("meal").insert({
      title,
      description,
      location,
      when,
      max_reservations,
      price,
      created_date: new Date(),
    });
    response.status(201).json({ success: true });
  } catch (error) {
    response.status(500).json({ error: "error occurred" });
  }
});
//Returns meal by id
router.get("/:id", async (request, response) => {
  try {
    const meals = await knex("meals").where({ id: request.params.id });
    response.json(meals);
  } catch (error) {
    throw error;
  }
});
//Updates the meal by id
router.put("/:id", async (request, response) => {
  try {
    const meals = await knex("meals")
      .where("id", parseInt(request.params.id))
      .update(request.body);
    response.json(meals);
  } catch (error) {
    throw error;
  }
});
//Deletes the meal by id
router.delete("/:id", async (request, response) => {
  try {
    const deleteMeal = await knex("meals")
      .where("id", parseInt(request.params.id))
      .del();
    response.json(deleteMeal);
  } catch (error) {
    throw error;
  }
});

module.exports = router;
