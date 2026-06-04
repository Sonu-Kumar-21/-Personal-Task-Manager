import { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Toast from './components/Toast';
import { useTasks } from './hooks/useTasks';
import { Search } from 'lucide-react';
import './index.css';

function App() {
  const { tasks, loading, error, setTasks, fetchTasks, addTask, updateTask, deleteTask, reorderTasks } = useTasks();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Custom');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchTasks(search).catch(() => addToast('Failed to fetch tasks', 'error'));
  }, [search, fetchTasks]);

  const handleAddTask = async (taskData) => {
    try {
      await addTask(taskData);
      addToast('Task added successfully!', 'success');
      setSortBy('Custom'); // Prevent auto-sorting newly added items if manually dragged
    } catch (err) {
      addToast('Failed to add task', 'error');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      await updateTask(id, updates);
      if (updates.title !== undefined) {
        addToast('Task updated!', 'success');
      } else if (updates.completed === true) {
        addToast('🎉 Congratulations on completing the task!', 'success');
      }
    } catch (err) {
      addToast('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      addToast('Task deleted', 'info');
    } catch (err) {
      addToast('Failed to delete task', 'error');
    }
  };

  const handleReorder = (activeId, overId) => {
    setSortBy('Custom'); // Switch to custom order so the array doesn't re-sort immediately
    reorderTasks(activeId, overId);
  };

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  let filteredTasks = [...tasks].filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  if (sortBy !== 'Custom') {
    filteredTasks.sort((a, b) => {
      if (sortBy === 'Date Added') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'Due Date') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'Priority') {
        const p = { High: 3, Medium: 2, Low: 1 };
        return (p[b.priority] || 0) - (p[a.priority] || 0);
      }
      return 0;
    });
  }

  return (
    <main className="app-container" aria-label="Task Management Application">
      <Header activeCount={activeCount} completedCount={completedCount} />
      
      <TaskForm onSubmit={handleAddTask} />

      <section className="controls glass" aria-label="Task Controls">
        <div className="search-input" style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0 0.5rem', borderRadius: 'var(--radius-sm)' }}>
          <Search size={18} color="var(--text-secondary)" aria-hidden="true" />
          <input 
            type="search" 
            placeholder="Search tasks..." 
            aria-label="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select 
            className="sort-select" 
            aria-label="Sort tasks by"
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="Custom">Sort: Custom Order</option>
            <option value="Date Added">Sort: Date Added</option>
            <option value="Due Date">Sort: Due Date</option>
            <option value="Priority">Sort: Priority</option>
          </select>

          <nav className="filters" aria-label="Filter tasks">
            {['All', 'Active', 'Completed'].map(f => (
              <button 
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {error && <div role="alert" style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '1rem' }}>{error}</div>}

      {loading ? (
        <div aria-live="polite" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading tasks...</div>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          onUpdate={handleUpdateTask} 
          onDelete={handleDeleteTask}
          onReorder={handleReorder} 
        />
      )}

      <div className="toast-container" aria-live="polite">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </main>
  );
}

export default App;
