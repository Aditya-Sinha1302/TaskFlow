import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import TaskCard from './TaskCard';

const Column = ({ column, tasks }) => {
    const { deleteColumn } = useStore();
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    const isDefaultColumn = ['todo', 'in-progress', 'done'].includes(column.id);

    return (
        <div className={`kanban-column glass ${isOver ? 'is-over' : ''}`} ref={setNodeRef}>
            <div className="column-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3>{column.title}</h3>
                    <span className="task-count">{tasks.length}</span>
                </div>
                {!isDefaultColumn && (
                    <button
                        className="column-delete-btn icon-btn"
                        onClick={() => deleteColumn(column.id)}
                        title="Delete Column"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="column-content">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default Column;
