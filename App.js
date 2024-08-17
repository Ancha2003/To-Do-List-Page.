// src/App.js
import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/todos')
      .then(response => response.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = () => {
    const newTask = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };

    fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(response => response.json())
      .then(data => setTodos([...todos, data]));

    setNewTodo('');
  };

  const toggleComplete = (id) => {
    const updatedTodo = todos.find(todo => todo.id === id);
    updatedTodo.completed = !updatedTodo.completed;

    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    })
      .then(response => response.json())
      .then(data => setTodos(todos.map(todo => todo.id === id ? data : todo)));
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => setTodos(todos.filter(todo => todo.id !== id)));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
      <TodoList todos={todos} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
    </div>
  );
};

export default App;
