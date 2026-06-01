import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    loadTasks();
  }, [navigate]);

  const loadTasks = async () => {
    try {
      const response = await api.get("/tasks", {
        headers: getHeaders(),
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Load Tasks Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/tasks",
        {
          title,
          description,
          status,
        },
        {
          headers: getHeaders(),
        }
      );

      setTitle("");
      setDescription("");
      setStatus("Todo");

      loadTasks();
    } catch (error) {
      console.error("Add Task Error:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: getHeaders(),
      });

      loadTasks();
    } catch (error) {
      console.error("Delete Task Error:", error);
    }
  };

  const updateStatus = async (task, newStatus) => {
    try {
      await api.put(
        `/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description,
          status: newStatus,
        },
        {
          headers: getHeaders(),
        }
      );

      loadTasks();
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600">
          Task Manager
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold">
          Total Tasks: {tasks.length}
        </h3>
      </div>

      {/* Add Task */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Add New Task
        </h2>

        <form onSubmit={addTask} className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded"
            rows="4"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Todo */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Todo
          </h2>

          {tasks
            .filter((task) => task.status === "Todo")
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                updateStatus={updateStatus}
                deleteTask={deleteTask}
              />
            ))}
        </div>

        {/* In Progress */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold text-yellow-600 mb-4">
            In Progress
          </h2>

          {tasks
            .filter((task) => task.status === "In Progress")
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                updateStatus={updateStatus}
                deleteTask={deleteTask}
              />
            ))}
        </div>

        {/* Done */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold text-green-600 mb-4">
            Done
          </h2>

          {tasks
            .filter((task) => task.status === "Done")
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                updateStatus={updateStatus}
                deleteTask={deleteTask}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

/* Task Card Component */
function TaskCard({ task, updateStatus, deleteTask }) {
  return (
    <div className="border rounded p-4 mb-3 bg-gray-50">
      <h3 className="font-bold text-lg">
        {task.title}
      </h3>

      <p className="text-gray-600 mb-3">
        {task.description}
      </p>

      <select
        value={task.status}
        onChange={(e) =>
          updateStatus(task, e.target.value)
        }
        className="border rounded p-2 w-full"
      >
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <button
        onClick={() => deleteTask(task.id)}
        className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
      >
        Delete
      </button>
    </div>
  );
}

export default Dashboard;