import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("👤 Auth state changed:", firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("🔑 Attempting login...");
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful");
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      console.log("✍️ Attempting signup...");
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Signup successful");
    } catch (error) {
      console.error("❌ Signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      await signOut(auth);
      console.log("✅ Logged out");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
