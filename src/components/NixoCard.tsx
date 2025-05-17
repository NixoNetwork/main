import React from 'react';
import { motion } from 'framer-motion';

interface NixoCardProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const NixoCard: React.FC<NixoCardProps> = ({ title, isActive, onClick, children }) => {
  return (
    <motion.div 
      className={`glass-panel p-6 cursor-pointer transition-all duration-300 h-full ${
        isActive 
          ? 'bg-nixo-green/20 border-nixo-green/50' 
          : 'hover:bg-panel-light/30'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className={`text-xl font-display font-semibold mb-4 ${
        isActive ? 'text-nixo-green' : 'text-white'
      }`}>
        {title}
      </h3>
      
      {children}
    </motion.div>
  );
};

export default NixoCard;