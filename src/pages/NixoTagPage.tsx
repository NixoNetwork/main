import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Leaf, QrCode, Shield, Zap } from "lucide-react";
import NixoTag from '../assets/nixo-logo.gif';

const NixoTagPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-[-1]"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/nixo-space.jpg')`,
          backgroundAttachment: "fixed",
          filter: "brightness(0.6) contrast(1.2)",
        }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-8 relative z-10"
      >
        <div className="glass-panel p-8 md:p-12 backdrop-blur-lg bg-space-black/40">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-display text-white mb-4">
              Nixo <span className="text-nixo-green glow-text">Tag</span>
            </h1>
            <p className="text-2xl text-gray-300 max-w-2xl">
              Your Everyday Impact, On-Chain
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Left Column: Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <img
                  src={NixoTag}
                  className="relative w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(60,205,58,0.6)]"
                  alt="Nixo Tag"
                />
              </div>
            </motion.div>

            {/* Right Column: Description */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                The Nixo Tag is more than a reusable bag—it's your personal gateway to a zero-waste, blockchain-verified lifestyle. Crafted from premium cotton and embedded with an NFC chip and QR code, the Nixo Tag lets you avoid plastic while earning real-time digital rewards.
              </p>
              
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="w-6 h-6 text-nixo-green" />
                <Shield className="w-6 h-6 text-nixo-green" />
                <Zap className="w-6 h-6 text-nixo-green" />
              </div>
            </motion.div>
          </div>
          
          {/* How It Works Section */}
          <div className="mt-12 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Leaf className="w-6 h-6 text-nixo-green" />
                <h2 className="text-2xl font-display text-white">
                  How It Works
                </h2>
              </div>
              <div className="pl-9">
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-3 text-xl">
                  <li>Tap or Scan your Nixo Tag at checkout counters in participating stores.</li>
                  <li>Each scan records a verified event on the Solana blockchain—logging time, location, wallet address (if connected), and tag ID.</li>
                  <li className="text-nixo-green">One Scan = One Plastic Bag Avoided</li>
                </ul>
              </div>
            </div>
            
            {/* What You Get Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Leaf className="w-6 h-6 text-nixo-green" />
                <h2 className="text-2xl font-display text-white">
                  What You Get
                </h2>
              </div>
              <div className="pl-9">
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-3 text-xl">
                  <li>Token Rewards in your Nixo Wallet</li>
                  <li>Carbon Credits based on cumulative impact</li>
                  <li>Badges, Ranks & Tiers in the Nixo app</li>
                </ul>
              </div>
            </div>
            
            {/* Why It Matters Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Leaf className="w-6 h-6 text-nixo-green" />
                <h2 className="text-2xl font-display text-white">
                  Why It Matters
                </h2>
              </div>
              <div className="pl-9">
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-3 text-xl">
                  <li>Track your plastic avoidance and CO2 savings</li>
                  <li>Become a part of the world's first DePIN-based sustainability movement</li>
                  <li>Turn daily choices into measurable environmental impact</li>
                </ul>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-8 text-center">
              <p className="text-nixo-green font-display text-2xl">
                <Leaf className="inline w-5 h-5 mr-1" /> One tag. Infinite impact.
              </p>
              <p className="text-white font-display text-xl mt-2">
                Join the movement.
              </p>
              <div className="mt-6">
                <button className="bg-nixo-green hover:bg-nixo-green-light text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-glow-green">
                  Get Your Nixo Tag
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NixoTagPage;