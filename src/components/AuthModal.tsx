import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Login } from "../pages/Login"; // Import your Login component
import { Signup } from "../pages/Signup"; // Import your Signup component
import { useAuth } from "../hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { handleGoogleLogin, loading, error, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup

  // Close modal on successful login
  React.useEffect(() => {
    if (user) {
    }
  }, [user, onClose]);

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  {isLogin
                    ? "Welcome to Gaddiayali Podcast - Login"
                    : "Welcome to Gaddiayali Podcast - Signup"}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Render Login or Signup component based on the state */}
              {isLogin ? (
                <Login onClose={onClose} /> // Pass onClose if needed in Login component
              ) : (
                <Signup onClose={onClose} /> // Pass onClose if needed in Signup component
              )}

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setIsLogin(!isLogin)} // Toggle between Login and Signup
                  className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Log in"}
                </button>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                >
                  <img
                    className="h-5 w-5 mr-2"
                    src="https://www.google.com/favicon.ico"
                    alt="Google logo"
                  />
                  {loading ? "Signing in..." : "Continue with Google"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
