'use client';
export default function Loading() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Grid Skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "40px",
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ animation: "pulse 1.5s infinite" }}>
            <div
              style={{
                width: "100%",
                height: "220px",
                backgroundColor: "#eee",
                marginBottom: "16px",
                borderRadius: "4px",
              }}
            />
            <div style={{ width: "30%", height: "14px", backgroundColor: "#eee", marginBottom: "12px" }} />
            <div style={{ width: "85%", height: "20px", backgroundColor: "#eee", marginBottom: "8px" }} />
            <div style={{ width: "60%", height: "20px", backgroundColor: "#eee", marginBottom: "16px" }} />
            <div style={{ width: "100%", height: "14px", backgroundColor: "#eee", marginBottom: "6px" }} />
            <div style={{ width: "90%", height: "14px", backgroundColor: "#eee" }} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}