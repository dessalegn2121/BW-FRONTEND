import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/LOGO.png';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="BW Juice and Bar Restaurant" className="h-16 w-16 object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l, i) => (
              <NavLink
                key={`${l.to}-${i}`}
                to={l.to}
                className={({ isActive }) =>
                  `text-[15px] font-medium transition-colors ${
                    isActive ? 'text-brand-600' : 'text-gray-800 hover:text-brand-600'
                  }`
                }
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-5">
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 text-gray-800 hover:text-brand-600 font-medium"
              >
                <span className="w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center">
                  <User size={16} />
                </span>
                <span className="hidden md:inline">Log Out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 text-gray-800 hover:text-brand-600 font-medium"
              >
                <span className="w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center">
                  <User size={16} />
                </span>
                <span className="hidden md:inline">Log In</span>
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="hidden md:inline text-sm font-medium text-brand-600 hover:underline">
                Admin
              </Link>
            )}

            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center hover:bg-brand-700 transition"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              <span className="absolute -top-1 -right-1 bg-white text-brand-600 border border-brand-600 text-[10px] font-bold rounded-full w-5 h-5 grid place-items-center">
                {itemCount}
              </span>
            </Link>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t py-3 space-y-1">
            {links.map((l, i) => (
              <NavLink
                key={`${l.to}-${i}`}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-600">
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}