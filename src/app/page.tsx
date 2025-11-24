import { auth } from "../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      alert(`Welcome ${result.user.displayName || "User"}!`);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check the console for details.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    alert("You’ve been signed out.");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "#fff", backgroundColor: "#000", height: "100vh" }}>
      <h1 style={{ color: "#00bfff" }}>Welcome to Don’s Playworld</h1>
      {user ? (
        <>
          <p>Signed in as {user.displayName}</p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "grey",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
      }

