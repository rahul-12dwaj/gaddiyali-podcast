import React, { useState } from "react";
import { auth } from "../lib/firebase";
import { updatePassword, updateProfile } from "firebase/auth";
import { useAuthStore } from "../store/useAuthStore";
import { Key, Camera } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase"; // Import Firebase Storage

export const Profile = () => {
  const { user } = useAuthStore();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", content: "Passwords do not match" });
      return;
    }

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setMessage({
          type: "success",
          content: "Password updated successfully",
        });
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      setMessage({ type: "error", content: error.message });
    }
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);

    try {
      const storageRef = ref(storage, `profile_pictures/${user?.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null, // You can implement progress here if desired
        (error) => {
          setMessage({ type: "error", content: error.message });
        },
        async () => {
          // Get the download URL after successful upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          // Update the user's profile picture
          if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
              photoURL: downloadURL,
            });
            setMessage({
              type: "success",
              content: "Profile picture updated successfully",
            });
          }
        }
      );
    } catch (error: any) {
      setMessage({ type: "error", content: error.message });
    }
  };

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={
              user.photoURL ||
              `https://ui-avatars.com/api/?name=${user.displayName}`
            }
            alt={user.displayName || "User Avatar"}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              {user.displayName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <label
              htmlFor="profilePicture"
              className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline mt-2 block"
            >
              <Camera className="inline w-5 h-5 mr-2" />
              Change Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Change Password
          </h2>

          {message.content && (
            <div
              className={`p-4 mb-4 rounded ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.content}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Key className="w-5 h-5 mr-2" />
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
