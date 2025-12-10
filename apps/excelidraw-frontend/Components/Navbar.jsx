import Link from "next/link"
export default function Navbar(){
    return (
        <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className={`flex items-center gap-2 transition-all duration-700 `}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-purple-600 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SketchSync
          </span>
        </div>

        <div className={`hidden md:flex items-center gap-8 transition-all duration-700 delay-100 `}>
          <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Features</a>
          <a href="#demo" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Demo</a>
          <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Pricing</a>
          <Link href={"/canvas/6"}>
          <button className="rounded-full bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            Get Started
          </button>
          </Link>
        </div>
      </nav>
    )
}