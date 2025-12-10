"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import  Navbar  from "@/Components/Navbar";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-indigo-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-3xl transition-transform duration-1000"
          style={{
            top: `${mousePosition.y * 0.02}px`,
            left: `${mousePosition.x * 0.02}px`,
          }}
        />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-3xl" />
      </div>

      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-32 lg:px-12">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            Now with real-time collaboration
          </div>

          <h1 className="mb-6 text-6xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-7xl">
            Draw, Design, and
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Collaborate Freely
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            The ultimate whiteboard for your ideas. Create beautiful diagrams, wireframes, and sketches with an intuitive interface. No sign-up required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href={"/signin"}>
              <button className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all hover:shadow-indigo-500/50 hover:scale-105">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Signin
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </Link>

            <Link href={"/signup"}>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 shadow-lg hover:border-indigo-300 hover:shadow-xl transition-all hover:scale-105">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Signup
              </button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="font-medium">Real-time Collaboration</span>
            </div>
          </div>
        </div>

        {/* Hero Image / Canvas Preview */}
        <div className={`relative mx-auto mt-20 max-w-5xl transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            {/* Toolbar */}
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="flex gap-2">
                {['Selection', 'Rectangle', 'Circle', 'Arrow', 'Line', 'Text', 'Image'].map((tool, i) => (
                  <div
                    key={tool}
                    className="group relative rounded-lg bg-white p-2.5 shadow-sm hover:bg-indigo-50 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer transition-all hover:scale-110"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="h-5 w-5 bg-gradient-to-br from-indigo-400 to-purple-400 rounded"></div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white">
                      {tool}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Area */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {/* Animated Drawing Elements */}
              <svg className="h-full w-full" viewBox="0 0 800 450">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* Rectangle */}
                <rect x="50" y="50" width="200" height="150" fill="none" stroke="url(#grad1)" strokeWidth="3" rx="8" className="animate-pulse" style={{ animationDuration: '3s' }} />

                {/* Circle */}
                <circle cx="450" cy="125" r="75" fill="none" stroke="url(#grad1)" strokeWidth="3" className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />

                {/* Arrow */}
                <line x1="280" y1="125" x2="350" y2="125" stroke="url(#grad1)" strokeWidth="3" markerEnd="url(#arrowhead)" className="animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                  </marker>
                </defs>

                {/* Freehand Path */}
                <path d="M 100 280 Q 200 220, 300 280 T 500 280" fill="none" stroke="url(#grad1)" strokeWidth="3" className="animate-pulse" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />

                {/* Text placeholder */}
                <rect x="550" y="250" width="200" height="100" fill="#f3f4f6" stroke="url(#grad1)" strokeWidth="2" rx="8" className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }} />
                <text x="650" y="300" textAnchor="middle" fill="#6366f1" fontSize="16" fontWeight="600">Your Ideas Here</text>
              </svg>

              {/* Collaboration Avatars */}
              <div className="absolute bottom-4 right-4 flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-400 shadow-lg"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-semibold text-gray-600 shadow-lg">
                  +5
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -right-8 top-1/4 animate-bounce rounded-lg bg-white p-3 shadow-xl dark:bg-gray-800" style={{ animationDuration: '3s' }}>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">✨ Auto-save</div>
          </div>
          <div className="absolute -left-8 bottom-1/4 animate-bounce rounded-lg bg-white p-3 shadow-xl dark:bg-gray-800" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">🔒 Encrypted</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid gap-8 md:grid-cols-3">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized for speed with minimal latency' },
            { icon: '🎨', title: 'Infinite Canvas', desc: 'Never run out of space for your ideas' },
            { icon: '👥', title: 'Collaborate', desc: 'Work together with your team in real-time' },
            { icon: '📱', title: 'Cross-platform', desc: 'Works seamlessly on desktop and mobile' },
            { icon: '🔄', title: 'Version History', desc: 'Never lose your work with automatic saves' },
            { icon: '🎯', title: 'Export Anywhere', desc: 'Export to PNG, SVG, or share with a link' },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105 hover:border-indigo-200 dark:border-gray-800 dark:bg-gray-900/50"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}