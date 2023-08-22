import React from "react";
import { useEffect, useState } from "react";
import Meals from "./Meals"; // Import Meals file
import "./Mealslist.css"; // Import your CSS file

const Mealslist = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      const res = await fetch("http://localhost:3000/api/meals");
      const meals = await res.json();
      setMeals(meals);
    }
    fetchMeals().catch(console.error);
  }, []);
  return (
    <ul>
      {meals.map((meal) => (
        <Meals key={meal.id} meal={meal} />
      ))}
    </ul>
  );
};
export default Mealslist;
