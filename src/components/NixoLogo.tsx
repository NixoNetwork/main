import React from 'react';

interface NixoLogoProps {
  className?: string;
}

const NixoLogo: React.FC<NixoLogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L2 10L16 18L30 10L16 2Z" fill="#3CCD3A" />
      <path d="M16 24L2 16V10L16 18V24Z" fill="#2A9828" />
      <path d="M16 24L30 16V10L16 18V24Z" fill="#2A9828" />
      <path d="M16 30L2 22V16L16 24V30Z" fill="#1D6E1D" />
      <path d="M16 30L30 22V16L16 24V30Z" fill="#1D6E1D" />
    </svg>
  );
};

export default NixoLogo;