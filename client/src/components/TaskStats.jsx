import { FaTasks, FaCheck, FaClock, FaFire } from 'react-icons/fa';

const StatCard = ({ label, value, icon, color, subtext }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mb-2 ${color} text-sm`}>
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                <p className="text-gray-500 text-xs font-medium">{label}</p>
            </div>
            {subtext && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-100 text-green-600">{subtext}</span>}
        </div>
    </div>
);

const TaskStats = ({ tasks }) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                label="Total Tasks"
                value={total}
                icon={<FaTasks />}
                color="bg-primary"
            />
            <StatCard
                label="Completed"
                value={completed}
                icon={<FaCheck />}
                color="bg-green-500"
                subtext={`${total > 0 ? Math.round((completed / total) * 100) : 0}% Rate`}
            />
            <StatCard
                label="Pending"
                value={pending}
                icon={<FaClock />}
                color="bg-orange-400"
            />
            <StatCard
                label="High Priority"
                value={highPriority}
                icon={<FaFire />}
                color="bg-red-500"
            />
        </div>
    );
};

export default TaskStats;
