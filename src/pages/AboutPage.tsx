import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-display text-white mb-4">
              About <span className="text-nixo-green glow-text">Nixo</span>
            </h1>
          </motion.div>
          
          <div className="mt-12 space-y-8">
            <p className="text-3xl font-display text-nixo-green mb-6">
              At Nixo Network, we're redefining sustainability through technology.
            </p>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              We are the creators of the world's first blockchain-powered DePIN bag—a reusable, eco-friendly alternative to single-use plastic bags, integrated with cutting-edge NFC tags and QR codes for transparent, on-chain tracking and rewards.
            </p>
            
            <div className="space-y-6">
              <p className="text-xl text-gray-300 leading-relaxed">
                Our mission is simple but bold, to eliminate plastic waste by incentivizing sustainable behavior. Every Nixo Tag becomes a digital asset that contributes to the environment and rewards the user. Powered by the Solana blockchain, our platform tracks plastic avoidance, enables real-time carbon credit calculation, and builds a community that is rewarded for choosing sustainability.
              </p>
              
              <p className="text-2xl font-display text-nixo-green">
                But we're more than a product—we're a movement.
              </p>
            </div>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              Through partnerships with global retailers, crypto communities, and corporations, Nixo is building a decentralized physical infrastructure network (DePIN) that turns everyday actions into meaningful environmental impact. From tokenized ad revenues and AR/XR experiences to AI-powered games, we are creating an ecosystem where every interaction fuels growth, transparency, and responsibility.
            </p>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              Nixo Network invites you to be a part of the future where sustainability meets innovation.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;