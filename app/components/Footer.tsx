import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#111",
        color: "#fff",
        textAlign: "center",
        padding: "60px 20px 40px",
        marginTop: "60px",
        borderTop : "2px solid #e67e22",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          marginBottom: "8px",
          letterSpacing: "-0.5px",
        }}
      >
        THE GRIND CHRONICLE
      </h2>

      <p style={{ fontStyle: "italic", color: "#aaa", marginBottom: "30px" }}>
        Stories Behind Greatness.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        <Link href="/" style={{ color: "#ccc", textDecoration: "none", fontSize: "0.95rem" }}>
          Privacy Policy
        </Link>
        <Link href="/" style={{ color: "#ccc", textDecoration: "none", fontSize: "0.95rem" }}>
          Terms of Service
        </Link>
        <Link href="/" style={{ color: "#ccc", textDecoration: "none", fontSize: "0.95rem" }}>
          Support
        </Link>
      </div>

      <p style={{ color: "#777", fontSize: "0.9rem" }}>
        © 2026 The Grind Chronicle. All rights reserved.
      </p>
    </footer>
  );
}