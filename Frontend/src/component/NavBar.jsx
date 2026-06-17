import logo from "../assets/Elevaltelogo.png";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../authSlice";

const NavBar = ({ setSolvedProblems }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // clear solved problems on logout
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavLink
          to="/"
          className="ml-10 flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <img
            src={logo}
            alt="Elevate Logo"
            className="w-15 h-15 object-contain"
          />
          <span className="text-xl font-black tracking-wider bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            ELEVATE
          </span>
        </NavLink>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                className="btn btn-ghost border border-zinc-800/80 bg-zinc-900/30 text-zinc-300 hover:text-orange-400 hover:bg-orange-500/5 rounded-xl px-4 py-2 text-sm normal-case transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                {user?.firstName || "User"}
              </div>
              <ul className="mt-2.5 p-1.5 shadow-2xl menu dropdown-content bg-zinc-950 border border-zinc-800 rounded-xl w-52 backdrop-blur-xl">
                <div className="px-3 py-2 text-xs font-semibold text-zinc-500 tracking-wider uppercase">
                  Menu Options
                </div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-zinc-400 hover:text-red-400 rounded-lg py-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout Account
                  </button>
                </li>
                {user?.role?.toLowerCase() === "admin" && (
                  <li className="mt-1 border-t border-zinc-900 pt-1">
                    <NavLink
                      to="/admin"
                      className="text-orange-400 hover:text-orange-300 rounded-lg py-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Admin Panel
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <NavLink
              to="/signup"
              className="btn border border-zinc-800/80 bg-zinc-900/30 text-zinc-300 hover:text-orange-400 hover:bg-orange-500/5 rounded-xl px-4 py-2 text-sm normal-case transition-all"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;