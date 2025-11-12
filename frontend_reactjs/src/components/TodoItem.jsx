import React, { useEffect, useRef, useState } from 'react';

/**
 * @typedef {{ id: string; text: string; completed: boolean }} Todo
 */

/**
 * PUBLIC_INTERFACE
 * TodoItem - Single to-do item with:
 * - Toggle complete
 * - Inline edit (Enter to save, Esc to cancel)
 * - Delete item
 * - Accessible aria labels
 *
 * @param {{
 *  todo: Todo,
 *  onToggle: (id: string) => void,
 *  onDelete: (id: string) => void,
 *  onEdit: (id: string, newText: string) => void
 * }} props
 */
export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const saveEdit = () => {
    const next = draft.trim();
    if (next && next !== todo.text) {
      onEdit(todo.id, next);
    }
    setIsEditing(false);
    setDraft(next || todo.text);
  };

  const cancelEdit = () => {
    setDraft(todo.text);
    setIsEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-content">
        <button
          className={`check ${todo.completed ? 'checked' : ''}`}
          aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
          onClick={() => onToggle(todo.id)}
        >
          {todo.completed ? '✓' : ''}
        </button>

        {!isEditing ? (
          <span
            className="todo-text"
            aria-label={`To-do: ${todo.text}${todo.completed ? ' (completed)' : ''}`}
          >
            {todo.text}
          </span>
        ) : (
          <input
            ref={inputRef}
            className="input edit-input"
            aria-label="Edit to-do"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={saveEdit}
          />
        )}
      </div>

      <div className="todo-item-actions">
        {!isEditing && (
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => setIsEditing(true)}
            aria-label="Edit to-do"
            title="Edit"
          >
            ✎
          </button>
        )}
        <button
          className="btn btn-danger btn-icon"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete to-do"
          title="Delete"
        >
          🗑
        </button>
      </div>
    </li>
  );
}
