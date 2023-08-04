import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div>
        &copy; {year} Rafa-Mattar
      </div>
      <div>
        <a href="https://www.facebook.com/rafa.mattar">Facebook</a>
        <a href="https://www.twitter.com/rafa_mattar">Twitter</a>
        <a href="https://www.instagram.com/rafa_mattar">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;