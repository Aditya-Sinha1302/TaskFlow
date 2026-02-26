import React, { useState } from 'react';
import { Plus, X, Type, AlignLeft, Flag, Layout, Lock, Save } from 'lucide-react';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { useStore } from '../store/useStore';
import UpgradeModal from '../components/UpgradeModal';
import './Tasks.css';

const Tasks = () => {
    const { profile, tasks, addTask, updateTask, columns, addColumn, editingTask, setEditingTask } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', columnId: 'todo', priority: 'medium' });

    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');

    const [editFormData, setEditFormData] = useState(null);

    React.useEffect(() => {
        if (editingTask) {
            setEditFormData({ ...editingTask });
        } else {
            setEditFormData(null);
        }
    }, [editingTask]);

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editFormData?.title.trim()) return;
        updateTask(editingTask.id, {
            title: editFormData.title,
            description: editFormData.description,
            priority: editFormData.priority,
            columnId: editFormData.columnId,
            status: editFormData.columnId
        });
        setEditingTask(null);
    };

    const FREE_TASK_LIMIT = 4;
    const isOverLimit = !profile.isPro && tasks.length >= FREE_TASK_LIMIT;

    const handleAddTask = (e) => {
        e.preventDefault();

        if (isOverLimit) {
            setIsUpgradeModalOpen(true);
            return;
        }

        if (!newTask.title.trim()) return;
        addTask({ ...newTask, status: newTask.columnId, createdAt: new Date().toISOString() });
        setNewTask({ title: '', description: '', columnId: 'todo', priority: 'medium' });
        setIsModalOpen(false);
    };

    const handleCreateColumn = () => {
        if (!profile.isPro) {
            setIsUpgradeModalOpen(true);
            return;
        }

        if (!newColumnTitle.trim()) return;
        const newColId = newColumnTitle.toLowerCase().replace(/\s+/g, '-');
        addColumn({ title: newColumnTitle, id: newColId });
        setNewTask({ ...newTask, columnId: newColId });
        setNewColumnTitle('');
        setIsAddingColumn(false);
    };

    return (
        <div className="tasks-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Tasks Board</h1>
                    <p className="page-subtitle">Manage your project tasks</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => {
                        if (isOverLimit) {
                            setIsUpgradeModalOpen(true);
                        } else {
                            setIsModalOpen(true);
                        }
                    }}
                >
                    {isOverLimit ? <Lock size={20} /> : <Plus size={20} />}
                    New Task
                </button>
            </div>

            <KanbanBoard />

            {isModalOpen && (
                <div className="modal-overlay glass-heavy" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content cool-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2>Create New Task</h2>
                                <p className="modal-subtitle">Add a new item to your workflow</p>
                            </div>
                            <button className="icon-btn close-btn" onClick={() => setIsModalOpen(false)} title="Close">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddTask} className="cool-form">
                            <div className="form-group">
                                <label><Type size={16} /> Title</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="e.g. Design Landing Page"
                                    autoFocus
                                    className="cool-input"
                                />
                            </div>
                            <div className="form-group">
                                <label><AlignLeft size={16} /> Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Add more details about this task..."
                                    rows={4}
                                    className="cool-input"
                                />
                            </div>

                            <div className="form-group">
                                <label><Flag size={16} /> Priority</label>
                                <div className="chip-group">
                                    {['high', 'medium', 'low'].map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            className={`chip chip-${p} ${newTask.priority === p ? 'active' : ''}`}
                                            onClick={() => setNewTask({ ...newTask, priority: p })}
                                        >
                                            {p === 'high' && '🔴 High'}
                                            {p === 'medium' && '🟡 Medium'}
                                            {p === 'low' && '🟢 Low'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Layout size={16} /> Column</label>
                                <div className="chip-group">
                                    {columns.map(col => (
                                        <button
                                            key={col.id}
                                            type="button"
                                            className={`chip chip-column ${newTask.columnId === col.id ? 'active' : ''}`}
                                            onClick={() => setNewTask({ ...newTask, columnId: col.id })}
                                        >
                                            {col.title}
                                        </button>
                                    ))}

                                    {isAddingColumn ? (
                                        <div className="inline-add-column">
                                            <input
                                                type="text"
                                                value={newColumnTitle}
                                                onChange={(e) => setNewColumnTitle(e.target.value)}
                                                className="cool-input small-input"
                                                placeholder="Column Title..."
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleCreateColumn();
                                                    } else if (e.key === 'Escape') {
                                                        setIsAddingColumn(false);
                                                        setNewColumnTitle('');
                                                    }
                                                }}
                                            />
                                            <button type="button" className="icon-btn submit-btn" onClick={handleCreateColumn}>
                                                <Plus size={16} />
                                            </button>
                                            <button type="button" className="icon-btn cancel-btn" onClick={() => { setIsAddingColumn(false); setNewColumnTitle(''); }}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="chip chip-add"
                                            onClick={() => {
                                                if (!profile.isPro) {
                                                    setIsUpgradeModalOpen(true);
                                                } else {
                                                    setIsAddingColumn(true);
                                                }
                                            }}
                                            title="Add Custom Column"
                                        >
                                            {!profile.isPro ? <Lock size={14} className="mr-1" style={{ marginRight: "4px" }} /> : <Plus size={16} />} New Group
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary cool-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary cool-btn glow">
                                    <Plus size={18} />
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingTask && editFormData && (
                <div className="modal-overlay glass-heavy" onClick={() => setEditingTask(null)}>
                    <div className="modal-content cool-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2>Edit Task</h2>
                                <p className="modal-subtitle">Update task details and workflow position</p>
                            </div>
                            <button className="icon-btn close-btn" onClick={() => setEditingTask(null)} title="Close">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="cool-form">
                            <div className="form-group">
                                <label><Type size={16} /> Title</label>
                                <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    placeholder="Task Title"
                                    autoFocus
                                    className="cool-input"
                                />
                            </div>
                            <div className="form-group">
                                <label><AlignLeft size={16} /> Description</label>
                                <textarea
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    placeholder="Task details..."
                                    rows={4}
                                    className="cool-input"
                                />
                            </div>

                            <div className="form-group">
                                <label><Flag size={16} /> Priority</label>
                                <div className="chip-group">
                                    {['high', 'medium', 'low'].map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            className={`chip chip-${p} ${editFormData.priority === p ? 'active' : ''}`}
                                            onClick={() => setEditFormData({ ...editFormData, priority: p })}
                                        >
                                            {p === 'high' && '🔴 High'}
                                            {p === 'medium' && '🟡 Medium'}
                                            {p === 'low' && '🟢 Low'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Layout size={16} /> Column</label>
                                <div className="chip-group">
                                    {columns.map(col => (
                                        <button
                                            key={col.id}
                                            type="button"
                                            className={`chip chip-column ${editFormData.columnId === col.id ? 'active' : ''}`}
                                            onClick={() => setEditFormData({ ...editFormData, columnId: col.id })}
                                        >
                                            {col.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary cool-btn" onClick={() => setEditingTask(null)}>Cancel</button>
                                <button type="submit" className="btn-primary cool-btn glow">
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
        </div>
    );
};

export default Tasks;
