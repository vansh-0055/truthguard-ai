import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle, ArrowRight, Activity, Zap, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import NewsTicker from './NewsTicker';
import HowItWorks from './HowItWorks';
import Footer from './Footer';

const Home: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-50">
        <NewsTicker />
      </div>

      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto mb-24"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-Powered Fact Checking v2.0
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-8">
              Truth in the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Age of AI
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Instantly verify news articles using our advanced neural networks.
              We cross-reference with global trusted sources to distinguish fact from fiction.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/check" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-all flex items-center justify-center group overflow-hidden relative">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative flex items-center">
                  Start Fact Checking <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-all flex items-center justify-center border border-slate-700">
                Join Community
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-24 relative z-10">
            {[
              {
                icon: Zap,
                title: "Real-time Analysis",
                desc: "Get results in milliseconds. Our AI processes content instantly to give you immediate credibility scores."
              },
              {
                icon: Globe,
                title: "Global Sources",
                desc: "We verify against a database of 10,000+ trusted global news outlets and government registries."
              },
              {
                icon: Shield,
                title: "Bias Detection",
                desc: "Uncover hidden political bias and emotional manipulation techniques in news articles."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl hover:border-blue-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div id="how-it-works" className="scroll-mt-24">
            <HowItWorks />
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;