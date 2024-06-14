import React, { useState, useEffect, useReducer, useRef } from 'react';
import './App.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import useFetch from './useFetch'; 

const initialTodos = [];

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return action.payload;
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: Date.now(),
          title: action.payload,
          completed: false,
        },
      ];
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    default:
      return state;
  }
};

const TodoList = () => {
  const { isLoading, isError, data: fetchedTodos } = useFetch(
    'https://jsonplaceholder.typicode.com/todos'
  );
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const newTodoRef = useRef(null); 

  useEffect(() => {
    if (fetchedTodos.length > 0) {
      dispatch({ type: 'SET_TODOS', payload: fetchedTodos });
    }
  }, [fetchedTodos]);

  const handleToggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      dispatch({ type: 'ADD_TODO', payload: newTodo });
      setNewTodo('');
  
      if (newTodoRef.current) {
        newTodoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      alert(`Your todo list "${newTodo}" is created. Scroll down a bit to find! You can toggle the check mark as well`);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;

  return (
    <div>
      <h1>Todo List</h1>
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
        <button onClick={handleAddTodo}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className={todo.completed ? 'completed' : 'not-completed'}
            style={{ borderBottom: '1px solid #ccc', padding: '10px' }}
            ref={index === todos.length - 1 ? newTodoRef : null} 
          >
            <span style={{ flex: 1 }}>{todo.title}</span>
            <div className="icon-container">
              <FontAwesomeIcon
                icon={faCheck}
                className="icon"
                onClick={() => handleToggleTodo(todo.id)}
                style={{
                  cursor: 'pointer',
                  color: todo.completed ? 'green' : 'gray',
                  marginRight: '10px', 
                }}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className="icon"
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={() => console.log('Delete Todo:', todo.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
