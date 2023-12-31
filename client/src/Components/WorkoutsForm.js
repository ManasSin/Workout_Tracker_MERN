import React, { useState } from "react";
import { useWorkoutsContext } from "../Hooks/useWorkoutContext";
import { useAuthContext } from "../Hooks/useAuthContext";

const WorkoutsForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("you must be loged in");
      return;
    }

    const workout = { title, load, reps };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setLoad("");
      setReps("");
      setError("");
      setEmptyFields([]);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };
  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label htmlFor="title">Excersize Title:</label>
      <input
        type="text"
        id="title"
        placeholder="Workout name?"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields && emptyFields.includes("title") ? "error" : ""}
      />

      <label htmlFor="load">Load (in KG) :</label>
      <input
        type="number"
        id="load"
        placeholder="Weights is KG"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields && emptyFields.includes("load") ? "error" : ""}
      />

      <label htmlFor="reps">Reps :</label>
      <input
        type="number"
        id="reps"
        placeholder="Number of Reps"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields && emptyFields.includes("reps") ? "error" : ""}
      />

      <button>Add workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutsForm;
