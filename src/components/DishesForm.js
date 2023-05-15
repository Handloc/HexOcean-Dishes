import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function DishesForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      preparation_time: "00:00:00",
      type: "",
      no_of_slices: "",
      diameter: "",
      spiciness_scale: 5,
      slices_of_bread: "",
    },
  });
  const { register, handleSubmit, formState, watch, reset } = form;
  const { errors, isSubmitSuccessful } = formState;
  const type = watch("type");
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
      className="w-4/5 m-auto mt-20 bg-indigo-900 flex flex-col border-2 border-black p-5"
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
      <p className="text-red-300 font-bold">
        {errors.preparation_time?.message}
      </p>
      <label htmlFor="type">Type</label>
      <select id="type" {...register("type")}>
        <option value="pizza">Pizza</option>
        <option value="soup">Soup</option>
        <option value="sandwich">Sandwich</option>
      </select>

      {type === "pizza" && (
        <>
          <label htmlFor="no_of_slices">Number of slices</label>
          <input
            type="number"
            id="no_of_slices"
            {...register("no_of_slices", {
              required: {
                value: true,
                message: "Number of slices is required",
              },
            })}
          />
          <p className="text-red-300 font-bold">
            {errors.no_of_slices?.message}
          </p>
          <label htmlFor="diameter">Diameter</label>
          <input
            type="number"
            step="0.01"
            id="diameter"
            {...register("diameter", {
              required: { value: true, message: "Diameter is required" },
            })}
          />
          <p className="text-red-300 font-bold">{errors.diameter?.message}</p>
        </>
      )}
      {type === "soup" && (
        <>
          <label htmlFor="spiciness_scale">Spiciness scale</label>
          <input
            type="range"
            id="spiciness_scale"
            min="1"
            max="10"
            {...register("spiciness_scale", {
              required: { value: true, message: "Spiciness is required" },
            })}
          />
          <p className="text-red-300 font-bold">
            {errors.spiciness_scale?.message}
          </p>
        </>
      )}
      {type === "sandwich" && (
        <>
          <label htmlFor="slices_of_bread">Slices of bread</label>
          <input
            type="number"
            min="1"
            id="slices_of_bread"
            {...register("slices_of_bread", {
              required: {
                value: true,
                message: "Number of slices of bread is required",
              },
            })}
          />
          <p className="text-red-300 font-bold">
            {errors.slices_of_bread?.message}
          </p>
        </>
      )}
      <button>{fetching ? "Submitting..." : "Submit"}</button>
      {error && <p className="text-red-600 text-xl">{error}</p>}
      {success && (
        <p className="text-green-600 text-xl">
          Form was submitted successfully
        </p>
      )}
    </form>
  );
}

export default DishesForm;
