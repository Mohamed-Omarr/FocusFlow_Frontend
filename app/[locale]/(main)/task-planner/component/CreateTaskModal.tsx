"use client";

import { X } from "lucide-react";
import { useReducer } from "react";

export function CreateTaskModal({ setShowCreateForm }) {
  // ------------------------------
  // Helpers
  // ------------------------------
  const today = new Date().toISOString().split("T")[0];

  // ------------------------------
  // Reducer + Initial State
  // ------------------------------
  const initialState = {
    name: "",
    category: "",
    dateType: "no-date", // no-date | single | range
    startDate: "",
    endDate: "",
    reminderCount: 1,
    reminderTime: ["09:00"],
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };

      case "SET_REMINDER_COUNT":
        return {
          ...state,
          reminderCount: action.value,
          reminderTime: Array(action.value).fill(""),
        };

      case "SET_REMINDER_TIME":
        const updated = [...state.reminderTime];
        updated[action.index] = action.value;
        return { ...state, reminderTime: updated };

      default:
        return state;
    }
  }

  const [task, dispatch] = useReducer(reducer, initialState);

  // ------------------------------
  // Create Task Handler
  // ------------------------------
  function handleCreateTask() {
    console.log("Created Task:", task);
    localStorage.setItem("focusflow-tasks", JSON.stringify(task));
    setShowCreateForm(false);
  }

  // ------------------------------
  // Component
  // ------------------------------
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex-center-all z-50 p-4">
      <div className="bg-card rounded-2xl p-5 border border-border max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex-center-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Create New Task</h2>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Task Name */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Task Name
            </label>
            <input
              type="text"
              value={task.name}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "name",
                  value: e.target.value,
                })
              }
              placeholder="e.g., Study Math"
              className="w-full px-3 py-2 bg-elevated border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Category
            </label>
            <select
              value={task.category}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "category",
                  value: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-border rounded-xl text-sm text-foreground"
            >
              <option value="">Select category</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="study">Study</option>
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Date
            </label>

            {/* Date Type Buttons */}
            <div className="flex gap-2 mb-2">
              {["no-date", "single", "range"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "dateType",
                      value: type,
                    })
                  }
                  className={`flex-1 px-3 py-2 rounded-xl border text-sm font-medium ${
                    task.dateType === type
                      ? "bg-primary btn-text border-primary shadow-sm"
                      : "bg-elevated border-border text-foreground"
                  }`}
                >
                  {type.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* Single Date */}
            {task.dateType === "single" && (
              <input
                type="date"
                min={today}
                value={task.startDate}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "startDate",
                    value: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-elevated border border-border rounded-xl text-sm text-foreground"
              />
            )}

            {/* Range */}
            {task.dateType === "range" && (
              <div className="space-y-1.5">
                {/* Start Date */}
                <input
                  type="date"
                  min={today}
                  value={task.startDate}
                  onChange={(e) => {
                    const newStart = e.target.value;

                    dispatch({
                      type: "SET_FIELD",
                      field: "startDate",
                      value: newStart,
                    });

                    // Auto-fix end date if invalid
                    if (task.endDate && task.endDate < newStart) {
                      dispatch({
                        type: "SET_FIELD",
                        field: "endDate",
                        value: newStart,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-elevated border border-border rounded-xl text-sm"
                />

                {/* End Date */}
                <input
                  type="date"
                  min={task.startDate || today}
                  value={task.endDate}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "endDate",
                      value: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-elevated border border-border rounded-xl text-sm"
                />
              </div>
            )}
          </div>

          {/* Reminder Section */}
          {(task.dateType === "single" || task.dateType === "range") && (
            <div className="p-3 bg-elevated rounded-xl border border-border">
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Reminder
                {task.dateType === "range" && (
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    Will repeat daily in range
                  </span>
                )}
              </label>

              {/* Reminder Count */}
              <div className="mb-2">
                <label className="block text-xs text-muted-foreground mb-1">
                  Count:
                </label>
                <input
                  type="number"
                  min={1}
                  max={1}
                  disabled={true}
                  value={task.reminderCount}
                  className="w-full px-2 py-1.5 bg-card border border-border rounded-lg text-sm"
                />
              </div>

              {/* Reminder Times */}
              {task.reminderCount > 0 && (
                <div className="space-y-1.5">
                  <label className="block text-xs text-muted-foreground">
                    Times:
                  </label>

                  {task.reminderTime.map((time, i) => (
                    <input
                      key={i}
                      type="time"
                      value={time}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_REMINDER_TIME",
                          index: i,
                          value: e.target.value,
                        })
                      }
                      className="w-full px-2 py-1.5 bg-card border border-border rounded-lg text-sm"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleCreateTask}
            className="w-full px-4 py-2.5 bg-primary btn-text rounded-xl text-sm font-semibold"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
