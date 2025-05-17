import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Shield, Zap } from 'lucide-react';
import NixoTag from '../assets/nixo-logo.gif';

const NixoBag: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-center mb-8">
        <img
          src={NixoTag} className='relative w-48 h-48 md:w-64 md:h-64'/>
        {/* <div className="relative w-48 h-48 md:w-64 md:h-64">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotateY: [0, 360] }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <ShoppingBag 
              size={200} 
              className="text-nixo-green opacity-80 filter drop-shadow-[0_0_8px_rgba(60,205,58,0.8)]" 
            />
          </motion.div>
        </div> */}
      </div>
      
      <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-nixo-green mb-6">
        About Nixo Network
      </h2>
      
      <p className="text-gray-300 text-center max-w-2xl text-2xl mx-auto">
        Nixo Network turns plastic-free actions into blockchain-verified impact, rewarding users via smart tags while enabling scalable income through nodes and clusters for global carbon reduction.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="glass-panel p-6 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-10 w-10 text-nixo-green" />
          </div>
          <h3 className="text-3xl font-display font-medium mb-2">Nixo Tag - Personal Security & Proof of Impact</h3>
          <p className="text-gray-400 text-2xl">
            Track eco-actions securely on-chain with every scan of your NFC-powered, reusable Nixo Tag.
          </p>
        </div>
        
        <div className="glass-panel p-6 text-center">
          <div className="flex justify-center mb-4">
            <Zap className="h-10 w-10 text-nixo-teal" />
          </div>
          <h3 className="text-3xl font-display font-medium mb-2">Nixo Node - Fast Rewards, Real-Time Impact</h3>
          <p className="text-gray-400 text-2xl">
            Earn 10% rewards instantly from 1,000 tags scanning in real time on the Solana blockchain.
          </p>
        </div>
        
        <div className="glass-panel p-6 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-nixo-green" />
          </div>
          <h3 className="text-3xl font-display font-medium mb-2">Nixo Cluster - Infinite Scale & Influence</h3>
          <p className="text-gray-400 text-2xl">
            Manage 10,000 tags, earn 30% rewards, and scale your impact across corporate and community ecosystems.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NixoBag;