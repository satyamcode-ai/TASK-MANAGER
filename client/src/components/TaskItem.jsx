import { FaTrash, FaEdit, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import clsx from 'clsx';
import moment from 'moment';

const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-orange-100 text-orange-700',
    high: 'bg-red-100 text-red-700',
};

const TaskItem = ({ task, onToggleStatus, onDelete, onEdit }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all duration-300 mb-4">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onToggleStatus(task)}
                    className={clsx(
                        "text-2xl transition-colors",
                        task.status === 'completed' ? 'text-green-500' : 'text-gray-300 hover:text-primary'
                    )}
                >
                    {task.status === 'completed' ? <FaCheckCircle /> : <FaRegCircle />}
                </button>

                <div>
                    <h4 className={clsx(
                        "text-base font-semibold text-gray-800 transition-all",
                        task.status === 'completed' && "line-through text-gray-400"
                    )}>
                        {task.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-1">
                        <span className={clsx("text-[10px] px-2 py-0.5 rounded-full font-medium capitalize", priorityColors[task.priority])}>
                            {task.priority}
                        </span>
                        <span className="text-[10px] text-gray-400">
                            {moment(task.dueDate).format('MMM D, YYYY')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(task)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                    <FaEdit />
                </button>
                <button
                    onClick={() => onDelete(task._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
