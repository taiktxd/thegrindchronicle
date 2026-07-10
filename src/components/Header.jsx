import React from 'react';
import "./Header.css";

function Header() {
  return (
    <header className="header-area">

    <div className="container">

      <h1 className="site-title">
        The Grind Chronicle
      </h1>

      <p className="site-description">
        Stories Behind Greatness.
      </p>

    </div>

    <nav className="navbar">

      <a href="/">Home</a>
      <a href="#">NBA</a>
      <a href="#">Legends</a>
      <a href="#">Mindset</a>

    </nav>

</header>
  );
}

export default Header;