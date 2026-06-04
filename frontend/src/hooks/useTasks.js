import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://personal-task-manager-7ork.onrender.com/api/tasks' 
  : 'http://localhost:5000/api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (taskData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!res.ok) throw new Error('Failed to add task');
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();
      setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const reorderTasks = (activeId, overId) => {
    setTasks(prevTasks => {
      const oldIndex = prevTasks.findIndex(t => t.id === activeId);
      const newIndex = prevTasks.findIndex(t => t.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(prevTasks, oldIndex, newIndex);
      }
      return prevTasks;
    });
  };

  return {
    tasks,
    loading,
    error,
    setTasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks
  };
}
