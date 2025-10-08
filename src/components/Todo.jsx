// src/components/Todo.jsx
import { useContext, useRef, useState } from "react";
import { TodoContext } from "./TodoContext";
import moment from "moment";

export default function Todo() {
  const { todos, setTodos } = useContext(TodoContext);

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

  const now = moment();

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900 overflow-hidden">
      <div className="max-w-4xl p-6 mx-auto mt-3">
        <header className="mb-6 flex flex-col md:flex-row justify-between">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            To-Do List
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Tambah tugas..."
              className={`${showInput ? "block" : "hidden"} 
                          w-full md:flex-1 md:min-w-[500px] lg:min-w-[600px] 
                          rounded-md border border-gray-300 bg-white px-4 py-2 
                          outline-none`}
            />
            <button
              type={showInput ? "submit" : "button"}
              onClick={handleToggleOrSubmit}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
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
                    className="flex-1 rounded-md border border-gray-300 px-3 py-1.5"
                  />
                ) : (
                  <span
                    className={`flex-1 flex flex-col ${textClass}`}
                    onDoubleClick={() => startEdit(todo.id, todo.text)}
                    title="Double click untuk edit"
                  >
                    {todo.text}
                    <small className="text-xs text-gray-400">
                      {now.format("YYYY-MM-DD")}
                    </small>
                  </span>
                )}

                {isEditing ? (
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      saveEdit();
                    }}
                    className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
                  >
                    Simpan
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(todo.id, todo.text)}
                      className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700"
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
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Bersihkan yang selesai
          </button>
        </div>
      </div>
    </div>
  );
}
