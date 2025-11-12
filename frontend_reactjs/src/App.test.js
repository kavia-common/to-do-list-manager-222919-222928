import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

// Utility to setup and get useful elements
function setup() {
  const utils = render(<App />);
  const input = screen.getByLabelText(/to-do text/i);
  const addBtn = screen.getByRole('button', { name: /add to-do/i });
  const btnAll = screen.getByRole('button', { name: /show all todos/i });
  const btnActive = screen.getByRole('button', { name: /show active todos/i });
  const btnCompleted = screen.getByRole('button', { name: /show completed todos/i });
  return { ...utils, input, addBtn, btnAll, btnActive, btnCompleted };
}

function addTodo(text) {
  const input = screen.getByLabelText(/to-do text/i);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
}

describe('To-do App', () => {
  beforeEach(() => {
    // mock localStorage with in-memory implementation
    const store = {};
    const localStorageMock = {
      getItem: jest.fn((key) => (key in store ? store[key] : null)),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
      }),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  test('add item via Enter and button', () => {
    const { addBtn, input } = setup();

    // Enter key
    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Buy milk')).toBeInTheDocument();

    // Button click
    fireEvent.change(input, { target: { value: 'Walk dog' } });
    fireEvent.click(addBtn);
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
  });

  test('toggle complete', () => {
    setup();
    addTodo('Task A');
    const item = screen.getByText('Task A').closest('li');
    const toggle = within(item).getByRole('button', {
      name: /mark as completed/i,
    });
    fireEvent.click(toggle);
    // After toggle, aria-label should flip to "Mark as active"
    expect(
      within(item).getByRole('button', { name: /mark as active/i })
    ).toBeInTheDocument();
  });

  test('edit item with Enter and cancel with Esc', () => {
    setup();
    addTodo('Do laundry');
    const item = screen.getByText('Do laundry').closest('li');
    const editBtn = within(item).getByRole('button', { name: /edit to-do/i });
    fireEvent.click(editBtn);

    const editInput = within(item).getByLabelText(/edit to-do/i);
    fireEvent.change(editInput, { target: { value: 'Do laundry now' } });
    fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Do laundry now')).toBeInTheDocument();

    // Start edit again and cancel with Esc
    const item2 = screen.getByText('Do laundry now').closest('li');
    const editBtn2 = within(item2).getByRole('button', { name: /edit to-do/i });
    fireEvent.click(editBtn2);

    const editInput2 = within(item2).getByLabelText(/edit to-do/i);
    fireEvent.change(editInput2, { target: { value: 'Do laundry later' } });
    fireEvent.keyDown(editInput2, { key: 'Escape', code: 'Escape' });
    // Should remain previous text
    expect(screen.getByText('Do laundry now')).toBeInTheDocument();
  });

  test('delete item', () => {
    setup();
    addTodo('Remove me');
    const item = screen.getByText('Remove me').closest('li');
    const delBtn = within(item).getByRole('button', { name: /delete to-do/i });
    fireEvent.click(delBtn);
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument();
  });

  test('filters work and clear completed removes completed items', () => {
    const { btnAll, btnActive, btnCompleted } = setup();
    addTodo('A'); // leave active
    addTodo('B'); // will complete
    // complete B
    const itemB = screen.getByText('B').closest('li');
    const toggleB = within(itemB).getByRole('button', { name: /mark as completed/i });
    fireEvent.click(toggleB);

    // Completed filter shows only B
    fireEvent.click(btnCompleted);
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.queryByText('A')).not.toBeInTheDocument();

    // Active filter shows only A
    fireEvent.click(btnActive);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();

    // All shows both
    fireEvent.click(btnAll);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();

    // Clear completed removes B
    const clearBtn = screen.getByRole('button', { name: /clear completed todos/i });
    fireEvent.click(clearBtn);
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  test('todos persist via localStorage', () => {
    const { unmount } = setup();
    addTodo('Persist me');
    // Ensure setItem used
    expect(window.localStorage.setItem).toHaveBeenCalled();

    // Unmount/remount app to simulate reload
    unmount();
    render(<App />);
    expect(screen.getByText('Persist me')).toBeInTheDocument();
  });
});
