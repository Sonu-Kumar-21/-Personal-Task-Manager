import { useState } from 'react';
import { Check, Edit2, Trash2, GripVertical, AlertCircle, Tag, AlertTriangle } from 'lucide-react';
import { isPast, parseISO, startOfDay } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [editDate, setEditDate] = useState(task.dueDate || '');
  const [editPriority, setEditPriority] = useState(task.priority || 'Low');
  const [editCategory, setEditCategory] = useState(task.category || 'General');
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = !task.completed && task.dueDate && isPast(startOfDay(parseISO(task.dueDate)));

  const handleSave = () => {
    onUpdate(task.id, { 
      title: editTitle, 
      description: editDesc, 
      dueDate: editDate,
      priority: editPriority,
      category: editCategory
    });
    setIsEditing(false);
  };

  return (
    <>
      <article 
        ref={setNodeRef}
        style={style}
        className={`task-item glass ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
        aria-labelledby={`task-title-${task.id}`}
      >
        <button 
          className="drag-handle" 
          aria-label="Drag to reorder" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical size={20} aria-hidden="true" />
        </button>
        
        <button 
          className={`checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onUpdate(task.id, { completed: !task.completed })}
          aria-label="Toggle task completion"
          aria-pressed={task.completed}
        >
          {task.completed && <Check size={14} aria-hidden="true" />}
        </button>

        <div className="task-content">
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input 
                type="text" 
                aria-label="Edit task title"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select aria-label="Edit category" value={editCategory} onChange={e => setEditCategory(e.target.value)} style={{ flex: 1 }}>
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Shopping">Shopping</option>
                </select>
                <select aria-label="Edit priority" value={editPriority} onChange={e => setEditPriority(e.target.value)} style={{ flex: 1 }}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input 
                  type="date" 
                  aria-label="Edit due date"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              <textarea 
                aria-label="Edit description"
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                rows={2}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" onClick={handleSave} style={{ padding: '0.5rem 1.5rem' }}>Save Changes</button>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="task-header-row">
                <h3 id={`task-title-${task.id}`} className="task-title">{task.title}</h3>
                <div className="task-badges" aria-label="Task attributes">
                  {task.category && (
                    <span className="badge category" title={`Category: ${task.category}`}>
                      <Tag size={10} style={{ display: 'inline', marginRight: '2px' }} aria-hidden="true" />
                      {task.category}
                    </span>
                  )}
                  {task.priority && (
                    <span className={`badge priority-${task.priority.toLowerCase()}`} title={`Priority: ${task.priority}`}>
                      <AlertTriangle size={10} style={{ display: 'inline', marginRight: '2px' }} aria-hidden="true" />
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>
              
              {task.description && <p className="task-desc">{task.description}</p>}
              
              <div className="task-meta">
                <span className="task-meta-item">
                  <span className="sr-only">Added on </span>
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
                {task.dueDate && (
                  <span className={`task-meta-item ${isOverdue ? 'overdue-text' : ''}`}>
                    {isOverdue && <AlertCircle size={14} aria-hidden="true" />}
                    <span className="sr-only">{isOverdue ? 'Overdue' : 'Due'} on </span>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="task-actions">
            <button className="btn-icon" onClick={() => setIsEditing(true)} aria-label="Edit task">
              <Edit2 size={18} aria-hidden="true" />
            </button>
            <button className="btn-icon danger" onClick={() => setShowConfirm(true)} aria-label="Delete task">
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </article>

      {showConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content glass">
            <h3 id="modal-title">Delete Task?</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
