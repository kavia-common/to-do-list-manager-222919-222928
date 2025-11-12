import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useLocalStorage } from './hooks/useLocalStorage';

/**
 * Generate a simple unique ID using timestamp and random suffix.
 */
function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * PUBLIC_INTERFACE
 * App - To-do manager with:
 * - Add, edit, delete, toggle complete
 * - Filters and Clear Completed
 * - Persistence via localStorage
 * - Ocean Professional theme and existing theme toggle
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Persist theme across reloads to improve UX
  const [storedTheme, setStoredTheme] = useLocalStorage('theme', 'light');
  useEffect(() => {
    setTheme(storedTheme || 'light');
  }, [storedTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
  }, [theme, setStoredTheme]);

  const [todos, setTodos] = useLocalStorage('todos', []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const addTodo = (text) => {
    setTodos((prev) => [{ id: generateId(), text, completed: false }, ...prev]);
  };

  // PUBLIC_INTERFACE
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // PUBLIC_INTERFACE
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // PUBLIC_INTERFACE
  const editTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  // PUBLIC_INTERFACE
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    return { total, completed, active: total - completed };
  }, [todos]);

  return (
    <div className="App">
      <header className="app-bar" role="banner">
        <div className="app-bar-inner">
          <h1 className="app-title" aria-label="To-do Manager">
            To-do Manager
          </h1>
          <div className="app-actions">
            <div className="stats" aria-label="To-do statistics">
              <span className="stat">
                Total: <strong>{stats.total}</strong>
              </span>
              <span className="stat">
                Completed: <strong>{stats.completed}</strong>
              </span>
              <span className="stat">
                Active: <strong>{stats.active}</strong>
              </span>
            </div>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </header>

      <main className="container" role="main">
        <section className="card">
          <TodoInput onAdd={addTodo} />
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onClearCompleted={clearCompleted}
          />
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <p className="muted">
          Ocean Professional theme • Local-only demo • No backend
        </p>
      </footer>
    </div>
  );
}

export default App;
