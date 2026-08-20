import { useDebugValue, useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import { checkAuth } from "../authSlice";
import logo from "../assets/Elevaltelogo.png";
import NavBar from "../component/NavBar";

function Homepage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);

    // Enhanced state with search string included
    const [filters, setFilters] = useState({
        search: '',
        difficulty: 'all',
        tag: "all",
        status: 'all'
    });

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosClient.get(
                    "/problem/getAllProblem"
                );
                setProblems(data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchSolvedProblems = async () => {
            try {
                const { data } = await axiosClient.get(
                    "/problem/problemSolvedByUser"
                );
                setSolvedProblems(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProblems();

        if (user) {
            fetchSolvedProblems();
        }
    }, [user]);

    // const handleLogout = () => {
    //     dispatch(logoutUser());
    //     setSolvedProblems([]); // clear solved problem on the logout
    // };

    // Derived Stats Features calculated safely from existing data structures
    const totalCount = problems.length;
    const solvedCount = solvedProblems.length;
    const completionRate = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

    const easySolved = solvedProblems.filter(p => p.difficulty === 'easy').length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty === 'medium').length;
    const hardSolved = solvedProblems.filter(p => p.difficulty === 'hard').length;

    // Enhanced matching filters
    const filteredProblem = problems.filter((problem) => {
        const searchMatch =
            problem.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
            problem.description?.toLowerCase().includes(filters.search.toLowerCase());

        const difficultyMatch =
            filters.difficulty === "all" ||
            problem.difficulty === filters.difficulty;

        const tagMatch =
            filters.tag === "all" ||
            (problem.tags && problem.tags.includes(filters.tag));

        const statusMatch =
            filters.status === "all" ||
            solvedProblems.some(
                (sp) => sp._id === problem._id
            );

        return searchMatch && difficultyMatch && tagMatch && statusMatch;
    });

    const resetFilters = () => {
        setFilters({ search: '', difficulty: 'all', tag: 'all', status: 'all' });
    };

    const isFilteringActive = filters.search !== '' || filters.difficulty !== 'all' || filters.tag !== 'all' || filters.status !== 'all';

    return (
        <div className="min-h-screen bg-[#070708] text-zinc-100 antialiased font-sans selection:bg-orange-500 selection:text-black">
            {/* Elegant Header Layout */}
            <NavBar setSolvedProblems:setSolvedProblems></NavBar>
            {/* <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-900 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <NavLink to="/" className="flex items-center gap-2.5 group transition-transform active:scale-95">
                        <img src={logo} alt="Elevate Logo" className="w-9 h-9 object-contain" />
                        <span className="text-xl font-black tracking-wider bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                            ELEVATE
                        </span>
                    </NavLink>

                    <div className="flex items-center gap-4">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} className="btn btn-ghost border border-zinc-800/80 bg-zinc-900/30 text-zinc-300 hover:text-orange-400 hover:bg-orange-500/5 rounded-xl px-4 py-2 text-sm normal-case transition-all">
                                <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                                {user?.firstName || "Guest User"}
                            </div>
                            <ul className="mt-2.5 p-1.5 shadow-2xl menu dropdown-content bg-zinc-950 border border-zinc-800 rounded-xl w-52 backdrop-blur-xl">
                                <div className="px-3 py-2 text-xs font-semibold text-zinc-500 tracking-wider uppercase">Menu Options</div>
                                <li>
                                    <button onClick={handleLogout} className="text-zinc-400 hover:text-red-400 rounded-lg py-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Logout Account
                                    </button>
                                </li>
                                {user?.role?.toLowerCase() === 'admin' && (
                                    <li className="mt-1 border-t border-zinc-900 pt-1">
                                        <NavLink to='/admin' className="text-orange-400 hover:text-orange-300 rounded-lg py-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                            Admin Panel
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav> */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* FEATURE 1: Performance Analytics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Progress</p>
                            <h3 className="text-2xl font-bold mt-1 text-zinc-200">{solvedCount} <span className="text-sm font-normal text-zinc-600">/ {totalCount} Solved</span></h3>
                        </div>
                        <div className="radial-progress text-orange-500 border border-zinc-800" style={{ "--value": completionRate, "--size": "3rem", "--thickness": "4px" }} role="progressbar">
                            <span className="text-[10px] font-bold text-zinc-300">{completionRate}%</span>
                        </div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Easy Solved</p>
                        <h3 className="text-2xl font-bold mt-1 text-emerald-400">{easySolved}</h3>
                        <div className="w-full bg-zinc-900 h-1 rounded-full mt-2 overflow-hidden">
                            <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${problems.filter(p => p.difficulty === 'easy').length ? (easySolved / problems.filter(p => p.difficulty === 'easy').length) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Medium Solved</p>
                        <h3 className="text-2xl font-bold mt-1 text-amber-500">{mediumSolved}</h3>
                        <div className="w-full bg-zinc-900 h-1 rounded-full mt-2 overflow-hidden">
                            <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${problems.filter(p => p.difficulty === 'medium').length ? (mediumSolved / problems.filter(p => p.difficulty === 'medium').length) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hard Solved</p>
                        <h3 className="text-2xl font-bold mt-1 text-rose-500">{hardSolved}</h3>
                        <div className="w-full bg-zinc-900 h-1 rounded-full mt-2 overflow-hidden">
                            <div className="bg-rose-500 h-1 rounded-full" style={{ width: `${problems.filter(p => p.difficulty === 'hard').length ? (hardSolved / problems.filter(p => p.difficulty === 'hard').length) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* FEATURE 2 & 3: Advanced Control Bar with Search Filter & Clear Actions */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
                    <div className="flex-1 max-w-md relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search problems by name or context..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full bg-zinc-900 text-zinc-200 pl-9 pr-4 py-2 rounded-xl text-sm border border-zinc-800 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            className='select select-sm bg-zinc-900 text-zinc-300 border-zinc-800 focus:outline-none rounded-xl text-xs'
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                            <option value="all">Progress: All</option>
                            <option value='solved'>Status: Solved</option>
                        </select>

                        <select
                            className='select select-sm bg-zinc-900 text-zinc-300 border-zinc-800 focus:outline-none rounded-xl text-xs'
                            value={filters.difficulty}
                            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
                            <option value="all">Difficulty: All</option>
                            <option value="easy">Easy</option>
                            <option value='medium'>Medium</option>
                            <option value='hard'>Hard</option>
                        </select>

                        <select
                            className='select select-sm bg-zinc-900 text-zinc-300 border-zinc-800 focus:outline-none rounded-xl text-xs'
                            value={filters.tag}
                            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}>
                            <option value="all">Tags: All</option>
                            <option value="array">Array</option>
                            <option value='linkedList'>LinkedList</option>
                            <option value='graph'>Graph</option>
                            <option value='dp'>DP</option>
                        </select>

                        {isFilteringActive && (
                            <button
                                onClick={resetFilters}
                                className="btn btn-sm btn-ghost text-xs text-orange-400 hover:bg-orange-500/10 rounded-xl"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* PATTERN CHANGE: Streamlined Table Dashboard Layout */}
                <div className="bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden shadow-2xl">
                    {filteredProblem.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-900 text-zinc-500 text-xs tracking-wider uppercase bg-zinc-900/20">
                                        <th className="py-4 pl-6 w-16">Status</th>
                                        <th className="py-4">Problem Challenge Title</th>
                                        <th className="py-4 w-32">Difficulty</th>
                                        <th className="py-4 w-64">Topic Tags</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProblem.map((problem) => {
                                        const isSolved = solvedProblems.some(
                                            (sp) => sp._id === problem._id
                                        );

                                        return (
                                            <tr key={problem._id} className="border-b border-zinc-900/60 hover:bg-zinc-900/30 transition-colors group">
                                                <td className="py-4 pl-6 text-center">
                                                    {isSolved ? (
                                                        <span className="text-orange-500 font-bold text-base" title="Solved">✓</span>
                                                    ) : (
                                                        <span className="text-zinc-700 text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="py-4 pr-4">
                                                    <NavLink to={`/problem/${problem._id}`} className="block">
                                                        <div className="font-bold text-zinc-200 group-hover:text-orange-400 transition-colors text-sm">
                                                            {problem.title}
                                                        </div>
                                                        {problem.description && (
                                                            <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1 max-w-2xl font-normal group-hover:text-zinc-400 transition-colors">
                                                                {problem.description}
                                                            </p>
                                                        )}
                                                    </NavLink>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${problem.difficulty === "easy"
                                                            ? "bg-emerald-500/10 text-emerald-400"
                                                            : problem.difficulty === "medium"
                                                                ? "bg-amber-500/10 text-amber-500"
                                                                : "bg-rose-500/10 text-rose-400"
                                                        }`}>
                                                        {problem.difficulty}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-6">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {problem.tags && Array.isArray(problem.tags) ? (
                                                            problem.tags.map((tag) => (
                                                                <span key={tag} className="text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800/80 px-2 py-0.5 rounded-md">
                                                                    {tag}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            problem.tags && (
                                                                <span className="text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800/80 px-2 py-0.5 rounded-md">
                                                                    {problem.tags}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-zinc-950/40">
                            <div className="w-12 h-12 rounded-xl border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                            </div>
                            <h3 className="text-base font-bold text-zinc-300">No Matching Datasets</h3>
                            <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                                There are no problems matching your selection parameters. Try modifying the active filters.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Homepage;