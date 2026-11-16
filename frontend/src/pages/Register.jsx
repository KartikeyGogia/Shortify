import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Registration Failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
        <h1 className="text-4xl font-bold text-white text-center">
          Shortify
        </h1>

        <p className="text-slate-400 text-center mt-2">
          Create your account
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-medium"
          >
            Register
          </button>
        </form>

        <p className="text-slate-400 text-center mt-6">
          Already have an account?
          <Link
            to="/"
            className="text-blue-400 ml-2 hover:text-blue-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;