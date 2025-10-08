import React from "react";
import { TodoContext } from "./TodoContext";

const STORAGE_KEY = "toDoList";

export function TodoProvider({ children }) {
  const [todos, setTodos] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
      console.error("Failed to save todos to localStorage:", err);
    }
  }, [todos]);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
}
