import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate()

  async function login() {
    try{
        await signInWithEmailAndPassword(getAuth(), email, password);

        navigate('/articles')
    } catch (e) {
        setError(e.message)
    }
  }

  return (
    <div className="signup">
      <h1>Login!</h1>
      {error && <p>{error}</p>}
      <input
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Enter Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>
        Log In
      </button>

      <Link to='/signup'>
      Don't have an account? Create one here
      </Link>
    </div>
  );
}
