import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useAuthStore } from "./store/useAuthStore";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Watch } from "./pages/Watch";
import { WatchLater } from "./pages/WatchLater";
import { ThemeProvider } from "./components/ThemeContext"; // Ensure this path is correct
import { Footer } from "./components/Footer"; // Import Footer component

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <ThemeProvider>
      {/* Wrap the entire app with ThemeProvider */}
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/watch-later" element={<WatchLater />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          {/* Footer Component */}
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
