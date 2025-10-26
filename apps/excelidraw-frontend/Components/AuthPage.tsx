"use client";

export function AuthPage({isSignin}:{
    isSignin:boolean
}){
    return(
        <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md p-8 m-4 bg-white rounded-2xl shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {isSignin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-gray-600">
                        {isSignin ? "Sign in to continue" : "Sign up to get started"}
                    </p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
                        />
                    </div>
                    
                    <button 
                        onClick={()=>{

                        }}
                        className="w-full py-3 px-4 bg-gradient-l-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isSignin ? "Sign In" : "Sign Up"}
                    </button>
                </div>
                
                {/* <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {isSignin ? "Don't have an account? " : "Already have an account? "}
                        <span className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700">
                            {isSignin ? "Sign Up" : "Sign In"}
                        </span>
                    </p>
                </div> */}
            </div>
        </div>
    )
}
