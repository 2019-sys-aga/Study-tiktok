"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, File, Image, X, Sparkles, BookOpen, Brain, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface ImportComponentProps {
  onClose: () => void
  onImportComplete: (deckData: any) => void
}

type ImportTab = "paste" | "upload" | "drive"

export default function ImportComponent({ onClose, onImportComplete }: ImportComponentProps) {
  const [activeTab, setActiveTab] = useState<ImportTab>("paste")
  const [pastedText, setPastedText] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    )
    
    setUploadedFiles(prev => [...prev, ...validFiles.slice(0, 2 - prev.length)])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(prev => [...prev, ...files.slice(0, 2 - prev.length)])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const processContent = async () => {
    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      let content = ""
      let contentType = "text"
      let title = "Imported Study Guide 📚"

      // Handle different content types
      if (activeTab === "paste") {
        content = pastedText
        contentType = "text"
        title = "Imported Study Guide 📚"
      } else if (activeTab === "upload" && uploadedFiles.length > 0) {
        setProcessingProgress(20)
        
        // First extract text from uploaded files
        const file = uploadedFiles[0]
        const extractFormData = new FormData()
        extractFormData.append('file', file)
        
        const extractResponse = await fetch('/api/extract-pdf', {
          method: 'POST',
          body: extractFormData
        })
        
        if (!extractResponse.ok) {
          throw new Error('Failed to extract text from file')
        }
        
        const extractData = await extractResponse.json()
        content = extractData.extractedText
        contentType = file.type === 'application/pdf' ? 'pdf' : 
                     file.type.includes('word') ? 'docx' : 'pptx'
        title = `${file.name.split('.')[0]} Study Guide 📚`
      } else {
        throw new Error('No content to process')
      }

      setProcessingProgress(40)

      // Process content with AI
      const processFormData = new FormData()
      processFormData.append('content', content)
      processFormData.append('type', contentType)
      processFormData.append('title', title)

      const processResponse = await fetch('/api/process-content', {
        method: 'POST',
        body: processFormData
      })

      if (!processResponse.ok) {
        throw new Error('Failed to process content with AI')
      }

      setProcessingProgress(80)

      const processData = await processResponse.json()
      
      setProcessingProgress(100)

      // Format the response for the UI
      const generatedDeck = {
        title: processData.deck.title,
        subject: processData.deck.subject,
        description: processData.deck.description,
        totalCards: processData.deck.totalCards,
        summary: processData.deck.summary,
        topics: processData.deck.topics,
        estimatedStudyTime: processData.deck.estimatedStudyTime
      }

      setGeneratedContent(generatedDeck)
    } catch (error) {
      console.error("Processing error:", error)
      alert("Failed to process content. Please try again. 😅")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateDeck = () => {
    if (generatedContent) {
      onImportComplete(generatedContent)
      onClose()
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return "📄"
    if (file.type.includes('word')) return "📝"
    if (file.type.includes('presentation')) return "📊"
    return "📁"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.3 
        }}
        className="bg-background rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto glass-effect border shadow-2xl text-white"
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              📚 Generate Study Guides
            </motion.h1>
          </div>
          <motion.button
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/50 transition-all duration-200 hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1 mb-6 p-1 bg-muted/30 rounded-xl"
        >
          {[
            { id: "paste" as ImportTab, label: "Paste text", icon: "📝", emoji: "✂️" },
            { id: "upload" as ImportTab, label: "Upload files", icon: "📤", emoji: "📁" },
            { id: "drive" as ImportTab, label: "Google Drive", icon: "☁️", emoji: "🔗" }
          ].map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "hover:bg-muted/50 hover:scale-105"
              }`}
              whileHover={{ scale: activeTab === tab.id ? 1.05 : 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span 
                className="text-lg"
                animate={{ rotate: activeTab === tab.id ? [0, 10, -10, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                {tab.emoji}
              </motion.span>
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <div className="space-y-6">
          {/* Paste Text Tab */}
          <AnimatePresence mode="wait">
            {activeTab === "paste" && (
              <motion.div
                key="paste"
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-4"
              >
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="📝 Paste your study notes, lecture content, or any text here... 

We'll automatically:
✨ Generate smart questions
📚 Summarize key concepts
🧠 Analyze important topics

Just paste and let our AI do the magic! 🚀"
                    className="w-full h-48 p-4 bg-muted/30 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-white/50 leading-relaxed"
                    style={{ fontFamily: 'inherit' }}
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-4 right-4 text-sm text-white/80 bg-background/80 px-2 py-1 rounded-full"
                  >
                    {pastedText.length.toLocaleString()}/100,000 characters
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Files Tab */}
          <AnimatePresence mode="wait">
            {activeTab === "upload" && (
              <motion.div
                key="upload"
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-primary bg-primary/5 scale-105 shadow-lg"
                      : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/10"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center gap-4 mb-6"
                  >
                    {[
                      { icon: FileText, color: "blue", label: ".DOCX", emoji: "📄" },
                      { icon: File, color: "red", label: ".PDF", emoji: "📄" },
                      { icon: Image, color: "orange", label: ".PPT", emoji: "📊" }
                    ].map((fileType, index) => (
                      <motion.div
                        key={fileType.label}
                        initial={{ y: 20, opacity: 0, rotate: -10 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <motion.div 
                          className={`w-12 h-12 rounded-lg bg-${fileType.color}-100 flex items-center justify-center shadow-md`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <fileType.icon className={`w-6 h-6 text-${fileType.color}-600`} />
                        </motion.div>
                        <span className="text-sm font-medium">{fileType.emoji} {fileType.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <p className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      📁 Drag and drop your files here
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Upload lecture slides, notes, readings, or documents<br/>
                      <span className="font-medium">Up to 2 files • Max 25MB each</span>
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Browse Files
                    </Button>
                  </motion.div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.pptx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </motion.div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      📁 Selected Files ({uploadedFiles.length}/2)
                    </h3>
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <motion.span 
                            className="text-2xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                          >
                            {getFileIcon(file)}
                          </motion.span>
                          <div>
                            <p className="font-medium text-white">{file.name}</p>
                            <p className="text-sm text-white/80">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => removeFile(index)}
                          className="p-2 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Drive Tab */}
          <AnimatePresence mode="wait">
            {activeTab === "drive" && (
              <motion.div
                key="drive"
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-center py-12"
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <motion.span 
                    className="text-3xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ☁️
                  </motion.span>
                </motion.div>
                
                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                >
                  Google Drive Integration
                </motion.h3>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 mb-8 leading-relaxed"
                >
                  Connect your Google Drive to import documents directly!<br/>
                  <span className="text-sm">Access your files, presentations, and notes seamlessly 🚀</span>
                </motion.p>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <motion.span 
                      className="mr-2"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      🔗
                    </motion.span>
                    Connect Google Drive
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Additional Features */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <motion.h3 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              ✨ From this upload, you'll also get:
            </motion.h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  icon: BookOpen, 
                  color: "blue", 
                  title: "📚 Study Summary", 
                  description: "AI-generated overview of key concepts and main topics",
                  emoji: "📚"
                },
                { 
                  icon: Brain, 
                  color: "purple", 
                  title: "🎯 Smart Questions", 
                  description: "Multiple choice and open-ended questions tailored to your content",
                  emoji: "🎯"
                },
                { 
                  icon: Zap, 
                  color: "green", 
                  title: "❓ Smart Questions", 
                  description: "Intelligent questions that test your understanding and critical thinking",
                  emoji: "⚡"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl border border-border/30 hover:bg-muted/30 transition-all duration-200"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center shadow-md`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-semibold text-white mb-1">{feature.title}</p>
                    <p className="text-sm text-white/80 leading-relaxed">{feature.description}</p>
                  </div>
                  <motion.span 
                    className="text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {feature.emoji}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Processing State */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/20"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex items-center gap-4 mb-4"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.h3 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  >
                    🤖 AI is working its magic...
                  </motion.h3>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Progress 
                    value={processingProgress} 
                    className="h-3 bg-muted/30 shadow-inner"
                  />
                </motion.div>
                
                <motion.p 
                  key={processingProgress}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-white/80 text-center font-medium"
                >
                  {processingProgress < 20 && "📖 Reading your content..."}
                  {processingProgress >= 20 && processingProgress < 40 && "🧠 Analyzing with AI..."}
                  {processingProgress >= 40 && processingProgress < 60 && "📚 Creating summary..."}
                  {processingProgress >= 60 && processingProgress < 80 && "❓ Generating smart questions..."}
                  {processingProgress >= 80 && "✨ Almost ready!"}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Content Preview */}
          <AnimatePresence>
            {generatedContent && (
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20 shadow-lg"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-lg"
                  >
                    <Star className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.h3 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"
                  >
                    ✨ Your study guide is ready!
                  </motion.h3>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="font-semibold flex items-center gap-2">📚 Title:</span>
                      <span className="text-white font-medium">{generatedContent.title}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="font-semibold flex items-center gap-2">🎯 Total Cards:</span>
                      <span className="text-white font-medium">{generatedContent.totalCards}</span>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <span className="font-semibold flex items-center gap-2 mb-2">📖 Summary:</span>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {generatedContent.summary}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 pt-6"
          >
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full border-2 hover:bg-muted/50 transition-all duration-200"
              >
                Cancel
              </Button>
            </motion.div>
            
            {!isProcessing && !generatedContent && (
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={processContent}
                  disabled={
                    (activeTab === "paste" && !pastedText.trim()) ||
                    (activeTab === "upload" && uploadedFiles.length === 0)
                  }
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                  </motion.div>
                  Generate Study Guide ✨
                </Button>
              </motion.div>
            )}
            
            {generatedContent && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleCreateDeck}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                  </motion.div>
                  Create Study Deck 🚀
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
