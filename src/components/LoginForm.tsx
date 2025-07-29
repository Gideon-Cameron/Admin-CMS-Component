import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth(); // Make sure signup is implemented in your context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSigningUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white dark:bg-[#0a192f] p-6 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-[#007acc] dark:text-[#64ffda]">
        {isSigningUp ? "Create Admin Account" : "Admin Login"}
      </h2>

      {error && (
        <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block mb-1 text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#64ffda] text-[#0a192f] font-semibold py-2 px-4 rounded hover:opacity-90 transition"
      >
        {loading
          ? isSigningUp
            ? "Creating account..."
            : "Signing in..."
          : isSigningUp
          ? "Sign Up"
          : "Sign In"}
      </button>

      <p className="text-center mt-4 text-sm">
        {isSigningUp ? "Already have an account?" : "Need to create an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsSigningUp(!isSigningUp)}
          className="text-[#64ffda] underline ml-1"
        >
          {isSigningUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
