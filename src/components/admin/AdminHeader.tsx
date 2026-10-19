import { useAuth } from '../../context/AuthContext';

export function AdminHeader() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6">
      <h1 className="font-semibold text-gray-800">Admin Dashboard</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
        <button onClick={logout} className="btn-outline text-sm">Logout</button>
      </div>
    </header>
  );
}