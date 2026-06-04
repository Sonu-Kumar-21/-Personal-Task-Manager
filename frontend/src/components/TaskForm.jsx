import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('General');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({ title, description, dueDate, priority, category });
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Low');
    setCategory('General');
  };

  return (
    <form className="task-form glass" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label className="form-label">Task Title</label>
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Due Date (Optional)</label>
          <input 
            type="date" 
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Description (Optional)</label>
          <textarea 
            placeholder="Add details..." 
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={!title.trim()}>
        <Plus size={20} />
        Add Task
      </button>
    </form>
  );
}
