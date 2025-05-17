import React from "react";
import { motion } from "framer-motion";
import { Network, Leaf, LineChart, Globe, Diamond, PieChart, Laptop } from "lucide-react";

const NixoClusterPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-[-1]"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/nixo-space.jpg')`,
          backgroundAttachment: "fixed",
          filter: "brightness(0.3) contrast(1.2)",
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
              Nixo <span className="text-nixo-green glow-text">Cluster</span>
            </h1>
            <p className="text-2xl text-gray-300 max-w-2xl">
              Scale Sustainability. Multiply Rewards.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Left Column: Visual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* Create a network/cluster visualization */}
                <div className="absolute inset-0 rounded-full bg-nixo-green/10 animate-pulse"></div>
                
                {/* Center node */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-nixo-green/20 flex items-center justify-center">
                  <Globe className="w-12 h-12 text-nixo-green" />
                </div>
                
                {/* Satellite nodes with connection lines */}
                {[0, 60, 120, 180, 240, 300].map((angle, index) => {
                  const x = Math.cos((angle * Math.PI) / 180) * 90;
                  const y = Math.sin((angle * Math.PI) / 180) * 90;
                  return (
                    <React.Fragment key={index}>
                      <div 
                        className="absolute w-6 h-6 rounded-full bg-nixo-green/30 flex items-center justify-center"
                        style={{ 
                          top: `calc(50% + ${y}px - 12px)`, 
                          left: `calc(50% + ${x}px - 12px)`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      >
                        <Network className="w-3 h-3 text-nixo-green" />
                      </div>
                      {/* Connection line */}
                      <div 
                        className="absolute w-1 bg-nixo-green/30"
                        style={{ 
                          top: '50%',
                          left: '50%',
                          height: '2px',
                          transformOrigin: '0 0',
                          transform: `rotate(${angle}deg)`,
                          width: '90px'
                        }}
                      ></div>
                    </React.Fragment>
                  );
                })}

                <div className="absolute inset-0 rounded-full border-2 border-nixo-green/20"></div>
              </div>
            </motion.div>

            {/* Right Column: Description */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                The Nixo Cluster is the enterprise-level path to massive environmental and financial impact. 
                With control over 10,000 Nixo Tags, Clusters are designed for visionary investors, eco-partners, 
                and corporate ESG champions.
              </p>
              
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-6 h-6 text-nixo-green" />
                <Diamond className="w-6 h-6 text-nixo-green" />
                <PieChart className="w-6 h-6 text-nixo-green" />
              </div>
            </motion.div>
          </div>
          
          {/* Cluster Highlights Section */}
          <div className="mt-12 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Leaf className="w-6 h-6 text-nixo-green" />
                <h2 className="text-2xl font-display text-white">
                  Cluster Highlights
                </h2>
              </div>
              <div className="pl-9">
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-3 text-xl">
                  <li>Price: <span className="text-nixo-green font-bold">$10,000</span></li>
                  <li>Airdrop 1,000 Nixo Tags to users</li>
                  <li>Earn 30% reward share from all 10,000 tag scans within your cluster</li>
                  <li>Enable custom branding, AR/XR campaigns, and sponsorships</li>
                </ul>
              </div>
            </div>
            
            {/* Who It's For Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Leaf className="w-6 h-6 text-nixo-green" />
                <h2 className="text-2xl font-display text-white">
                  Who It's For
                </h2>
              </div>
              <div className="pl-9">
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-3 text-xl">
                  <li>Corporate sustainability programs</li>
                  <li>Climate-tech investors</li>
                  <li>Eco-conscious communities and retail partners</li>
                </ul>
              </div>
            </div>
            
            {/* Strategic Edge Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Globe className="w-6 h-6 text-nixo-green" />
                <h2 className="text-2xl font-display text-white">
                  Strategic Edge
                </h2>
              </div>
              <div className="pl-9 glass-panel p-6 bg-space-black/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-nixo-green text-xl mb-2">Regional Leadership</h3>
                    <p className="text-gray-300">Lead regional or thematic initiatives (e.g., university programs, city clean-ups)</p>
                  </div>
                  <div>
                    <h3 className="text-nixo-green text-xl mb-2">Infrastructure Footprint</h3>
                    <p className="text-gray-300">Build a decentralized physical infrastructure footprint</p>
                  </div>
                  <div>
                    <h3 className="text-nixo-green text-xl mb-2">Dual Revenue Streams</h3>
                    <p className="text-gray-300">Monetize both plastic avoidance and ad-tech integrations</p>
                  </div>
                  <div>
                    <h3 className="text-nixo-green text-xl mb-2">ESG Reporting</h3>
                    <p className="text-gray-300">Access comprehensive analytics for corporate sustainability reports</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real-world Impact Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Laptop className="w-6 h-6 text-nixo-green" />
                <h2 className="text-2xl font-display text-white">
                  Real-world Impact
                </h2>
              </div>
              <div className="pl-9">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="glass-panel p-4">
                    <div className="text-nixo-green text-4xl font-bold">10K+</div>
                    <div className="text-gray-300">Tags in network</div>
                  </div>
                  <div className="glass-panel p-4">
                    <div className="text-nixo-green text-4xl font-bold">30%</div>
                    <div className="text-gray-300">Reward share</div>
                  </div>
                  <div className="glass-panel p-4">
                    <div className="text-nixo-green text-4xl font-bold">3.65M</div>
                    <div className="text-gray-300">Annual plastic bags saved</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-8 text-center">
              <p className="text-nixo-green font-display text-2xl">
                <Leaf className="inline w-5 h-5 mr-1" /> Power the planet. Profit from purpose.
              </p>
              <p className="text-white font-display text-xl mt-2">
                Launch your Nixo Cluster today.
              </p>
              <div className="mt-6">
                <button className="bg-nixo-green hover:bg-nixo-green-light text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-glow-green">
                  Start Your Cluster
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NixoClusterPage;