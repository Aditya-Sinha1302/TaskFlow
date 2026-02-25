import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, Flag, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const TaskCard = ({ task, isOverlay }) => {
    const { updateTask, deleteTask, setEditingTask } = useStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    // Format date string
    const dateObj = task.createdAt ? new Date(task.createdAt) : new Date();
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    // Priority configurations
    const priorityColors = {
        high: { color: 'var(--priority-high)', label: 'High' },
        medium: { color: 'var(--priority-medium)', label: 'Medium' },
        low: { color: 'var(--priority-low)', label: 'Low' }
    };
    const currentPriority = task.priority || 'medium';
    const pConfig = priorityColors[currentPriority];

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1, // Completely hide the original item while dragging
        borderLeft: `5px solid ${pConfig.color}`,
    };

    if (isOverlay) {
        style.transform = `scale(1.05) rotate(2deg)`;
        style.cursor = 'grabbing';
    }

    const handleTogglePriority = (e) => {
        // Prevent drag initiation
        e.stopPropagation();
        e.preventDefault();

        const priorities = ['high', 'medium', 'low'];
        const currentIndex = priorities.indexOf(currentPriority);
        const nextPriority = priorities[(currentIndex + 1) % priorities.length];

        updateTask(task.id, { priority: nextPriority });
    };

    const handleDeleteTask = (e) => {
        e.stopPropagation();
        e.preventDefault();
        deleteTask(task.id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`task-card glass ${isDragging ? 'dragging' : ''} ${isOverlay ? 'overlay' : ''}`}
            onClick={() => setEditingTask(task)}
            {...attributes}
            {...listeners}
        >
            <div className="task-content">
                <div className="task-header-row">
                    <h4 className="task-title">{task.title}</h4>
                </div>
                {task.description && <p className="task-description">{task.description}</p>}

                <div className="task-meta-row">
                    <div className="task-badges">
                        <div className={`task-badge status-${task.status}`}>
                            {task.status.replace('-', ' ')}
                        </div>
                    </div>

                    <div className="task-meta-info">
                        <button
                            className="meta-item priority-toggle"
                            title={`Priority: ${pConfig.label} (Click to change)`}
                            onClick={handleTogglePriority}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <Flag size={14} color={pConfig.color} />
                        </button>
                        <div className="meta-item date" title="Created On">
                            <Calendar size={14} />
                            <span>{formattedDate}</span>
                        </div>
                        <button
                            className="task-delete-btn icon-btn"
                            onClick={handleDeleteTask}
                            title="Delete Task"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
