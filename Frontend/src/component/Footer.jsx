import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0b] text-zinc-400 border-t border-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-900">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
              <div className="p-2 bg-gradient-to-br from-orange-600 to-amber-500 rounded-lg text-white">
                {/* Terminal SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </div>
              <span>DevElevate</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
              The ultimate interactive platform for mastering Data Structures, Algorithms, and technical interviews. 
              Built by <span className="text-zinc-300 font-medium">Kishan Pandey</span> – a B.Tech student and passionate developer – to help coders level up their skills.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-3">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Platform</span>
              <a href="#problems" className="text-sm hover:text-orange-400 transition-colors">Problem Sets</a>
              <a href="#compiler" className="text-sm hover:text-orange-400 transition-colors">Online IDE</a>
              <a href="#ai" className="text-sm hover:text-orange-400 transition-colors">AI Assistant</a>
            </div>

            <div className="flex flex-col space-y-3">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Future Resources</span>
              <a href="#sheets" className="text-sm hover:text-orange-400 transition-colors">DSA Sheets</a>
              <a href="#guides" className="text-sm hover:text-orange-400 transition-colors">Interview Guides</a>
              <a href="#roadmap" className="text-sm hover:text-orange-400 transition-colors">Career Roadmap</a>
            </div>

            <div className="flex flex-col space-y-3 col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">About</span>
              <a href="#creator" className="text-sm hover:text-orange-400 transition-colors">Creator: Kishan Pandey</a>
              <a href="#btech" className="text-sm hover:text-orange-400 transition-colors">B.Tech Student</a>
              <a href="#developer" className="text-sm hover:text-orange-400 transition-colors">Full‑Stack Developer</a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1 order-2 sm:order-1">
            <span suppressHydrationWarning>
              © {new Date().getFullYear()} DevElevate Inc. — Created by <span className="text-zinc-300 font-medium">Kishan Pandey</span> (B.Tech Student • Developer)
            </span>
          </div>
          {/* Optional: you can add social icons here later if needed */}
        </div>
      </div>
    </footer>
  );
}