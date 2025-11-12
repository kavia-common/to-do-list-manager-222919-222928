import React, { useMemo, useState } from 'react';
import TodoItem from './TodoItem';

/**
 * @typedef {{ id: string; text: string; completed: boolean }} Todo
 */

/**
 * PUBLIC_INTERFACE
 * TodoList - Shows filter controls, item list, and Clear Completed button.
 *
 * @param {{
 *   todos: Todo[],
 *   onToggle: (id: string) => void,
 *   onDelete: (id: string) => void,
 *   onEdit: (id: string, newText: string) => void,
 *   onClearCompleted: () => void
 * }} props
 */
export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onClearCompleted,
}) {
  const [filter, setFilter] = useState('all');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      case 'all':
      default:
        return todos;
    }
  }, [todos, filter]);

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <section className="todo-section" aria-label="To-do list section">
      <div className="filters" role="group" aria-label="Filter todos">
        <button
          className={`chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
          aria-label="Show all todos"
        >
          All
        </button>
        <button
          className={`chip ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
          aria-label="Show active todos"
        >
          Active
        </button>
        <button
          className={`chip ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
          aria-label="Show completed todos"
        >
          Completed
        </button>
      </div>

      <ul className="todo-list" aria-live="polite">
        {filteredTodos.length === 0 ? (
          <li className="empty" aria-label="No todos">
            No todos to display
          </li>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </ul>

      <div className="list-footer">
        <span className="count" aria-label="Items count">
          {todos.filter((t) => !t.completed).length} items left
        </span>

        <button
          className="btn btn-danger-outline"
          onClick={onClearCompleted}
          aria-label="Clear completed todos"
          disabled={completedCount === 0}
        >
          Clear completed
        </button>
      </div>
    </section>
  );
}
