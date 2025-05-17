import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Building, Briefcase, LifeBuoy, Twitter, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
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
              Contact <span className="text-nixo-green glow-text">Nixo</span>
            </h1>
            <p className="text-2xl text-gray-300 max-w-2xl">
              Let's Build a Zero-Waste Future Together
            </p>
          </motion.div>
          
          <div className="mt-12 space-y-8">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Whether you're a user, investor, retailer, brand partner, or simply passionate about sustainability and innovation, we'd love to hear from you.
              Nixo Network is more than a platform—it's a movement. Let's connect and make an impact, one Nixo Tag at a time.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* General Inquiries */}
              <div className="glass-panel p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-xl font-display text-white">General Inquiries</h2>
                </div>
                <p className="text-gray-300 text-lg">
                  For all general questions, suggestions, or feedback:
                </p>
                <a href="mailto:hello@nixo.network" className="text-nixo-green hover:text-nixo-green-light transition-colors flex items-center space-x-2">
                  <span className='text-lg'>📧</span>
                  <span className='text-lg'>hello@nixo.network</span>
                </a>
              </div>

              {/* Partnerships */}
              <div className="glass-panel p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Building className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-xl font-display text-white">Partnerships</h2>
                </div>
                <p className="text-gray-300 text-lg">
                  Are you a retailer, sustainability advocate, or Web3 community leader looking to integrate Nixo Tags into your network?
                </p>
                <a href="mailto:partners@nixo.network" className="text-nixo-green hover:text-nixo-green-light transition-colors flex items-center space-x-2">
                  <span className='text-lg'>📧</span>
                  <span className='text-lg'>partners@nixo.network</span>
                </a>
              </div>

              {/* Investor Relations */}
              <div className="glass-panel p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-xl font-display text-white">Investor Relations</h2>
                </div>
                <p className="text-gray-300 text-lg">
                  Interested in becoming part of our DePIN funding ecosystem—via Nixo Nodes or Nixo Clusters?
                </p>
                <a href="mailto:invest@nixo.network" className="text-nixo-green hover:text-nixo-green-light transition-colors flex items-center space-x-2">
                  <span className='text-lg'>📧</span>
                  <span className='text-lg'>invest@nixo.network</span>
                </a>
              </div>

              {/* Tech Support */}
              <div className="glass-panel p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <LifeBuoy className="w-6 h-6 text-nixo-green" />
                  <h2 className="text-xl font-display text-white">Tech Support</h2>
                </div>
                <p className="text-gray-300 text-lg">
                  Need help with your Nixo Tag, app, or reward tracking? Our support team is here to assist.
                </p>
                <a href="mailto:support@nixo.network" className="text-nixo-green hover:text-nixo-green-light transition-colors flex items-center space-x-2">
                  <span className='text-lg'>📧</span>
                  <span className='text-lg'>support@nixo.network</span>
                </a>
              </div>
            </div>

            {/* Social & Location */}
            <div className="mt-12 space-y-8">
              <div className="glass-panel p-6">
                <h2 className="text-xl font-display text-white mb-4 flex items-center space-x-3">
                  <Send className="w-6 h-6 text-nixo-green" />
                  <span className='text-lg'>Follow Us</span>
                </h2>
                <p className="text-gray-300 mb-4">
                  Stay updated on product drops, impact stats, and our roadmap to 1 billion users:
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-nixo-green hover:text-nixo-green-light transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-nixo-green hover:text-nixo-green-light transition-colors">
                    <Send className="w-6 h-6" />
                  </a>
                </div>
              </div>

              <div className="glass-panel p-6">
                <h2 className="text-xl font-display text-white mb-4 flex items-center space-x-3">
                  <Building className="w-6 h-6 text-nixo-green" />
                  <span className='text-lg'>Location (HQ)</span>
                </h2>
                <p className="text-gray-300 text-lg">
                  Nixo Labs, Earth 2050<br />
                  Decentralized. Distributed. Designed for the planet.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-xl text-gray-300 italic">
                Together, we're not just reducing plastic. We're reshaping the way the world thinks about sustainability.
              </p>
              <p className="text-2xl text-nixo-green font-display mt-4">
                Let's talk. Let's build. Let's tap in.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;