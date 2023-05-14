import React from "react";

function DishesForm() {
  return (
    <form>
      <label HtmlFor="name">Name</label>
      <input type="text" name="name" />
      <label HtmlFor="preparation_time">Preparation time</label>
      <input type="time" name="preparation_time" />
      <label HtmlFor="type">Type</label>
      <select name="option">
        <option value="pizza">Pizza</option>
        <option value="soup">Soup</option>
        <option value="sandwich">Sandwich</option>
      </select>
      <button>Submit</button>
    </form>
  );
}

export default DishesForm;
