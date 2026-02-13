import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/auth.api";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err);
    }
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "text-violet-400 after:w-full" : "";

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 bg-[#0f0f12]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
           <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
             </svg>
           </div>
           <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Vidsy</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <div className="flex items-center gap-6">
                 <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                 <Link to="/subscriptions" className={`nav-link ${isActive('/subscriptions')}`}>Subscriptions</Link>
                 <Link to="/history" className={`nav-link ${isActive('/history')}`}>History</Link>
                 <Link to="/liked-videos" className={`nav-link ${isActive('/liked-videos')}`}>Liked</Link>
                 <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
              </div>

              <div className="h-6 w-px bg-gray-800 mx-2"></div>

              <div className="flex items-center gap-4">
                  <Link to="/upload" className="btn-primary flex items-center gap-2 py-2 px-4 shadow-violet-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Upload</span>
                  </Link>
                  
                  <div className="relative group">
                    <Link to={`/c/${user.username}`}>
                        <img 
                          src={user.avatar} 
                          alt="Avatar" 
                          className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-violet-500 transition-all"
                        />
                    </Link>
                    <div className="absolute right-0 mt-2 w-48 bg-[#18181b] border border-gray-800 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                        <div className="px-4 py-2 border-b border-gray-800 mb-2">
                            <p className="text-sm font-semibold text-white">{user.fullName}</p>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Settings</Link>
                        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800 transition-colors">Logout</button>
                    </div>
                  </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">Log in</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}