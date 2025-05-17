import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ShoppingCart } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  icon: string;
}

interface TransactionPanelProps {
  activeProduct: string;
}

const TransactionPanel: React.FC<TransactionPanelProps> = ({ activeProduct }) => {
  const [currency, setCurrency] = useState<string>('USDC');
  const [quantity, setQuantity] = useState<number>(1);
  const [total, setTotal] = useState<number>(20);
  
  const currencies: Currency[] = [
    { code: 'USDC', name: 'USD Coin', icon: '💲' },
    { code: 'ETH', name: 'Ethereum', icon: '⟠' },
    { code: 'BTC', name: 'Bitcoin', icon: '₿' },
  ];
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);
  };
  
  // Update total when quantity changes
  useEffect(() => {
    // In a real app, this would use actual pricing logic
    const basePrice = 20;
    setTotal(basePrice * quantity);
  }, [quantity]);
  
  const handleConnect = () => {
    alert('Connect functionality would be implemented here!');
  };
  
  return (
    <motion.div 
      className="glass-panel p-6 md:p-8 backdrop-blur-lg bg-space-black/40 max-w-md mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <ShoppingCart className="w-6 h-6 text-nixo-green" />
        <h2 className="text-2xl font-display text-white">Purchase {activeProduct}</h2>
      </div>
      
      <div className="space-y-8">
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium text-xl">
            Selling
          </label>
          <div className="select-wrapper relative">
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="select-input w-full p-3 bg-space-black/60 text-white border border-nixo-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nixo-green/50"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-space-black text-white">
                  {c.icon} {c.code} - {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nixo-green w-4 h-4" />
          </div>
          <div className="text-right mt-2">
            <span className="text-3xl font-display font-medium text-white">
              {total.toFixed(2)} <span className="text-nixo-green">{currency}</span>
            </span>
          </div>
        </div>
        
        <div className="mb-8">
          <label className="block text-gray-300 mb-2 font-medium text-xl">
            Quantity
          </label>
          <div className="select-wrapper relative">
            <select 
              value={quantity}
              onChange={handleQuantityChange}
              className="select-input w-full p-3 bg-space-black/60 text-white border border-nixo-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-nixo-green/50"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num} className="bg-space-black text-white">
                  {num} {num === 1 ? 'item' : 'items'}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nixo-green w-4 h-4" />
          </div>
          <div className="text-right mt-2">
            <span className="text-2xl font-display text-gray-300">
              Total: <span className="text-nixo-green">${(quantity * 20.00).toFixed(2)}</span>
            </span>
          </div>
        </div>
        
        <motion.button 
          className="glass-button w-full py-4 text-lg font-display bg-nixo-green/20 border border-nixo-green/50 text-white hover:bg-nixo-green/30 transition-colors rounded-md"
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(60, 205, 58, 0.6)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConnect}
        >
          Connect Wallet
        </motion.button>
        
        <p className="text-gray-400 text-sm text-center mt-4">
          Secure transaction powered by Solana Pay
        </p>
      </div>
    </motion.div>
  );
};

export default TransactionPanel;