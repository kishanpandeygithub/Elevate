import React from 'react';
// If you use lucide-react for icons, otherwise replace with SVGs or your icon library
import { Rocket, BrainCircuit, Flame, Code2, ChevronRight, BarChart3 } from 'lucide-react';
import { NavLink } from 'react-router';
export default function Hero() {
    // Mock JavaScript code to display in the editor
    const codeSnippet = `function twoSum(nums, target) {
  let map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}`;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-sans antialiased relative overflow-hidden flex items-center justify-center px-4 py-12 md:py-0">

            {/* Background Decorative Rings/Glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none hidden lg:block" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[800px] h-[800px] border border-dashed border-zinc-800/40 rounded-full pointer-events-none hidden lg:block scale-75" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[800px] h-[800px] border border-dashed border-zinc-800/20 rounded-full pointer-events-none hidden lg:block scale-110" />

            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

                {/* --- LEFT COLUMN: CONTENT & CALL TO ACTIONS --- */}
                <div className="lg:col-span-5 flex flex-col space-y-6 text-center lg:text-left items-center lg:items-start">

                    {/* Top Tagline Badge */}
                    <div className="mt-10 badge bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 text-orange-400 gap-2 py-4 px-4 font-medium text-sm tracking-wide">
                        <Rocket className="w-4 h-4 text-orange-500" />
                        Your Journey to Top 1% Developers
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                        Master DSA.<br />
                        Crack Interviews.<br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Elevate Your Career.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-zinc-400 text-base sm:text-lg max-w-lg leading-relaxed font-light">
                        Practice coding problems, track your progress, and prepare for top tech companies with our interactive platform and AI-powered assistance.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
                        <button className="btn bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white border-none px-8 rounded-xl shadow-lg shadow-orange-600/20 group text-base capitalize">
                            <NavLink to='/home'>Start Solving</NavLink>
                            <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    {/* Social Proof / Users Section */}
                    <div className="flex items-center gap-3 pt-6 border-t border-zinc-900 w-full justify-center lg:justify-start">
                        <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                            <div className="avatar border-zinc-950 w-8 h-8">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User" />
                            </div>
                            <div className="avatar border-zinc-950 w-8 h-8">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="User" />
                            </div>
                            <div className="avatar border-zinc-950 w-8 h-8">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" alt="User" />
                            </div>
                            <div className="avatar border-zinc-950 w-8 h-8">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="User" />
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium">
                            <span className="text-zinc-300 font-semibold">1,000+</span> developers are leveling up
                        </p>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: VISUAL INTERACTIVE DASHBOARD --- */}
                <div className="lg:col-span-7 relative w-full flex items-center justify-center lg:justify-end mt-8 lg:mt-0">

                    {/* Main IDE Window Container */}
                    <div className="w-full max-w-xl bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 shadow-2xl relative">

                        {/* IDE Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-4">
                            <span className="text-zinc-400 font-medium text-sm">Problem</span>
                            <select className="select select-sm bg-[#1a1a1e] border-zinc-800 text-zinc-300 focus:outline-none rounded-lg text-xs">
                                <option>JavaScript</option>
                                <option>C++</option>
                                <option>Python</option>
                            </select>
                        </div>

                        {/* Code Body */}
                        <div className="font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-zinc-400 min-h-[260px]">
                            <pre className="whitespace-pre">
                                {codeSnippet.split('\n').map((line, i) => {
                                    // Basic regex styling simulation for visual matching
                                    let styledLine = line
                                        .replace(/(function|let|for|if|return|new)/g, '<span class="text-blue-400">$1</span>')
                                        .replace(/(twoSum|Map|has|get|set)/g, '<span class="text-amber-500">$1</span>');

                                    return (
                                        <div key={i} className="table-row">
                                            <span className="table-cell text-zinc-600 text-right pr-4 select-none w-6">{i + 1}</span>
                                            <span className="table-cell" dangerouslySetInnerHTML={{ __html: styledLine }} />
                                        </div>
                                    );
                                })}
                            </pre>
                        </div>

                        {/* IDE Footer / Verdict Status */}
                        <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-500 font-medium text-sm bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Accepted
                            </div>
                            <span className="text-zinc-500 text-xs font-mono">Runtime: 56 ms</span>
                        </div>
                    </div>

                    {/* --- FLOATING WIDGETS --- */}

                    {/* Widget 1: Your Progress (Top Right) */}
                    <div className="absolute -top-10 right-4 sm:right-12 bg-[#16161a]/90 backdrop-blur-md border border-zinc-800 rounded-xl p-4 shadow-xl flex items-center gap-4 w-44">
                        <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-500">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Your Progress</p>
                            <h4 className="text-xl font-bold text-zinc-200">67%</h4>
                            <p className="text-[10px] text-zinc-400 font-medium">Keep going!</p>
                        </div>
                    </div>

                    {/* Widget 2: Streak Card (Middle Right Stacked) */}
                    <div className="absolute top-24 -right-2 sm:-right-6 bg-[#16161a]/90 backdrop-blur-md border border-zinc-800 rounded-xl p-4 shadow-xl flex items-center gap-4 w-40">
                        <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500">
                            <Flame className="w-5 h-5 fill-amber-500/20" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-zinc-200">7</h4>
                            <p className="text-[11px] text-zinc-400 font-medium tracking-wide">Day Streak</p>
                        </div>
                    </div>

                    {/* Widget 3: AI Assistant (Bottom Right Overlay) */}
                    <div className="absolute -bottom-8 right-6 bg-[#16161a]/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 shadow-xl flex items-center gap-4 max-w-[240px]">
                        <div className="p-3 bg-zinc-800 rounded-xl text-zinc-300 ring-1 ring-zinc-700/50">
                            <BrainCircuit className="w-6 h-6 text-zinc-100" />
                        </div>
                        <div className="flex flex-col space-y-0.5">
                            <h5 className="text-xs font-bold text-zinc-200">AI Assistant</h5>
                            <p className="text-[11px] text-zinc-400">Stuck on a problem?</p>
                            <span className="text-[11px] text-orange-400 font-medium cursor-pointer hover:underline">
                                Get hints & solutions
                            </span>
                        </div>
                    </div>

                    {/* Floating Subtle Asset: Code Icon Decorator */}
                    <div className="absolute -bottom-14 right-1/2 translate-x-12 p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-zinc-600 hidden sm:block">
                        <Code2 className="w-4 h-4" />
                    </div>

                </div>

            </div>
        </div>
    );
}