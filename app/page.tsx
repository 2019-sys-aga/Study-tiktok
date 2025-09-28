"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Bot, Share, Bookmark, Home, Search, Plus, Bell, User, Play, Trophy, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StudyTokLogo, LoadingScreen } from "@/components/logo"

const pastProjects = [
  {
    id: 1,
    title: "Calculus Mastery 🧮",
    description: "Master derivatives and integrals with interactive problems",
    thumbnail: "/calculus-equations-and-graphs.jpg",
    progress: 85,
    totalQuestions: 120,
    completedQuestions: 102,
    subject: "Mathematics",
    emoji: "🧮",
    difficulty: "Advanced",
    difficultyEmoji: "🔴",
    likes: 2341,
    timeSpent: "12h 30m",
  },
  {
    id: 2,
    title: "Physics Fundamentals ⚡",
    description: "Explore the laws of motion, energy, and waves",
    thumbnail: "/physics-formulas-and-experiments.jpg",
    progress: 92,
    totalQuestions: 80,
    completedQuestions: 74,
    subject: "Physics",
    emoji: "⚡",
    difficulty: "Medium",
    difficultyEmoji: "🟡",
    likes: 1876,
    timeSpent: "8h 45m",
  },
  {
    id: 3,
    title: "Chemistry Lab 🧪",
    description: "Chemical reactions, periodic table, and molecular structures",
    thumbnail: "/chemistry-lab-equipment-and-molecules.jpg",
    progress: 67,
    totalQuestions: 95,
    completedQuestions: 64,
    subject: "Chemistry",
    emoji: "🧪",
    difficulty: "Medium",
    difficultyEmoji: "🟡",
    likes: 1432,
    timeSpent: "6h 15m",
  },
  {
    id: 4,
    title: "Biology Basics 🧬",
    description: "Cell structure, genetics, and human anatomy",
    thumbnail: "/biology-cells-and-dna-structure.jpg",
    progress: 78,
    totalQuestions: 110,
    completedQuestions: 86,
    subject: "Biology",
    emoji: "🧬",
    difficulty: "Easy",
    difficultyEmoji: "🟢",
    likes: 1987,
    timeSpent: "9h 20m",
  },
]

// Sample study data with emojis
const studyCards = [
  {
    id: 1,
    type: "mcq",
    subject: "Mathematics",
    emoji: "🧮",
    question: "What is the derivative of x²? 📈",
    options: ["2x", "x²", "2", "x"],
    correct: 0,
    explanation: "The derivative of x² is 2x using the power rule! 🎯 This is fundamental calculus! ✨",
    likes: 1247,
    aiHelps: 89,
    difficulty: "Easy",
    difficultyEmoji: "🟢",
  },
  {
    id: 2,
    type: "mcq",
    subject: "Physics",
    emoji: "⚡",
    question: "What is the speed of light in vacuum? 🌟",
    options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"],
    correct: 0,
    explanation:
      "The speed of light in vacuum is approximately 3 × 10⁸ meters per second! 🚀 Nothing can go faster! 💫",
    likes: 892,
    aiHelps: 156,
    difficulty: "Medium",
    difficultyEmoji: "🟡",
  },
  {
    id: 3,
    type: "short",
    subject: "Chemistry",
    emoji: "🧪",
    question: "What is the chemical formula for water? 💧",
    answer: "H2O",
    explanation:
      "Water consists of two hydrogen atoms and one oxygen atom! 💧 The most essential molecule for life! 🌍",
    likes: 2341,
    aiHelps: 203,
    difficulty: "Easy",
    difficultyEmoji: "🟢",
  },
  {
    id: 4,
    type: "mcq",
    subject: "Biology",
    emoji: "🧬",
    question: "Which organelle is known as the powerhouse of the cell? ⚡",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correct: 1,
    explanation:
      "Mitochondria produce ATP, the energy currency of cells! 🔋 They're literally cellular power plants! 💪",
    likes: 1567,
    aiHelps: 134,
    difficulty: "Medium",
    difficultyEmoji: "🟡",
  },
]

function HomePage({ onStartStudying, setCurrentView, selectedSubject, customThumbnail, onUploadThumbnail }: { 
  onStartStudying: () => void; 
  setCurrentView: (view: "home" | "study" | "profile" | "search" | "notifications") => void;
  selectedSubject?: string;
  customThumbnail?: string | null;
  onUploadThumbnail: () => void;
}) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set())
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Set<number>>(new Set())
  const feedRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!feedRef.current || typeof window === 'undefined') return
    const scrollTop = feedRef.current.scrollTop
    const cardHeight = window.innerHeight
    const newIndex = Math.round(scrollTop / cardHeight)
    if (newIndex !== currentProjectIndex && newIndex >= 0 && newIndex < pastProjects.length) {
      setCurrentProjectIndex(newIndex)
    }
  }

  const toggleLike = (projectId: number) => {
    setLikedProjects((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const toggleBookmark = (projectId: number) => {
    setBookmarkedProjects((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const handleShare = async (project: typeof pastProjects[0]) => {
    const shareData = {
      title: project.title,
      text: project.description,
      url: window.location.href,
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${project.title} - ${project.description}`)
      alert('Content copied to clipboard! 📋')
    }
  }

  useEffect(() => {
    const feedElement = feedRef.current
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll)
      return () => feedElement.removeEventListener("scroll", handleScroll)
    }
  }, [currentProjectIndex])

  // Scroll to selected subject when coming from search
  useEffect(() => {
    if (selectedSubject && feedRef.current) {
      const subjectIndex = pastProjects.findIndex(project => project.subject === selectedSubject)
      if (subjectIndex !== -1) {
        setCurrentProjectIndex(subjectIndex)
        setTimeout(() => {
          if (feedRef.current && typeof window !== 'undefined') {
            feedRef.current.scrollTo({
              top: subjectIndex * window.innerHeight,
              behavior: "smooth",
            })
          }
        }, 100)
      }
    }
  }, [selectedSubject])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 glass-effect">
        <div className="flex items-center gap-3">
          <StudyTokLogo size="md" animated={false} />
          <span className="text-xl font-bold">🎓 StudyTok</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-primary font-bold">2,450</span>
            <span className="text-muted-foreground ml-1">XP ⚡</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/20 text-secondary text-sm">
            <span>🔥</span>
            <span>15</span>
          </div>
          <button 
            onClick={onUploadThumbnail}
            className="p-2 rounded-full glass-effect hover:bg-muted/30 transition-colors"
            title="📤 Upload Custom Thumbnail"
          >
            <span className="text-lg">📤</span>
          </button>
          <Search className="w-6 h-6 text-muted-foreground" />
        </div>
      </header>

      {/* Main feed */}
      <div ref={feedRef} className="h-full overflow-y-auto scroll-smooth" style={{ scrollSnapType: "y mandatory" }}>
        {pastProjects.map((project, index) => (
          <div key={project.id} className="h-screen" style={{ scrollSnapAlign: "start" }}>
            <motion.div
              initial={{ y: "6vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.36, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative w-full h-screen flex flex-col justify-center p-4 pb-32"
            >
              {/* Background image with improved contrast */}
              <div className="absolute inset-0">
                <img
                  src={customThumbnail || project.thumbnail || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-30"
                  style={{ filter: 'brightness(0.8) contrast(1.3) saturate(1.2)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
                {/* Subject badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <span className="text-2xl">{project.emoji}</span>
                  <span className="text-sm font-medium text-primary">📚 {project.subject}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                    <span>{project.difficultyEmoji}</span>
                    {project.difficulty}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold text-balance mb-3 leading-tight"
                >
                  {project.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground mb-6 text-balance"
                >
                  {project.description}
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-3 gap-4 mb-6"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{project.progress}%</div>
                    <div className="text-xs text-muted-foreground">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">
                      {project.completedQuestions}/{project.totalQuestions}
                    </div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{project.timeSpent}</div>
                    <div className="text-xs text-muted-foreground">Time Spent</div>
                  </div>
                </motion.div>

                {/* Progress bar */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <Progress value={project.progress} className="h-2 bg-muted/30" />
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3"
                >
                  <Button
                    onClick={onStartStudying}
                    className="flex-1 py-3 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning ✨
                  </Button>
                  <Button variant="outline" className="px-4 py-3 glass-effect bg-transparent">
                    <BookOpen className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        <ActionButton 
          icon={Heart} 
          count={pastProjects[currentProjectIndex]?.likes || 0} 
          active={likedProjects.has(pastProjects[currentProjectIndex]?.id)}
          onClick={() => toggleLike(pastProjects[currentProjectIndex]?.id)}
          emoji="❤️" 
        />
        <ActionButton 
          icon={Trophy} 
          count={pastProjects[currentProjectIndex]?.completedQuestions || 0} 
          emoji="🏆" 
        />
        <ActionButton 
          icon={Share} 
          count={0} 
          onClick={() => handleShare(pastProjects[currentProjectIndex])}
          emoji="📤" 
        />
        <ActionButton 
          icon={Bookmark} 
          count={0} 
          active={bookmarkedProjects.has(pastProjects[currentProjectIndex]?.id)}
          onClick={() => toggleBookmark(pastProjects[currentProjectIndex]?.id)}
          emoji="⭐" 
        />
      </div>

      {/* Progress indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-2">
          {pastProjects.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-colors ${index === currentProjectIndex ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around p-4 glass-effect">
        <button onClick={() => setCurrentView("home")} className="flex flex-col items-center gap-1">
          <Home className="w-6 h-6 text-primary" />
          <span className="text-xs">🏠</span>
        </button>
        <button onClick={() => setCurrentView("search")} className="flex flex-col items-center gap-1">
          <Search className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔍</span>
        </button>
        <button onClick={() => alert('Create new content coming soon! ✨')} className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative">
          <Plus className="w-6 h-6 text-primary-foreground" />
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        </button>
        <button onClick={() => setCurrentView("notifications")} className="flex flex-col items-center gap-1">
          <Bell className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔔</span>
        </button>
        <button onClick={() => setCurrentView("profile")} className="flex flex-col items-center gap-1">
          <User className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">👤</span>
        </button>
      </nav>
    </div>
  )
}

interface StudyCardProps {
  card: (typeof studyCards)[0]
  isActive: boolean
  onAnswer: (correct: boolean) => void
}

function StudyCard({ card, isActive, onAnswer }: StudyCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSubmit = () => {
    if (card.type === "mcq" && selectedAnswer !== null) {
      const correct = selectedAnswer === card.correct
      setIsCorrect(correct)
      setShowResult(true)
      onAnswer(correct)

      if (correct) {
        setTimeout(() => {
          const nextButton = document.querySelector("[data-next-card]") as HTMLElement
          if (nextButton) {
            nextButton.click()
          }
        }, 2500) // Wait for confetti animation
      }
    } else if (card.type === "short" && userAnswer.trim()) {
      const correct = userAnswer.toLowerCase().trim() === card.answer.toLowerCase()
      setIsCorrect(correct)
      setShowResult(true)
      onAnswer(correct)

      if (correct) {
        setTimeout(() => {
          const nextButton = document.querySelector("[data-next-card]") as HTMLElement
          if (nextButton) {
            nextButton.click()
          }
        }, 2500) // Wait for confetti animation
      }
    }
  }

  const reset = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)
    setUserAnswer("")
  }

  useEffect(() => {
    if (isActive) {
      reset()
    }
  }, [isActive])

  return (
    <motion.div
      initial={{ y: "6vh", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.36, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative w-full h-screen flex flex-col justify-center p-4 pb-32"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
        {/* Subject badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-4"
        >
          <span className="text-2xl">{card.emoji}</span>
          <span className="text-sm font-medium text-primary">{card.subject}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
            <span>{card.difficultyEmoji}</span>
            {card.difficulty}
          </span>
        </motion.div>

        {/* Question */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-bold text-balance mb-6 leading-tight"
        >
          {card.question}
        </motion.h1>

        {/* Answer options */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-6"
        >
          {card.type === "mcq" ? (
            card.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full p-3 text-left justify-start text-sm h-auto transition-all duration-200 ${
                  selectedAnswer === index ? "neon-border bg-primary/10" : "hover:bg-muted/50"
                } ${
                  showResult && index === card.correct
                    ? "bg-primary/20 border-primary"
                    : showResult && selectedAnswer === index && index !== card.correct
                      ? "bg-destructive/20 border-destructive shake"
                      : ""
                }`}
                onClick={() => !showResult && setSelectedAnswer(index)}
                disabled={showResult}
              >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-xs font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </Button>
            ))
          ) : (
            <div className="space-y-3">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here... 💭"
                className="w-full p-3 bg-muted/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
                rows={2}
                disabled={showResult}
              />
            </div>
          )}
        </motion.div>

        {!showResult && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <Button
              onClick={handleSubmit}
              disabled={
                (card.type === "mcq" && selectedAnswer === null) || (card.type === "short" && !userAnswer.trim())
              }
              className="w-full py-3 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Check Answer ✨
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 p-4 rounded-xl glass-effect ${isCorrect ? "border-primary" : "border-destructive"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-sm">🎉</span>
                    </div>
                    <span className="text-primary font-semibold text-sm">Awesome! +10 XP 🔥</span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
                      <span className="text-destructive-foreground text-sm">😅</span>
                    </div>
                    <span className="text-destructive font-semibold text-sm">Not quite! Keep trying 💪</span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showResult && isCorrect && isClient && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Main confetti burst */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`main-${i}`}
              initial={{
                y: -50,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                scale: [1, 1.3, 0.7, 1],
                opacity: [1, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute text-2xl"
            >
              {["🎉", "✨", "🔥", "💯", "⭐", "🎊", "💫", "🌟", "🎈", "🎁", "🏆", "💎"][Math.floor(Math.random() * 12)]}
            </motion.div>
          ))}
          
          {/* Secondary sparkle burst */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              initial={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) / 2 + Math.random() * 200 - 100,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                opacity: 0,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) / 2 + (Math.random() - 0.5) * 400,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                rotate: 720 * (Math.random() > 0.5 ? 1 : -1),
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: 0.5 + Math.random() * 1,
                ease: [0.4, 0, 0.6, 1],
              }}
              className="absolute text-xl"
            >
              {["✨", "💫", "⭐", "🌟", "💎"][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
          
          {/* Floating celebration */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`float-${i}`}
              initial={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              animate={{
                y: -100,
                rotate: 180 * (Math.random() > 0.5 ? 1 : -1),
                scale: [1, 1.2, 0.8],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 4,
                delay: 1 + Math.random() * 2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute text-3xl"
            >
              {["🎉", "🎊", "🏆", "💯"][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function SearchPage({ onBack, setCurrentView, onSelectSubject }: { 
  onBack: () => void; 
  setCurrentView: (view: "home" | "study" | "profile" | "search" | "notifications") => void;
  onSelectSubject: (subject: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults] = useState([
    { id: 1, title: "Calculus Derivatives", subject: "Mathematics", difficulty: "Advanced", likes: 1234 },
    { id: 2, title: "Physics Laws of Motion", subject: "Physics", difficulty: "Medium", likes: 856 },
    { id: 3, title: "Chemistry Periodic Table", subject: "Chemistry", difficulty: "Easy", likes: 2103 },
    { id: 4, title: "Biology Cell Structure", subject: "Biology", difficulty: "Medium", likes: 1456 },
  ])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 glass-effect">
        <button onClick={onBack} className="flex items-center gap-3">
          <StudyTokLogo size="md" animated={false} />
          <span className="text-xl font-bold">StudyTok</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-primary font-bold">2,450</span>
            <span className="text-muted-foreground ml-1">XP ⚡</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="h-full overflow-y-auto pt-20 pb-20">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Search Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-2">🔍 Search</h1>
            <p className="text-muted-foreground">Find your perfect study content</p>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search for topics, subjects, or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-lg"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          </motion.div>

          {/* Search Results */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold">📚 Popular Topics</h2>
            {searchResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 rounded-xl glass-effect hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => {
                  onSelectSubject(result.subject)
                  setCurrentView("home")
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{result.title}</h3>
                    <p className="text-muted-foreground">{result.subject} • {result.difficulty}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-bold">{result.likes}</div>
                    <div className="text-xs text-muted-foreground">❤️</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around p-4 glass-effect">
        <button onClick={() => setCurrentView("home")} className="flex flex-col items-center gap-1">
          <Home className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🏠</span>
        </button>
        <button onClick={() => setCurrentView("search")} className="flex flex-col items-center gap-1">
          <Search className="w-6 h-6 text-primary" />
          <span className="text-xs">🔍</span>
        </button>
        <button onClick={() => alert('Create new content coming soon! ✨')} className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative">
          <Plus className="w-6 h-6 text-primary-foreground" />
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        </button>
        <button onClick={() => setCurrentView("notifications")} className="flex flex-col items-center gap-1">
          <Bell className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔔</span>
        </button>
        <button onClick={() => setCurrentView("profile")} className="flex flex-col items-center gap-1">
          <User className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">👤</span>
        </button>
      </nav>
    </div>
  )
}

function NotificationsPage({ onBack, setCurrentView }: { onBack: () => void; setCurrentView: (view: "home" | "study" | "profile" | "search" | "notifications") => void }) {
  const [notifications] = useState([
    { id: 1, title: "🔥 Streak Alert!", message: "You're on a 15-day streak! Keep it up!", time: "2m ago", unread: true },
    { id: 2, title: "🎉 Achievement Unlocked!", message: "Math Wizard - Score 90%+ in Mathematics", time: "1h ago", unread: true },
    { id: 3, title: "📚 New Content Available", message: "Advanced Calculus problems added to your feed", time: "3h ago", unread: false },
    { id: 4, title: "👥 Study Buddy Request", message: "Sarah wants to study Physics with you", time: "1d ago", unread: false },
    { id: 5, title: "🏆 Leaderboard Update", message: "You moved up to #3 in Mathematics!", time: "2d ago", unread: false },
  ])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 glass-effect">
        <button onClick={onBack} className="flex items-center gap-3">
          <StudyTokLogo size="md" animated={false} />
          <span className="text-xl font-bold">StudyTok</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-primary font-bold">2,450</span>
            <span className="text-muted-foreground ml-1">XP ⚡</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="h-full overflow-y-auto pt-20 pb-20">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Notifications Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-2">🔔 Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your progress</p>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-4 rounded-xl glass-effect transition-colors cursor-pointer ${
                  notification.unread ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${notification.unread ? 'bg-primary' : 'bg-muted'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around p-4 glass-effect">
        <button onClick={() => setCurrentView("home")} className="flex flex-col items-center gap-1">
          <Home className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🏠</span>
        </button>
        <button onClick={() => setCurrentView("search")} className="flex flex-col items-center gap-1">
          <Search className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔍</span>
        </button>
        <button onClick={() => alert('Create new content coming soon! ✨')} className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative">
          <Plus className="w-6 h-6 text-primary-foreground" />
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        </button>
        <button onClick={() => setCurrentView("notifications")} className="flex flex-col items-center gap-1">
          <Bell className="w-6 h-6 text-primary" />
          <span className="text-xs">🔔</span>
        </button>
        <button onClick={() => setCurrentView("profile")} className="flex flex-col items-center gap-1">
          <User className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">👤</span>
        </button>
      </nav>
    </div>
  )
}

function ProfilePage({ onBack, setCurrentView }: { onBack: () => void; setCurrentView: (view: "home" | "study" | "profile" | "search" | "notifications") => void }) {
  const [userStats] = useState({
    totalXP: 2450,
    streak: 15,
    level: 8,
    completedProjects: 4,
    totalQuestions: 326,
    correctAnswers: 298,
    accuracy: 91.4,
    studyTime: "36h 50m",
    favoriteSubject: "Mathematics",
    achievements: [
      { name: "First Steps", description: "Complete your first question", icon: "👶", unlocked: true },
      { name: "Streak Master", description: "Maintain a 7-day streak", icon: "🔥", unlocked: true },
      { name: "Math Wizard", description: "Score 90%+ in Mathematics", icon: "🧮", unlocked: true },
      { name: "Speed Demon", description: "Answer 10 questions in under 2 minutes", icon: "⚡", unlocked: false },
      { name: "Perfectionist", description: "Get 100% accuracy in any subject", icon: "💯", unlocked: false },
    ]
  })

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 glass-effect">
        <button onClick={onBack} className="flex items-center gap-3">
          <StudyTokLogo size="md" animated={false} />
          <span className="text-xl font-bold">StudyTok</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-primary font-bold">{userStats.totalXP}</span>
            <span className="text-muted-foreground ml-1">XP ⚡</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/20 text-secondary text-sm">
            <span>🔥</span>
            <span>{userStats.streak}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="h-full overflow-y-auto pt-20 pb-20">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center text-4xl">
              👨‍🎓
            </div>
            <h1 className="text-2xl font-bold mb-2">Study Master</h1>
            <p className="text-muted-foreground">Level {userStats.level} • {userStats.favoriteSubject} Enthusiast</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="p-4 rounded-xl glass-effect text-center">
              <div className="text-2xl font-bold text-primary">{userStats.completedProjects}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="p-4 rounded-xl glass-effect text-center">
              <div className="text-2xl font-bold text-secondary">{userStats.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="p-4 rounded-xl glass-effect text-center">
              <div className="text-2xl font-bold text-primary">{userStats.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="p-4 rounded-xl glass-effect text-center">
              <div className="text-2xl font-bold text-secondary">{userStats.studyTime}</div>
              <div className="text-sm text-muted-foreground">Study Time</div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-bold mb-4">🏆 Achievements</h2>
            <div className="space-y-3">
              {userStats.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center gap-3 ${
                    achievement.unlocked ? 'glass-effect' : 'bg-muted/20 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                  {achievement.unlocked && <span className="text-primary">✓</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around p-4 glass-effect">
        <button onClick={() => setCurrentView("home")} className="flex flex-col items-center gap-1">
          <Home className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🏠</span>
        </button>
        <button onClick={() => alert('Search functionality coming soon! 🔍')} className="flex flex-col items-center gap-1">
          <Search className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔍</span>
        </button>
        <button onClick={() => alert('Create new content coming soon! ✨')} className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative">
          <Plus className="w-6 h-6 text-primary-foreground" />
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        </button>
        <button onClick={() => alert('Notifications coming soon! 🔔')} className="flex flex-col items-center gap-1">
          <Bell className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔔</span>
        </button>
        <button onClick={() => setCurrentView("profile")} className="flex flex-col items-center gap-1">
          <User className="w-6 h-6 text-primary" />
          <span className="text-xs">👤</span>
        </button>
      </nav>
    </div>
  )
}

export default function StudyApp() {
  const [currentView, setCurrentView] = useState<"home" | "study" | "profile" | "search" | "notifications">("home")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [score, setScore] = useState(2450)
  const [streak, setStreak] = useState(15)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set())
  const [aiHelped, setAiHelped] = useState<Set<number>>(new Set())
  const feedRef = useRef<HTMLDivElement>(null)

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore((prev) => prev + 10)
      setStreak((prev) => prev + 1)
    } else {
      setStreak(0)
    }
  }

  const goToNextCard = () => {
    if (currentIndex < studyCards.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      if (feedRef.current) {
        feedRef.current.scrollTo({
          top: nextIndex * (typeof window !== 'undefined' ? window.innerHeight : 800),
          behavior: "smooth",
        })
      }
    }
  }

  const handleScroll = () => {
    if (!feedRef.current || typeof window === 'undefined') return
    const scrollTop = feedRef.current.scrollTop
    const cardHeight = window.innerHeight
    const newIndex = Math.round(scrollTop / cardHeight)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < studyCards.length) {
      setCurrentIndex(newIndex)
    }
  }

  const toggleLike = (cardId: number) => {
    setLiked((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const toggleBookmark = (cardId: number) => {
    setBookmarked((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const toggleAiHelp = (cardId: number) => {
    setAiHelped((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
        console.log("🤖 AI Tutor activated! Getting personalized help...")
      }
      return newSet
    })
  }

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomThumbnail(e.target?.result as string)
        setShowUploadModal(false)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const feedElement = feedRef.current
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll)
      return () => feedElement.removeEventListener("scroll", handleScroll)
    }
  }, [currentIndex])

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Show loading for 3 seconds

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (currentView === "home") {
    return (
      <>
        <HomePage 
          onStartStudying={() => setCurrentView("study")} 
          setCurrentView={setCurrentView} 
          selectedSubject={selectedSubject}
          customThumbnail={customThumbnail}
          onUploadThumbnail={() => setShowUploadModal(true)}
        />
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background rounded-xl p-6 max-w-md mx-4 glass-effect">
              <h3 className="text-xl font-bold mb-4">📤 Upload Custom Thumbnail</h3>
              <p className="text-muted-foreground mb-4">
                Choose a custom image for your study deck background! 🎨
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="w-full p-2 border rounded-lg mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setCustomThumbnail(null)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  if (currentView === "profile") {
    return <ProfilePage onBack={() => setCurrentView("home")} setCurrentView={setCurrentView} />
  }

  if (currentView === "search") {
    return <SearchPage onBack={() => setCurrentView("home")} setCurrentView={setCurrentView} onSelectSubject={setSelectedSubject} />
  }

  if (currentView === "notifications") {
    return <NotificationsPage onBack={() => setCurrentView("home")} setCurrentView={setCurrentView} />
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <button data-next-card onClick={goToNextCard} className="hidden" aria-hidden="true" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 glass-effect">
        <button onClick={() => setCurrentView("home")} className="flex items-center gap-3">
          <StudyTokLogo size="md" animated={false} />
          <span className="text-xl font-bold">StudyTok</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-primary font-bold">{score}</span>
            <span className="text-muted-foreground ml-1">XP ⚡</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/20 text-secondary text-sm">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
          )}
          <Search className="w-6 h-6 text-muted-foreground" />
        </div>
      </header>

      {/* Main feed */}
      <div ref={feedRef} className="h-full overflow-y-auto scroll-smooth" style={{ scrollSnapType: "y mandatory" }}>
        {studyCards.map((card, index) => (
          <div key={card.id} className="h-screen" style={{ scrollSnapAlign: "start" }}>
            <StudyCard card={card} isActive={index === currentIndex} onAnswer={handleAnswer} />
          </div>
        ))}
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        <ActionButton
          icon={Heart}
          count={studyCards[currentIndex]?.likes || 0}
          active={liked.has(studyCards[currentIndex]?.id)}
          onClick={() => toggleLike(studyCards[currentIndex]?.id)}
          emoji="❤️"
        />
        <ActionButton
          icon={Bot}
          count={studyCards[currentIndex]?.aiHelps || 0}
          active={aiHelped.has(studyCards[currentIndex]?.id)}
          onClick={() => toggleAiHelp(studyCards[currentIndex]?.id)}
          emoji="🤖"
        />
        <ActionButton icon={Share} count={0} emoji="📤" />
        <ActionButton
          icon={Bookmark}
          count={0}
          active={bookmarked.has(studyCards[currentIndex]?.id)}
          onClick={() => toggleBookmark(studyCards[currentIndex]?.id)}
          emoji="⭐"
        />
      </div>

      {/* Progress indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-2">
          {studyCards.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around p-4 glass-effect">
        <button onClick={() => setCurrentView("home")} className="flex flex-col items-center gap-1">
          <Home className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🏠</span>
        </button>
        <button onClick={() => setCurrentView("search")} className="flex flex-col items-center gap-1">
          <Search className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔍</span>
        </button>
        <button onClick={() => alert('Create new content coming soon! ✨')} className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative">
          <Plus className="w-6 h-6 text-primary-foreground" />
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        </button>
        <button onClick={() => setCurrentView("notifications")} className="flex flex-col items-center gap-1">
          <Bell className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔔</span>
        </button>
        <button onClick={() => setCurrentView("profile")} className="flex flex-col items-center gap-1">
          <User className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">👤</span>
        </button>
      </nav>

      {/* Progress bar */}
      <div className="absolute bottom-20 left-4 right-4 z-40">
        <Progress value={((currentIndex + 1) / studyCards.length) * 100} className="h-1 bg-muted/30" />
      </div>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  count,
  active = false,
  onClick,
  emoji,
}: {
  icon: any
  count: number
  active?: boolean
  onClick?: () => void
  emoji?: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-full transition-colors ${
        active ? "text-secondary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center glass-effect ${
          active ? "bg-secondary/20 border-secondary" : "hover:bg-muted/20"
        }`}
      >
        {active && emoji ? <span className="text-xl">{emoji}</span> : <Icon className="w-6 h-6" />}
      </div>
      <span className="text-xs font-medium">{count > 999 ? `${(count / 1000).toFixed(1)}k` : count}</span>
    </motion.button>
  )
}
