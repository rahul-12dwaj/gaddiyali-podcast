import React, { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface SignupProps {
  onClose: () => void;
}

// Reusable Input Component
const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  onFocus,
  error,
  disabled,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  error?: string;
  disabled?: boolean;
}) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      disabled={disabled}
      className={`appearance-none rounded-md block w-full px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export const Signup: React.FC<SignupProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation
  const validate = () => {
    const newErrors = {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    if (!formData.displayName) newErrors.displayName = "Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  // Clear error messages on focus
  const handleFocus = (field: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "", // Clear the error for the field being focused
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      // Close the modal after successful signup
      onClose();

      // Redirect if needed
      navigate("/");
    } catch (err: any) {
      // Improved error handling with user-friendly messages
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email address is already registered.");
          break;
        case "auth/invalid-email":
          setError("The email address is not valid.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        case "auth/missing-email":
          setError("Email is required.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
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
            className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
          >
            Create your account
          </motion.h2>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          >
            {error}
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <InputField
            type="text"
            placeholder="Display Name"
            value={formData.displayName}
            onChange={(e) =>
              setFormData({ ...formData, displayName: e.target.value })
            }
            error={errors.displayName}
            onFocus={() => handleFocus("displayName")}
            disabled={loading}
          />
          <InputField
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            onFocus={() => handleFocus("email")}
            disabled={loading}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={errors.password}
            onFocus={() => handleFocus("password")}
            disabled={loading}
          />
          <InputField
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={errors.confirmPassword}
            onFocus={() => handleFocus("confirmPassword")}
            disabled={loading}
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={loading}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};
