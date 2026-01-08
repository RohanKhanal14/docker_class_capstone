import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      let url = `${API_URL}/tasks`;
      if (filter !== 'all') {
        url += `?completed=${filter === 'completed'}`;
      }
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks`, {
        title,
        description,
        priority
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, {
        completed: !completed
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🐳 Docker Task Manager</h1>
        <p>Built with React, Node.js, MongoDB & Redis</p>
      </header>
      
      <div className="content">
        <div className="task-form">
          <h2>Add New Task</h2>
          <form onSubmit={addTask}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button type="submit">Add Task</button>
          </form>
        </div>

        <div>
          <h2>Tasks</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              <small>Priority: {task.priority} | Created: {new Date(task.createdAt).toLocaleDateString()}</small>
              <div className="task-actions">
                <button 
                  className="complete-btn"
                  onClick={() => toggleComplete(task._id, task.completed)}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;