import React from "react";
import { useForm } from "react-hook-form";

function DishesForm() {
  const form = useForm();
  const { register } = form;
  return (
    <form className="w-4/5 m-auto mt-20 bg-gray-500 flex flex-col border-2 border-black p-5 ">
      <label htmlFor="name">Name</label>
      <input type="text" id="name" {...register("name")} />
      <label htmlFor="preparation_time">Preparation time</label>
      <input
        type="time"
        id="preparation_time"
        {...register("preparation_time")}
      />
      <label htmlFor="type">Type</label>
      <select id="option" {...register("option")}>
        <option value="pizza">Pizza</option>
        <option value="soup">Soup</option>
        <option value="sandwich">Sandwich</option>
      </select>

      <button>Submit</button>
    </form>
  );
}

export default DishesForm;
