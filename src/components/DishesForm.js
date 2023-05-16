import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { version } from "react";

function DishesForm() {
  console.log(version);
  const form = useForm({
    defaultValues: {
      name: "",
      preparation_time: "00:00:00",
      type: null,
      no_of_slices: "",
      diameter: "",
      spiciness_scale: 5,
      slices_of_bread: "",
    },
  });
  const { register, handleSubmit, formState, watch, reset } = form;
  const { errors, isSubmitSuccessful } = formState;
  const dish_type = watch("type");
  const spiciness_number = watch("spiciness_scale");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function sendData(formData) {
    setFetching(true);
    try {
      const URL =
        "https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes";
      const data = formData;
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        setSuccess(true);
        setError(null);
      } else {
        setSuccess(false);
        throw new Error(`Request failed with status code ${response.status}`);
      }
    } catch (error) {
      setError(error.message);
    }
    setFetching(false);
  }

  function submitHandler(data) {
    const { name, preparation_time, type } = data;
    let dishDetails = {};

    if (type === "pizza") {
      const { no_of_slices, diameter } = data;
      dishDetails = { no_of_slices, diameter };
    } else if (type === "soup") {
      const { spiciness_scale } = data;
      dishDetails = { spiciness_scale };
    } else if (type === "sandwich") {
      const { slices_of_bread } = data;
      dishDetails = { slices_of_bread };
    }

    const formData = {
      name,
      preparation_time,
      type,
      ...dishDetails,
    };

    sendData(formData);
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="border-slate-800 bg-slate-700 border-2 w-4/5 md:w-2/5 lg:w-2/5 xl:w-1/5 pt-5 pb-5 rounded-xl m-auto mt-40 flex flex-col items-center "
      onSubmit={handleSubmit(submitHandler)}
    >
      <label htmlFor="name" className="text-md font-bold">
        Name
      </label>
      <input
        type="text"
        id="name"
        className="w-4/5 h-12 border-b-4 rounded-md focus:outline-none focus:border-b-4 focus:border-fuchsia-600 p-3 bg-slate-500 border-transparent shadow-md"
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
      <p className="text-red-500 w-4/5 text-center">{errors.name?.message}</p>
      <label htmlFor="preparation_time" className="text-md font-bold mt-3">
        Preparation time
      </label>
      <input
        type="text"
        maxLength="8"
        id="preparation_time"
        className="w-4/5 h-12 border-b-4 rounded-md focus:outline-none focus:border-b-4 focus:border-fuchsia-600 p-3 bg-slate-500 border-transparent shadow-md"
        {...register("preparation_time", {
          required: { value: true, message: "Preparation time is required" },
          pattern: {
            value: /^(?:[0-9][0-9]):(?:[0-9][0-9]):(?:[0-9][0-9])$/,
            message: "Proper format is HH:MM:SS",
          },
          validate: (fieldValue) => {
            return (
              fieldValue !== "00:00:00" ||
              "Preparation time cannot be set to null"
            );
          },
        })}
      />
      <p className="text-red-500 w-4/5 text-center">
        {errors.preparation_time?.message}
      </p>
      <label htmlFor="type" className="text-md font-bold mt-3">
        Type
      </label>
      <select
        id="type"
        className="w-4/5 h-12 border-b-4 rounded-md focus:outline-none focus:border-b-4 focus:border-fuchsia-600 p-3 bg-slate-500 border-transparent shadow-md cursor-pointer"
        {...register("type", {
          required: { value: true, message: "Dish type is required" },
        })}
      >
        <option value="pizza">Pizza</option>
        <option value="soup">Soup</option>
        <option value="sandwich">Sandwich</option>
      </select>
      <p className="text-red-500 w-4/5 text-center">{errors.type?.message}</p>
      {dish_type === "pizza" && (
        <>
          <label htmlFor="no_of_slices" className="text-md font-bold mt-3">
            Number of slices
          </label>
          <input
            type="number"
            id="no_of_slices"
            className="w-4/5 h-12 border-b-4 rounded-md focus:outline-none focus:border-b-4 focus:border-fuchsia-600 p-3 bg-slate-500 border-transparent shadow-md"
            {...register("no_of_slices", {
              required: {
                value: true,
                message: "Number of slices is required",
              },
            })}
          />
          <p className="text-red-500 w-4/5 text-center">
            {errors.no_of_slices?.message}
          </p>
          <label htmlFor="diameter" className="text-md font-bold mt-3">
            Diameter
          </label>
          <input
            type="number"
            step="0.01"
            id="diameter"
            className="w-4/5 h-12 border-b-4 rounded-md focus:outline-none focus:border-b-4 focus:border-fuchsia-600 p-3 bg-slate-500 border-transparent shadow-md"
            {...register("diameter", {
              required: { value: true, message: "Diameter is required" },
            })}
          />
          <p className="text-red-500 w-4/5 text-center">
            {errors.diameter?.message}
          </p>
        </>
      )}
      {dish_type === "soup" && (
        <>
          <label htmlFor="spiciness_scale" className="text-md font-bold mt-3">
            {`Spiciness scale  (${spiciness_number}/10)`}
          </label>
          <input
            type="range"
            id="spiciness_scale"
            min="1"
            max="10"
            className="w-3/5"
            {...register("spiciness_scale", {
              required: { value: true, message: "Spiciness is required" },
            })}
          />
          <p className="text-red-500 w-4/5 text-center">
            {errors.spiciness_scale?.message}
          </p>
        </>
      )}
      {dish_type === "sandwich" && (
        <>
          <label htmlFor="slices_of_bread" className="text-md font-bold mt-3">
            Slices of bread
          </label>
          <input
            type="number"
            min="1"
            id="slices_of_bread"
            className="w-4/5 h-12 border-b-4 rounded-md focus:outline-none focus:border-b-4 focus:border-fuchsia-600 p-3 bg-slate-500 border-transparent shadow-md"
            {...register("slices_of_bread", {
              required: {
                value: true,
                message: "Number of slices of bread is required",
              },
            })}
          />
          <p className="text-red-500 w-4/5 text-center">
            {errors.slices_of_bread?.message}
          </p>
        </>
      )}
      <button className="w-2/5 h-12 mt-5 bg-amber-400 hover:bg-fuchsia-600 text-black text-md font-bold rounded-3xl transition duration-200 shadow-md">
        {fetching ? "Submitting..." : "Submit"}
      </button>
      {error && (
        <p className="text-red-500 font-bold text-md mt-5 bg-black p-2 bg-opacity-60 rounded-lg shadow-md">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-500 font-bold text-md mt-5 bg-black p-2 bg-opacity-60 rounded-lg">
          Form was submitted successfully
        </p>
      )}
    </form>
  );
}

export default DishesForm;
