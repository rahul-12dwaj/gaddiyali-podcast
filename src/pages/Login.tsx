import React, { useState, useEffect } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

interface LoginProps {
  onClose: () => void; // Modal close callback
}

export const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const { error, loading, handleEmailLogin, user } = useAuth(); // Access user state from the hook

  // Form validation
  const validate = () => {
    const errors = { email: "", password: "" };
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  // Close modal if user is logged in
  useEffect(() => {
    if (user) {
      onClose(); // Close the modal when user is logged in
    }
  }, [user, onClose]); // Trigger when `user` changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Perform login
    await handleEmailLogin(email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex items-center justify-center"
    >
      <div className="max-w-md w-full space-y-8 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
          >
            Sign in to your account
          </motion.h2>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                name="password"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  formErrors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.password}
                </p>
              )}
            </div>
          </div>

          {/* Sign-In Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};
