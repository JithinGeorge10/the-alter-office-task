import React from 'react';
import { app } from "../firebase/config";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login: React.FC = () => {
    const handleGoogleLogin = async() => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User Info:", user);
            
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <>
            <div className="bg-pink-50 font-sans min-h-screen flex flex-col items-center justify-center px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-center w-full max-w-7xl gap-12">
                    <div className="text-center md:text-left md:w-1/2 space-y-6">
                        <h1 className="text-purple-700 text-3xl font-bold">TaskBuddy</h1>
                        <p className="text-gray-600 text-lg">
                            Streamline your workflow and track progress effortlessly with our
                            all-in-one task management app.
                        </p>
                        <button onClick={handleGoogleLogin} className="bg-black text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800">
                            <img
                                src="./google logo.png"
                                alt="Google Icon"
                                className="h-5"
                            />
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    <img
                        src="/task list view.png"
                        alt="TaskBuddy Illustration"
                        className="relative z-10 w-full max-w-xl rounded-lg shadow-lg "

                    />

                </div>
            </div>
        </>
    );
};

export default Login;
