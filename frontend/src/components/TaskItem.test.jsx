import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskItem from './TaskItem';
import { DndContext } from '@dnd-kit/core';

describe('TaskItem Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    priority: 'High',
    category: 'Work',
    createdAt: new Date().toISOString()
  };

  const renderWithDnd = (ui) => {
    return render(<DndContext>{ui}</DndContext>);
  };

  it('renders task details correctly', () => {
    renderWithDnd(<TaskItem task={mockTask} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('calls onUpdate when checkbox is clicked', () => {
    const onUpdateMock = vi.fn();
    renderWithDnd(<TaskItem task={mockTask} onUpdate={onUpdateMock} onDelete={vi.fn()} />);
    
    const checkbox = screen.getByRole('button', { name: /toggle task completion/i });
    fireEvent.click(checkbox);
    
    expect(onUpdateMock).toHaveBeenCalledWith('1', { completed: true });
  });

  it('opens delete confirmation modal when delete is clicked', () => {
    renderWithDnd(<TaskItem task={mockTask} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete task/i });
    fireEvent.click(deleteButton);
    
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
  });
});
