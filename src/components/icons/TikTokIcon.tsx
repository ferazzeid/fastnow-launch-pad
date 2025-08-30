import React from 'react';

interface TikTokIconProps {
  className?: string;
}

export const TikTokIcon: React.FC<TikTokIconProps> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.897-1.317-2.036-1.317-3.201V1H12.97v14.762c0 .847-.357 1.6-.928 2.127a2.906 2.906 0 0 1-2.063.851c-1.603 0-2.91-1.307-2.91-2.91s1.307-2.91 2.91-2.91c.31 0 .606.05.885.141V9.53c-.293-.043-.59-.065-.895-.065-3.996 0-7.236 3.24-7.236 7.236S6.033 24 10.029 24s7.236-3.24 7.236-7.236V8.817c1.122.82 2.5 1.302 3.988 1.302v-3.445c-.742 0-1.444-.168-2.075-.458-.39-.179-.754-.394-1.086-.654z" />
  </svg>
);

export default TikTokIcon;