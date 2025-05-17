import React from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Shield,
  Coins,
  Network,
  Building2,
  Leaf,
} from "lucide-react";

const HowItWorksPage: React.FC = () => {
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
              How <span className="text-nixo-green glow-text">Nixo</span> Works
            </h1>
            <p className="text-2xl text-gray-300 max-w-2xl">
              Discover how we're revolutionizing sustainability through
              blockchain technology
            </p>
          </motion.div>

          <div className="mt-12">
            <h2 className="text-3xl md:text-3xl font-display text-nixo-green mb-6">
              Turning Everyday Actions into Blockchain-Powered Impact
            </h2>

            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Nixo Network transforms the simple act of avoiding a plastic bag
              into a measurable, blockchain-verified environmental
              contribution—tracked, rewarded, and scaled through Nixo Tags,
              Nodes, and Clusters.
            </p>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-2xl font-display text-white">
                    Step 1: Get Your Nixo Tag
                  </h2>
                </div>
                <div className="pl-9">
                  <p className="text-xl text-gray-300 leading-relaxed mb-4 text-xl">
                    Purchase your Nixo DePIN Tag—a premium, cotton,
                    multi-compartment reusable bag embedded with an NFC chip and
                    QR code. The Nixo Tag acts as a smart node in our
                    decentralized physical infrastructure, tracking your
                    plastic-free actions and unlocking rewards.
                  </p>
                  <p className="text-nixo-green text-xl">
                    <Leaf className="inline w-5 h-5 mr-1" /> Each tag is your personal gateway to zero waste and on-chain rewards.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-2xl font-display text-white">
                    Step 2: Tap or Scan Your Nixo Tag
                  </h2>
                </div>
                <div className="pl-9">
                  <p className="text-gray-300 leading-relaxed mb-4 text-xl">
                    At checkout counters in participating stores, tap the NFC
                    chip or scan the QR code on your Nixo Tag using a smartphone
                    or a store terminal. Each scan creates a verified on-chain
                    transaction on the Solana blockchain, logging:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 text-xl">
                    <li>Timestamp</li>
                    <li>Location</li>
                    <li>Wallet address (if connected)</li>
                    <li>Unique Nixo Tag ID</li>
                  </ul>
                  <p className="text-nixo-green text-xl">
                    <Leaf className="inline w-5 h-5 mr-1" /> One scan = One plastic bag avoided
                    <br />
                    Transparent, immutable, and secure.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-2xl font-display text-white">
                    Step 3: Earn Rewards & Carbon Credits
                  </h2>
                </div>
                <div className="pl-9">
                  <p className="text-gray-300 leading-relaxed mb-4 text-xl">
                    Each verified tap with your Nixo Tag rewards you:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 text-xl">
                    <li>Token rewards added to your Nixo wallet</li>
                    <li>
                      Badges, tiers, and milestones within the Nixo app
                      ecosystem
                    </li>
                  </ul>
                  <p className="text-gray-300 mb-4">Track your:</p>
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 text-xl">
                    <li>Cumulative bags avoided</li>
                    <li>Carbon impact</li>
                    <li>Earnings, rank, and more</li>
                  </ul>
                  <p className="text-nixo-green text-xl">
                    <Leaf className="inline w-5 h-5 mr-1" /> Save the planet while growing your digital impact profile.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-2xl font-display text-white">
                    Step 4: Scale Your Role — Become a Node or Cluster Owner
                  </h2>
                </div>
                <div className="pl-9">
                  <p className="text-gray-300 leading-relaxed mb-4 text-xl">
                    Go beyond personal impact by joining the network's backbone.
                  </p>

                  <div className="space-y-6">
                    <div className="glass-panel p-6">
                      <h3 className="text-2xl font-display text-nixo-green mb-3">
                        <Leaf className="inline w-6 h-6 mr-1" /> Nixo Node
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2 text-xl">
                        <li>Nixo Node Price: $1,000</li>
                        <li>Earn 10% reward share from 1,000 Nixo Tags</li>
                        <li>Generate passive income from verified scans</li>
                      </ul>
                    </div>

                    <div className="glass-panel p-6">
                      <h3 className="text-2xl font-display text-nixo-green mb-3">
                        <Leaf className="inline w-6 h-6 mr-1" /> Nixo Cluster
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2 text-xl">
                        <li>Nixo Cluster: $10,000</li>
                        <li>Airdrop 1,000 Nixo Tags to users</li>
                        <li>Earn from 10,000 Nixo Tags</li>
                        <li>
                          Get 30% reward share from all scans within your
                          cluster
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-nixo-green mt-4 text-xl">
                    <Leaf className="inline w-5 h-5 mr-1" /> Nodes and Clusters allow early supporters to fund impact at
                    scale and share in the value created by the network.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-2xl font-display text-white">
                    Step 5: Brands, Retailers & Web3 Events Integrate Nixo Tags
                  </h2>
                </div>
                <div className="pl-9">
                  <p className="text-gray-300 leading-relaxed mb-4 text-xl">
                    Nixo Tags unlock sustainable ad-tech and corporate ESG
                    impact:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 text-xl">
                    <li>
                      Retail chains integrate scanning in-store (Walmart,
                      Target, Dmart, Reliance)
                    </li>
                    <li>Blockchain events replace merchandise with Nixo Tags</li>
                    <li>
                      Brands sponsor AR/XR ads, QR-linked promotions, and
                      interactive experiences
                    </li>
                  </ul>
                  <p className="text-nixo-green text-xl">
                    <Leaf className="inline w-5 h-5 mr-1" /> Every scan becomes a digital billboard
                    <br />
                    Each tag drives awareness, rewards, and carbon reduction
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-2xl font-display text-white">
                    From Plastic Collection to Carbon Rewards
                  </h2>
                </div>
                <div className="pl-9">
                  <p className="text-gray-300 leading-relaxed mb-4 text-xl">
                    Nixo is pioneering a carbon credits ecosystem by
                    transforming plastic waste into measurable environmental
                    impact. Here's how we'll collect plastic and earn carbon
                    certificates:
                  </p>
                  
                  <h3 className="text-xl font-display text-nixo-green mb-2">
                    <Leaf className="inline w-5 h-5 mr-1" /> Plastic Deposit Vending Machines
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-3 text-xl">
                    Install machines in high-traffic areas (malls, universities, transit hubs) to collect plastic bags, enabling users to deposit and earn rewards.
                  </p>
                  
                  <h3 className="text-xl font-display text-nixo-green mb-2">
                    <Leaf className="inline w-5 h-5 mr-1" /> Corporate Office Collections
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-3 text-xl">
                    Partner with corporations to collect plastic waste from offices, integrating Nixo DePIN bags into employee sustainability programs.
                  </p>
                  
                  <h3 className="text-xl font-display text-nixo-green mb-2">
                    <Leaf className="inline w-5 h-5 mr-1" /> Plastic Collecting Firms
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-3 text-xl">
                    Collaborate with recycling firms to aggregate plastic waste at scale, ensuring proper sorting and processing for carbon credit certification.
                  </p>
                  
                  <h3 className="text-xl font-display text-nixo-green mb-2">
                    <Leaf className="inline w-5 h-5 mr-1" /> NGO Partnerships for Cleanups
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-3 text-xl">
                    Team up with NGOs to conduct large-scale plastic cleanup initiatives in polluted areas (e.g., beaches, urban zones), driving community impact.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-2xl font-display text-white">
                    Carbon Credits to Rewards:
                  </h2>
                </div>
                <div className="pl-9">
                  <p className="text-gray-300 leading-relaxed mb-4 text-xl">
                    Collected plastic is converted into carbon certificates
                    through verified standards (e.g., Verra, Gold Standard),
                    with 1 ton of plastic avoided equating to 1.5 tons of CO2
                    reduced (based on industry estimates). Certificates are
                    tokenized as carbon credits/footprints on Solana,
                    distributed as rewards points to Nixo Node, Cluster, and Tag
                    owners, incentivizing participation in the zero-waste
                    movement.
                  </p>
                </div>
              </div>
              {/* Powered by Solana Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-2xl font-display text-white">
                    Powered by Solana. Built for the Planet.
                  </h2>
                </div>
                <div className="pl-9">
                  <p className="text-gray-300 leading-relaxed mb-4 text-xl">
                    All Nixo Tag scans are verified on Solana, ensuring:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 text-xl">
                    <li>High-speed, low-cost transactions</li>
                    <li>Transparent impact tracking</li>
                    <li>Energy-efficient data processing</li>
                  </ul>

                  <div className="mt-8 text-center">
                    <h3 className="text-xl font-display text-nixo-green mb-4">
                      <Leaf className="inline w-5 h-5 mr-1" /> Your Nixo Tag. Your Impact. On-Chain.
                    </h3>
                    <p className="text-gray-300 mb-6">
                      The Nixo Tag is more than a reusable bag—it's a personal
                      node in a global movement toward zero plastic and zero
                      carbon.
                    </p>
                    <p className="text-nixo-green font-display text-xl">
                      <Leaf className="inline w-5 h-5 mr-1" /> Tap in today.
                      <br />
                      One tag. Infinite impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HowItWorksPage;
