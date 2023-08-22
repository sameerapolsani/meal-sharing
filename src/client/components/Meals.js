import React from "react";

const Meals = ({ meal }) => {
  return (
    <li className="gallery">
      <h4 className="title">{meal.title}</h4>
      <p className="description">
        Item Name :{meal.description}
        <span className="price">Price = {meal.price}DKK</span>
      </p>
    </li>
  );
};
export default Meals;
