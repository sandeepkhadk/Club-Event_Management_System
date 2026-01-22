import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "4rem" }}>404</h1>
      <p style={{ marginBottom: "20px" }}>
        Oops! The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#2563eb",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Go to Home
      </Link>
    </div>
  );
}