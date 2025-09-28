"use client"

import { motion } from "framer-motion"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  className?: string
}

export function StudyTokLogo({ size = "md", animated = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  }

  const noteSizeClasses = {
    sm: "w-4 h-6",
    md: "w-6 h-8",
    lg: "w-8 h-12", 
    xl: "w-12 h-16"
  }

  const squareSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-black flex items-center justify-center relative overflow-hidden ${className}`}
      initial={animated ? { scale: 0, rotate: -180 } : {}}
      animate={animated ? { scale: 1, rotate: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-blue-500 to-pink-500 opacity-90" />
      
      {/* Musical Note */}
      <motion.div
        className={`${noteSizeClasses[size]} relative z-10`}
        initial={animated ? { x: -20, opacity: 0 } : {}}
        animate={animated ? { 
          x: 0, 
          opacity: 1,
          y: [0, -1.5, 0],
        } : {}}
        transition={{ 
          delay: 0.3, 
          duration: 0.8,
          ease: "easeOut",
          y: {
            duration: 2.5,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1]
          }
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
        >
          {/* Note stem */}
          <motion.path
            d="M10 2v14"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={animated ? { pathLength: 0 } : {}}
            animate={animated ? { pathLength: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          {/* Note head (oval) */}
          <motion.ellipse
            cx="10"
            cy="16"
            rx="3.5"
            ry="2.5"
            fill="white"
            initial={animated ? { scale: 0 } : {}}
            animate={animated ? { scale: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.4 }}
          />
          {/* Note flag (curved) */}
          <motion.path
            d="M10 2c5 0 7 3 7 6s-2 6-7 6"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={animated ? { pathLength: 0 } : {}}
            animate={animated ? { 
              pathLength: 1,
              rotate: [0, 1.5, 0]
            } : {}}
            transition={{ 
              delay: 0.9, 
              duration: 0.8,
              ease: "easeOut",
              rotate: {
                duration: 3.5,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1]
              }
            }}
          />
          {/* Flag detail line */}
          <motion.path
            d="M10 2c3 0 5 2 5 4s-2 4-5 4"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            initial={animated ? { pathLength: 0 } : {}}
            animate={animated ? { pathLength: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.4 }}
          />
        </svg>
      </motion.div>

      {/* Square */}
      <motion.div
        className={`${squareSizeClasses[size]} relative z-10`}
        initial={animated ? { x: 20, opacity: 0, rotate: 45 } : {}}
        animate={animated ? { x: 0, opacity: 1, rotate: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="w-full h-full border-2 border-white rounded-lg" />
      </motion.div>

      {/* Pulse Effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/20"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0, 0.2],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
          }}
        />
      )}
    </motion.div>
  )
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.6, 1] }}
          className="mb-8"
        >
          <StudyTokLogo size="xl" animated={true} />
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-4xl font-bold text-white mb-2"
        >
          StudyTok
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg text-gray-300 mb-8"
        >
          Learn. Share. Grow.
        </motion.p>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-teal-400 to-pink-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: [0.4, 0, 0.6, 1],
              }}
            />
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-sm text-gray-400 mt-4"
        >
          Preparing your learning experience...
        </motion.p>
      </div>
    </div>
  )
}
