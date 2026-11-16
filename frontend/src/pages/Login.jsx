import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import { useEffect } from "react";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }
}, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/Login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center">
          Shortify
        </h1>

        <p className="text-slate-400 text-center mt-2">
          Login to continue
        </p>

        <form className="mt-8" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          No account?
          <Link
            to="/register"
            className="text-blue-400 ml-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
