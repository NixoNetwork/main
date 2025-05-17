import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NixoBag from '../components/NixoBag';
import NixoNode from '../components/NixoNode';
import NixoCluster from '../components/NixoCluster';

const HomePage: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState<string>('bag');
  const [quantity, setQuantity] = useState<number>(1);
  
  // Get price based on active product
  const getBasePrice = () => {
    switch (activeProduct) {
      case 'node':
        return 1000;
      case 'cluster':
        return 10000;
      default:
        return 20;
    }
  };

  // Calculate total price
  const totalPrice = getBasePrice() * quantity;
  
  return (
    <div className="container mx-auto relative">      
      <div className="max-w-md mx-auto pt-8 mt-32">
        {/* Tab Navigation */}
        <div className="bg-space-black/80 p-1 mb-6 grid grid-cols-3 gap-1 text-xl font-medium rounded-lg border border-nixo-green/30">
          <button
            onClick={() => {
              setActiveProduct('bag');
              setQuantity(1);
            }}
            className={`py-3 px-4 rounded-md nixo-font transition-all duration-300 ${
              activeProduct === 'bag'
                ? 'bg-nixo-green/20 text-nixo-green'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Nixo Tag
          </button>
          <button
            onClick={() => {
              setActiveProduct('node');
              setQuantity(1);
            }}
            className={`py-3 px-4 rounded-md nixo-font transition-all duration-300 ${
              activeProduct === 'node'
                ? 'bg-nixo-green/20 text-nixo-green'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Nixo Node
          </button>
          <button
            onClick={() => {
              setActiveProduct('cluster');
              setQuantity(1);
            }}
            className={`py-3 px-4 rounded-md nixo-font transition-all duration-300 ${
              activeProduct === 'cluster'
                ? 'bg-nixo-green/20 text-nixo-green'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Nixo Cluster
          </button>
        </div>

        {/* Transaction Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-space-black/80 backdrop-blur-md border border-nixo-green/30 rounded-xl p-6">
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-xl nixo-font">
                Selling
              </label>
              <div className="relative">
                <select className="select-input">
                  <option>USDC</option>
                  <option>ETH</option>
                  <option>SOL</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl nixo-font">
                  {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-gray-300 mb-2 text-xl nixo-font">
                Quantity
              </label>
              <div className="relative">
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="select-input appearance-none text-transparent"
                  style={{ color: 'transparent' }}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num} className="text-white">{num}</option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  No.
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl nixo-font">
                  {quantity}
                </div>
              </div>
            </div>
            
            <button className="w-full bg-nixo-green/20 hover:bg-nixo-green/30 text-nixo-green border border-nixo-green/50 rounded-lg py-4 nixo-font text-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(60,205,58,0.3)]">
              Connect
            </button>
          </div>
        </motion.div>
      </div>

      {/* Product Content */}
      <div className="mt-36">
        {activeProduct === 'bag' && <NixoBag />}
        {activeProduct === 'node' && <NixoNode />}
        {activeProduct === 'cluster' && <NixoCluster />}
      </div>
    </div>
  );
};

export default HomePage;