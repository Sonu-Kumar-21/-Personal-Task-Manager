import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskItem from './TaskItem';
import { Inbox } from 'lucide-react';

export default function TaskList({ tasks, onUpdate, onDelete, onReorder }) {
  // Adding an activation constraint ensures that clicking on buttons/inputs inside 
  // the draggable item still works without triggering a drag event immediately.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      onReorder(active.id, over.id);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <Inbox size={48} className="empty-icon" />
        <h2>No tasks found</h2>
        <p>You're all caught up! Enjoy your day or add a new task above.</p>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="task-list">
        <SortableContext 
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
