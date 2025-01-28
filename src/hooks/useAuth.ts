import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null); // Track the current user
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Listen for changes in auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Set the user when auth state changes
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error: any) {
      console.error("Google login error:", error); // Log error for debugging
      if (error.code === 'auth/popup-blocked') {
        setError('Pop-ups are blocked. Please enable pop-ups and try again.');
      } else if (error.code !== 'auth/popup-closed-by-user') {
        setError(error.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error: any) {
      console.error("Email login error:", error); // Log error for debugging
      // Map Firebase error codes to user-friendly messages
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } 
      else if (error.code = 'auth/invalid-credential'){
       setError('Invalid User Credentials');
      }else {
        setError(error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Correctly return a single object
  return {
    user, // Add user to the return object
    error,
    loading,
    handleGoogleLogin,
    handleEmailLogin,
    setError,
  };
};
