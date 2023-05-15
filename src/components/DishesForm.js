import React from "react";
import { useForm } from "react-hook-form";

function DishesForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      preparation_time: "00:00:00",
      type: "pizza",
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  function submitHandler(data) {
    console.log(data);
  }

  return (
    <form
      className="w-4/5 m-auto mt-20 bg-gray-500 flex flex-col border-2 border-black p-5"
      onSubmit={handleSubmit(submitHandler)}
    >
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        {...register("name", {
          required: { value: true, message: "Dish name is required" },
          validate: (fieldValue) => {
            return (
              fieldValue.length >= 3 ||
              "Dish name should be at least 3 characters long"
            );
          },
        })}
      />
      <p className="text-red-300 font-bold">{errors.name?.message}</p>
      <label htmlFor="preparation_time">Preparation time</label>
      <input
        type="text"
        maxLength="8"
        id="preparation_time"
        {...register("preparation_time", {
          required: { value: true, message: "Preparation time is required" },
          pattern: {
            value: /^(?:[0-9][0-9]):(?:[0-9][0-9]):(?:[0-9][0-9])$/,
            message:
              "Preparation time format is invalid. It should be HH:MM:SS",
          },
          validate: (fieldValue) => {
            return (
              fieldValue !== "00:00:00" ||
              "Preparation time cannot be set to null"
            );
          },
        })}
      />
      <p className="text-red-300 font-bold">
        {errors.preparation_time?.message}
      </p>
      <label htmlFor="type">Type</label>
      <select id="type" {...register("type")}>
        <option value="pizza">Pizza</option>
        <option value="soup">Soup</option>
        <option value="sandwich">Sandwich</option>
      </select>

      <button>Submit</button>
    </form>
  );
}

export default DishesForm;
