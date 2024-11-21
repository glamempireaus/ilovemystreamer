import React from 'react';

interface FooterProps {
  isDark?: boolean;
}

export default function Footer({ isDark }: FooterProps) {
  return (
    <footer className={`py-4 text-center mt-auto ${
      isDark ? 'text-gray-400' : 'text-gray-600'
    }`}>
      <p className="text-sm">© daja technologies 2024</p>
    </footer>
  );
}