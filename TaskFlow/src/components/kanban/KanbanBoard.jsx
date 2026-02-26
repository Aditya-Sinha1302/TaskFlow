import React, { useMemo, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';
import { useStore } from '../../store/useStore';
import './Kanban.css';

const KanbanBoard = () => {
    const { tasks, columns, updateTask } = useStore();
    const [activeTask, setActiveTask] = useState(null);

    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // 3px drag to avoid accidental starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const onDragStart = (event) => {
        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
        }
    };

    const onDragEnd = (event) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        if (!isActiveTask) return;

        // Dropping a Task over another Task
        if (isActiveTask && isOverTask) {
            const activeTaskData = tasks.find((t) => t.id === activeId);
            const overTaskData = tasks.find((t) => t.id === overId);

            if (activeTaskData.columnId !== overTaskData.columnId) {
                // Moved to different column, but dropped over a task
                updateTask(activeId, { columnId: overTaskData.columnId, status: overTaskData.columnId });
            }
            // If we wanted exact ordering within the column we'd update an order field.
        }

        // Dropping a Task over a Column (empty area)
        if (isActiveTask && isOverColumn) {
            updateTask(activeId, { columnId: overId, status: overId });
        }
    };

    return (
        <div className="kanban-board">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="columns-container">
                    {columns.map((col) => (
                        <Column
                            key={col.id}
                            column={col}
                            tasks={tasks.filter((task) => task.columnId === col.id)}
                        />
                    ))}
                </div>

                {/* Create a portal or overlay for the dragging item */}
                <DragOverlay dropAnimation={{
                    duration: 250,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}>
                    {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
