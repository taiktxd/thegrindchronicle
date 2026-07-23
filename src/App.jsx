import { HashRouter, Routes, Route } from "react-router-dom"; 
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <HashRouter> 
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostDetail />} />
        </Routes>
      </main>

      <Footer />
    </HashRouter>
  );
}

export default App;