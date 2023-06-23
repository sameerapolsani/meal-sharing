const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

const mealsRouter = require("./api/meals");
const buildPath = path.join(__dirname, "../../dist");
const port = process.env.PORT || 3000;
const cors = require("cors");

const knex = require("./database");

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

router.use("/meals", mealsRouter);

//route to get future meals sorted by Id
app.get("/future-meals", async (req, res) => {
  try {
    const meals = await knex
      .select()
      .from("meal")
      //knex.fn.now() is used inside the select() method to include the current timestamp in the query.

      .where("when", ">", knex.fn.now());
    console.log(meals);
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json("500 internal error");
  }
});
//Respond with all meals in the past (relative to the when datetime)
app.get("/past-meals", async (req, res) => {
  try {
    const meals = await knex
      .select()
      .from("meal")
      .where("when", "<", knex.fn.now())
      .orderBy("id");
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json("500. Internal Error");
  }
});
//respond with all meals sorted by id
app.get("/all-meals", async (req, res) => {
  try {
    const meals = await knex
      .select("title", "description")
      .from("meal")
      .orderBy("id");
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json("500. Internal Error");
  }
});
//respond with the meal (meaning with the minimum id)
app.get("/first-meal", async (req, res) => {
  try {
    const meal = await knex
      .select("title", "description")
      .from("meal")
      .orderBy("id")
      .first();

    if (meal) {
      res.status(200).json(meal);
    } else {
      res.status(404).json({ message: "Meal not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
//respond with the last meal (meaning with maximum id)
app.get("/first-meal", async (req, res) => {
  try {
    const meal = await knex
      .select("title", "description")
      .from("meal")
      .orderBy("id", "desc")

      .first();

    if (meal) {
      res.status(200).json(meal);
    } else {
      res.status(404).json({ message: "Meal not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal  error" });
  }
});

if (process.env.API_PATH) {
  app.use(process.env.API_PATH, router);
} else {
  throw "API_PATH is not set. Remember to set it in your .env file";
}

// for the frontend. Will first be covered in the react class
app.use("*", (req, res) => {
  res.sendFile(path.join(`${buildPath}/index.html`));
});

module.exports = app;
