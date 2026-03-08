import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHeartbeat, FaShieldAlt, FaUserMd } from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';

const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <FaHeartbeat className="text-4xl text-red-500" />,
      title: "Suivi médical 24/7",
      description: "Accédez à vos données médicales à tout moment"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-500" />,
      title: "Sécurité maximale",
      description: "Vos données sont chiffrées et protégées"
    },
    {
      icon: <FaUserMd className="text-4xl text-green-500" />,
      title: "Professionnels de santé",
      description: "Connectez-vous avec vos médecins facilement"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              background: `radial-gradient(circle, rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.1) 0%, transparent 70%)`
            }}
          />
        ))}
      </div>

      {/* Fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient opacity-90" />
      
      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center text-white mb-16"
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-extrabold mb-6"
            initial={{ scale: 0.5 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Votre Santé,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Notre Priorité
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-10 text-white text-opacity-90"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Gérez votre carnet de santé électronique en toute simplicité
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button className="btn-primary group">
              <span className="relative z-10">Commencer maintenant</span>
              <motion.span
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </button>
            <button className="relative overflow-hidden bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              Voir la démo
            </button>
          </motion.div>
        </motion.div>

        {/* Cartes de fonctionnalités */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <Tilt key={index} tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1}>
              <motion.div
                className="glass-card p-8 text-center hover:bg-white hover:bg-opacity-30 transition-all duration-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="flex justify-center mb-4"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white text-opacity-80">{feature.description}</p>
              </motion.div>
            </Tilt>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;