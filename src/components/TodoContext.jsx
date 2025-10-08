// src/context/TodoContext.js
import { createContext } from "react";

export const TodoContext = createContext({
  todos: [],
  setTodos: () => {},
});
