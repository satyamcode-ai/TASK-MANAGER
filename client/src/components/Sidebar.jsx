import { Link, useLocation } from 'react-router-dom';
import { FaThLarge, FaTasks, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Sidebar = ({ closeSidebar }) => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { path: '/', icon: <FaThLarge />, label: 'Dashboard' },
        { path: '/pending', icon: <FaTasks />, label: 'Pending Tasks' },
        { path: '/completed', icon: <FaCheckCircle />, label: 'Completed Tasks' },
    ];

    return (
        <div className="w-64 bg-white h-full border-r border-gray-100 flex flex-col justify-between">
            <div>
                <div className="p-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                        T
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">Taskify</span>
                </div>

                <nav className="px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeSidebar}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${location.pathname === item.path
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
