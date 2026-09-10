import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "100px auto",
        padding: "0 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "5rem",
          fontWeight: "800",
          color: "#111",
          marginBottom: "10px",
          letterSpacing: "-2px",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#333",
          marginBottom: "16px",
        }}
      >
        Story Not Found
      </h2>
      <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "30px" }}>
        The story or page you are looking for doesnt exist or has been moved.
      </p>

      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 28px",
          backgroundColor: "#111",
          color: "#fff",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "0.9rem",
          borderRadius: "4px",
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}