import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function createAccount() {
    if(password !== confirmPassword){
        setError("Password and confirm password do not match!!")
        return ;
    }
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);

      useNavigate("/articles");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="signup">
      <h1>Create Account</h1>
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

      <input
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={createAccount}>Sign Up</button>

      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
}
