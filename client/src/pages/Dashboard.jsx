import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TaskStats from '../components/TaskStats';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import { FaPlus, FaSearch, FaBars } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, completed, high...
    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle
    // Sync filter with URL path
    useEffect(() => {
        const path = location.pathname;
        if (path === '/pending') setFilter('pending');
        else if (path === '/completed') setFilter('completed');
        else setFilter('all');
    }, [location]);

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const response = await axios.get('http://localhost:5000/api/tasks', config);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSaveTask = async (taskData) => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        try {
            if (taskToEdit) {
                const response = await axios.put(
                    `http://localhost:5000/api/tasks/${taskToEdit._id}`,
                    taskData,
                    config
                );
                setTasks(tasks.map((t) => (t._id === taskToEdit._id ? response.data : t)));
            } else {
                const response = await axios.post(
                    'http://localhost:5000/api/tasks',
                    taskData,
                    config
                );
                setTasks([...tasks, response.data]);
            }
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
            setTasks(tasks.filter((t) => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleToggleStatus = async (task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        try {
            const response = await axios.put(
                `http://localhost:5000/api/tasks/${task._id}`,
                { ...task, status: newStatus },
                config
            );
            setTasks(tasks.map((t) => (t._id === task._id ? response.data : t)));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const openEditModal = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    // Filter Logic
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'completed'
                ? task.status === 'completed'
                : filter === 'pending'
                    ? task.status === 'pending'
                    : task.priority === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar with mobile classes */}
            {/* Sidebar with mobile classes */}
            <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>

            <main className="flex-1 w-full p-4 lg:p-8 overflow-y-auto h-screen">
                {/* Header */}
                <header className="flex justify-between items-center mb-6 lg:mb-10">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-gray-600 hover:text-primary"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FaBars className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                                {filter === 'pending' ? 'Pending Tasks' :
                                    filter === 'completed' ? 'Completed Tasks' :
                                        'Task Overview'}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {filter === 'pending' ? 'Focus on what needs to be done' :
                                    filter === 'completed' ? 'Celebrate your accomplishments' :
                                        'Manage your tasks efficiently'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </header>

                <TaskStats tasks={tasks} />

                {/* Filters & Actions */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row justify-between gap-4 items-center">
                    <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 w-full lg:flex-1 gap-3 sm:gap-0">
                        <div className="relative w-full sm:max-w-md">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                            {['all', 'high', 'medium', 'low'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium capitalize transition-colors whitespace-nowrap ${filter === f
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={openNewModal}
                        className="w-full sm:w-auto ml-0 lg:ml-4 flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-primary/30 text-sm"
                    >
                        <FaPlus />
                        <span>Add Task</span>
                    </button>
                </div>

                {/* Task List */}
                <div className="space-y-4">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <TaskItem
                                key={task._id}
                                task={task}
                                onToggleStatus={handleToggleStatus}
                                onDelete={handleDeleteTask}
                                onEdit={openEditModal}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <h3 className="text-xl font-medium text-gray-400">
                                {filter === 'pending' ? 'No pending tasks' :
                                    filter === 'completed' ? 'No completed tasks yet' :
                                        'No tasks found'}
                            </h3>
                            {filter !== 'completed' && (
                                <button onClick={openNewModal} className="mt-4 text-primary font-medium hover:underline">
                                    Create a new task
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                taskToEdit={taskToEdit}
            />
        </div>
    );
};

export default Dashboard;
