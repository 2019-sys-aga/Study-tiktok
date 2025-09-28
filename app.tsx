"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Bot, Share, Bookmark, Home, Search, Plus, Bell, User, Play, Trophy, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

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

function HomePage({ onStartStudying }: { onStartStudying: () => void }) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!feedRef.current) return
    const scrollTop = feedRef.current.scrollTop
    const cardHeight = window.innerHeight
    const newIndex = Math.round(scrollTop / cardHeight)
    if (newIndex !== currentProjectIndex && newIndex >= 0 && newIndex < pastProjects.length) {
      setCurrentProjectIndex(newIndex)
    }
  }

  useEffect(() => {
    const feedElement = feedRef.current
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll)
      return () => feedElement.removeEventListener("scroll", handleScroll)
    }
  }, [currentProjectIndex])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 glass-effect">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-bold">StudyTok</span>
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
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={project.thumbnail || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
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
                  <span className="text-sm font-medium text-primary">{project.subject}</span>
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
        <ActionButton icon={Heart} count={pastProjects[currentProjectIndex]?.likes || 0} emoji="❤️" />
        <ActionButton icon={Trophy} count={pastProjects[currentProjectIndex]?.completedQuestions || 0} emoji="🏆" />
        <ActionButton icon={Share} count={0} emoji="📤" />
        <ActionButton icon={Bookmark} count={0} emoji="⭐" />
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
        <div className="flex flex-col items-center gap-1">
          <Home className="w-6 h-6 text-primary" />
          <span className="text-xs">🏠</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Search className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔍</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative">
          <Plus className="w-6 h-6 text-primary-foreground" />
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Bell className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔔</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <User className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">👤</span>
        </div>
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
  const [userAnswer, setUserAnswer] = useState("")

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

      {showResult && isCorrect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -50,
                x: Math.random() * window.innerWidth,
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                scale: [1, 1.2, 0.8, 1],
                opacity: [1, 1, 1, 0],
              }}
              transition={{
                duration: 2.5,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
              className="absolute text-2xl"
            >
              {["🎉", "✨", "🔥", "💯", "⭐", "🎊", "💫", "🌟"][Math.floor(Math.random() * 8)]}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function StudyApp() {
  const [currentView, setCurrentView] = useState<"home" | "study">("home")
  const [currentIndex, setCurrentIndex] = useState(0)
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
          top: nextIndex * window.innerHeight,
          behavior: "smooth",
        })
      }
    }
  }

  const handleScroll = () => {
    if (!feedRef.current) return
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

  useEffect(() => {
    const feedElement = feedRef.current
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll)
      return () => feedElement.removeEventListener("scroll", handleScroll)
    }
  }, [currentIndex])

  if (currentView === "home") {
    return <HomePage onStartStudying={() => setCurrentView("study")} />
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <button data-next-card onClick={goToNextCard} className="hidden" aria-hidden="true" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 glass-effect">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView("home")} className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold">StudyTok</span>
          </button>
        </div>
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
        <div className="flex flex-col items-center gap-1">
          <Search className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔍</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative">
          <Plus className="w-6 h-6 text-primary-foreground" />
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Bell className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">🔔</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <User className="w-6 h-6 text-muted-foreground" />
          <span className="text-xs">👤</span>
        </div>
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
