import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ListTree, Receipt, Users, BarChart3, Settings, Home } from 'lucide-react';
import logo from '../../assets/LOGO.png';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/admin/categories', label: 'Categories', icon: ListTree },
  { to: '/admin/orders', label: 'Orders', icon: Receipt },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="hidden md:flex md:flex-col sticky top-0 self-start h-screen w-60 bg-gray-900 text-gray-300 shrink-0">
      <Link to="/" className="flex items-center gap-2 p-4 border-b border-gray-800">
        <img src={logo} alt="BW Juice and Bar Restaurant" className="w-10 h-10 rounded-full object-contain bg-white" />
        <span className="font-bold text-white">Admin</span>
      </Link>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-brand-500 text-white' : 'hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <Link to="/" className="flex items-center gap-3 px-4 py-3 border-t border-gray-800 text-sm hover:bg-gray-800">
        <Home size={18} /> Back to site
      </Link>
    </aside>
  );
}
