import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TodoInput - Controlled text input with Add button.
 * - Enter key adds todo
 * - Accessible labels and aria attributes
 *
 * @param {{ onAdd: (text: string) => void }} props
 */
export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="todo-input" role="region" aria-label="Add new todo">
      <label htmlFor="new-todo" className="sr-only">
        New to-do
      </label>
      <input
        id="new-todo"
        aria-label="To-do text"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="What needs to be done?"
        className="input"
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleAdd}
        aria-label="Add to-do"
      >
        Add
      </button>
    </div>
  );
}
