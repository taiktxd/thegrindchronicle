import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <h3 className="footer-title">
          The Grind Chronicle
        </h3>

        <p className="footer-tagline">
          Stories Behind Greatness.
        </p>

        <div className="footer-links">

          <a href="#">Privacy Policy</a>

          <a href="#">Terms of Service</a>

          <a href="#">Support</a>

        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} The Grind Chronicle. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;