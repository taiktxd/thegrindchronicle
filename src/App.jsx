import { HashRouter, Routes, Route } from "react-router-dom"; // Đổi ở đây

function App() {
  return (
    <HashRouter> {/* Đổi ở đây */}
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostDetail />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter> {/* Đổi ở đây */}
  );
}
