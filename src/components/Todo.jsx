// src/components/Todo.jsx
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "toDoList";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const editInputRef = useRef(null);

  const handleToggleOrSubmit = (e) => {
    if (!showInput) {
      e.preventDefault();
      setShowInput(true);
    }
  };

  const addTodoText = (text) => {
    const value = String(text || "").trim();
    if (!value) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: value, done: false }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) {
      setShowInput(false);
      return;
    }
    addTodoText(text);
    inputRef.current.value = "";
    inputRef.current.blur();
    setShowInput(false);
  };

  function getLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTodos(parsed);
      }
    } catch {
      (error) => {
        error.message;
      };
    }
  }

  useEffect(() => {
    getLocal();
  }, []);

  function saveLocal(todos) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      (error) => {
        error.message;
      };
    }
  }

  useEffect(() => {
    saveLocal();
  }, [todos]);

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
    requestAnimationFrame(() => editInputRef.current?.focus());
  };

  const saveEdit = () => {
    const next = editText.trim();
    if (!next) {
      cancelEdit();
      return;
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, text: next } : t))
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const onEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <div className="max-w-5xl p-6 mx-auto mt-3">
        <header className="mb-6 flex justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">To-Do List</h1>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Tambah tugas..."
              className={`${
                showInput ? "flex-1" : "hidden"
              } rounded-md border border-gray-300 bg-white px-50 py-2 outline-none ring-blue-500 focus:ring-2`}
            />
            <button
              type={showInput ? "submit" : "button"}
              onClick={handleToggleOrSubmit}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-[.98] transition"
            >
              {showInput ? "Simpan" : "Tambah"}
            </button>
          </form>
        </header>

        <ul className="mt-4 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
          {todos.map((todo) => {
            const isEditing = editingId === todo.id;
            const textClass = todo.done
              ? "line-through text-gray-400"
              : "text-gray-800";

            return (
              <li key={todo.id} className="flex items-center gap-3 p-3">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  className="size-4 accent-blue-600"
                />

                {isEditing ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={onEditKeyDown}
                    onBlur={saveEdit}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 outline-none ring-blue-500 focus:ring-2"
                  />
                ) : (
                  <span
                    className={`flex-1 ${textClass}`}
                    onDoubleClick={() => startEdit(todo.id, todo.text)}
                    title="Double click untuk edit"
                  >
                    {todo.text}
                  </span>
                )}

                {isEditing ? (
                  <button
                    onMouseDown={(e) => {
                      // prevent blur before click handler
                      e.preventDefault();
                      saveEdit();
                    }}
                    className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                  >
                    Simpan
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(todo.id, todo.text)}
                      className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 active:scale-[.98] transition"
                    >
                      Hapus
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-3 flex items-center justify-between">
          <small className="text-gray-600">{todos.length} tugas</small>
          <button
            onClick={clearCompleted}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Bersihkan yang selesai
          </button>
        </div>
      </div>
    </div>
  );
}
