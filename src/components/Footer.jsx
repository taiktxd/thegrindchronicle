import React from 'react';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#111111', 
      color: '#ffffff', 
      textAlign: 'center', 
      padding: '50px 20px', 
      marginTop: '60px',
      borderTop: '3px solid #ff4d4d' // Sợi chỉ đỏ tone-sur-tone với chữ NBA
    }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.4rem', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
          The Grind Chronicle
        </h3>
        <p style={{ color: '#999999', fontSize: '13px', margin: '0 0 25px 0', fontStyle: 'italic' }}>
          Unleash your inner grit. Every single day.
        </p>
        
        {/* Links phụ bản quyền kiểu Mỹ */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', fontSize: '12px' }}>
          <a href="#" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Support</a>
        </div>

        <p style={{ fontSize: '12px', color: '#666666', margin: '0' }}>
          © {new Date().getFullYear()} The Grind Chronicle. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;