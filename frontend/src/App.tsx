
import { useEffect, useState } from "react";
import "./App.css";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function App() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  const API = "http://127.0.0.1:8000/api/todos/";

  // GET - Fetch all todos
  const getTodos = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  // POST - Add todo
  const addTodo = async () => {

    if (!title.trim()) return;

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        completed: false,
      }),
    });

    setTitle("");
    getTodos();
  };

  // PUT - Update todo
  const updateTodo = async (todo: Todo) => {

    await fetch(`${API}${todo.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: todo.title,
        completed: !todo.completed,
      }),
    });

    getTodos();
  };

  // DELETE - Delete todo
  const deleteTodo = async (id: number) => {

    await fetch(`${API}${id}/`, {
      method: "DELETE",
    });

    getTodos();
  };


  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <div className="logo">
            <div className="logo-icon">✓</div>
            TaskFlow
          </div>

          <h1>
            Stay focused.<br />
            <span>Get things done.</span>
          </h1>

          <p className="subtitle">
            A little progress every day adds up.
          </p>
        </header>

        <div className="stats">
          <div className="stat-card">
            <p>Total Tasks</p>
            <h2>{todos.length}</h2>
          </div>

          <div className="stat-card">
            <p>Completed</p>
            <h2>{todos.filter(t => t.completed).length}</h2>
          </div>

          <div className="stat-card">
            <p>Pending</p>
            <h2>{todos.filter(t => !t.completed).length}</h2>
          </div>
        </div>

        <div className="todo-card">
          <h2>My Tasks</h2>

          <div className="input-group">
            <input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
            />

            <button className="add-btn" onClick={addTodo}>
              + Add Task
            </button>
          </div>

          <div className="todo-list">
            {todos.length === 0 ? (
              <p className="empty">
                No tasks yet. Add your first task!
              </p>
            ) : (
              todos.map((todo) => (
                <div className="todo-item" key={todo.id}>

                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => updateTodo(todo)}
                  />

                  <span
                    className={`todo-title ${todo.completed ? "completed" : ""
                      }`}
                  >
                    {todo.title}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>

                </div>
              ))
            )}
          </div>
        </div>

        <footer className="footer">
          Made with React + Django REST API
        </footer>

      </div>
    </div>
  );

}

export default App;
