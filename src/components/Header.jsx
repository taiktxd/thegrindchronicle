import React from 'react';

function Header() {
  return (
    <header className="header-area" style={{ borderBottom: '1px solid #eee', padding: '20px 0', marginBottom: '30px', backgroundColor: '#ffffff' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        {/* Tên tờ báo chính - Đã thu nhỏ gọn gàng theo ý bạn */}
        <h1 style={{ fontSize: '2rem', margin: '0', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800', color: '#111' }}>
          The Grind Chronicle
        </h1>
        {/* Slogan */}
        <p style={{ fontStyle: 'italic', color: '#666', marginTop: '5px', fontSize: '13px' }}>
          Nơi chia sẻ những câu chuyện truyền cảm hứng thể thao
        </p>
      </div>
      
      {/* Thanh Menu điều hướng */}
      <nav style={{ 
        marginTop: '20px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '30px', 
        fontWeight: 'bold',
        fontSize: '13px',
        letterSpacing: '1px'
      }}>
        <a href="/" style={{ color: '#222222', textDecoration: 'none' }}>HOME</a>
        <a href="#" style={{ color: '#ff4d4d', textDecoration: 'none' }}>NBA</a>
        <a href="#" style={{ color: '#333333', textDecoration: 'none' }}>STORIES</a>
        <a href="#" style={{ color: '#333333', textDecoration: 'none' }}>ATHLETES</a>
        <a href="#" style={{ color: '#333333', textDecoration: 'none' }}>THE GRIND</a>
        <a href="#" style={{ color: '#333333', textDecoration: 'none' }}>CONTACT</a>
      </nav>
    </header>
  );
}

export default Header;