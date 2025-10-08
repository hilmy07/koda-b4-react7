import React from "react";
import Todo from "./components/Todo";
import { TodoProvider } from "./components/TodoProvider";

function App() {
  return (
    <TodoProvider>
      <Todo />
    </TodoProvider>
  );
}

export default App;
