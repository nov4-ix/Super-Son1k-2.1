import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Music, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Settings,
  Wand2,
  Volume2,
  Clock,
  Heart
} from 'lucide-react'
import toast from 'react-hot-toast'

const generationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
  duration: z.number().min(30).max(600).optional(),
  tempo: z.number().min(60).max(200).optional(),
  key: z.string().optional(),
  genre: z.string().optional(),
  mood: z.string().optional(),
  style: z.string().optional(),
  complexity: z.number().min(0).max(1).optional(),
})

type GenerationForm = z.infer<typeof generationSchema>

const genres = [
  'pop', 'rock', 'electronic', 'classical', 'jazz', 'hip-hop', 'ambient',
  'country', 'blues', 'folk', 'reggae', 'funk', 'soul', 'r&b'
]

const moods = [
  'happy', 'sad', 'energetic', 'calm', 'aggressive', 'peaceful', 'romantic',
  'melancholic', 'uplifting', 'dark', 'bright', 'mysterious', 'nostalgic'
]

const keys = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]

const styles = [
  'modern', 'classical', 'electronic', 'acoustic', 'orchestral', 'minimalist',
  'maximalist', 'ambient', 'cinematic', 'experimental', 'fusion'
]

export function TheGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTrack, setGeneratedTrack] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<GenerationForm>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      duration: 60,
      tempo: 120,
      key: 'C',
      genre: 'pop',
      mood: 'happy',
      style: 'modern',
      complexity: 0.7
    }
  })

  const onSubmit = async (data: GenerationForm) => {
    setIsGenerating(true)
    
    try {
      // Call backend API
      const response = await fetch('http://localhost:3001/api/generation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'test-token'}`
        },
        body: JSON.stringify({
          prompt: data.prompt,
          style: data.style || 'pop',
          duration: data.duration || 60,
          quality: 'standard'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to generate track')
      }

      const track = {
        id: result.data.generationId,
        prompt: data.prompt,
        audioUrl: result.data.audioUrl,
        duration: data.duration || 60,
        status: result.data.status,
        createdAt: new Date().toISOString()
      }
      
      setGeneratedTrack(track)
      toast.success('Track generation started!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate track')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    toast.success(isPlaying ? 'Paused' : 'Playing')
  }

  const handleDownload = () => {
    toast.success('Download started!')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0d] via-[#0f121a] to-[#0b0b0d] text-white p-6 relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 191, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 191, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00bfff] via-[#ff49c3] to-[#44ff44] bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Wand2 size={40} className="text-[#00bfff]" />
            THE GENERATOR
          </h1>
          <p className="text-[#b9b9c2] text-lg">
            Creating AI-powered music with advanced controls
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#0f121a] to-[#1b1b21] border-2 border-[#00bfff]/30 rounded-xl p-6 shadow-lg shadow-[#00bfff]/10"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#00bfff] to-[#ff49c3] bg-clip-text text-transparent">
              GENERATION PARAMETERS
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prompt *
                </label>
                <textarea
                  {...register('prompt')}
                  className="w-full h-32 px-4 py-3 bg-[#0b0b0d] border-2 border-[#1b1b21] rounded-lg text-[#e7e7ea] placeholder-[#7a8a9a] focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/50 resize-none transition-all"
                  placeholder="Describe the music you want to create..."
                />
                {errors.prompt && (
                  <p className="text-red-400 text-sm mt-1">{errors.prompt.message}</p>
                )}
              </div>

              {/* Duration and Tempo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    {...register('duration', { valueAsNumber: true })}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                    min="30"
                    max="600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tempo (BPM)
                  </label>
                  <input
                    type="number"
                    {...register('tempo', { valueAsNumber: true })}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                    min="60"
                    max="200"
                  />
                </div>
              </div>

              {/* Genre and Mood */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <select
                    {...register('genre')}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mood
                  </label>
                  <select
                    {...register('mood')}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                  >
                    {moods.map(mood => (
                      <option key={mood} value={mood}>
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Key and Style */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Key
                  </label>
                  <select
                    {...register('key')}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                  >
                    {keys.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Style
                  </label>
                  <select
                    {...register('style')}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                  >
                    {styles.map(style => (
                      <option key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Complexity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Complexity: {watch('complexity') || 0.7}
                </label>
                <input
                  type="range"
                  {...register('complexity', { valueAsNumber: true })}
                  className="w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer slider"
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-[#00bfff] to-[#ff49c3] text-white font-bold py-4 px-6 rounded-lg hover:from-[#00a8e6] hover:to-[#ff3dba] transition-all transform hover:scale-105 shadow-lg shadow-[#00bfff]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Music size={20} />
                    Generate Music
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Generated Track */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-[#00FFE7]">
              Generated Track
            </h2>

            {generatedTrack ? (
              <div className="space-y-4">
                {/* Track Cover */}
                <div className="aspect-square bg-[#333] rounded-lg flex items-center justify-center">
                  <Music size={48} className="text-gray-400" />
                </div>

                {/* Track Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {generatedTrack.prompt}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {generatedTrack.duration}s
                    </div>
                    <div className="flex items-center gap-1">
                      <Volume2 size={14} />
                      {watch('tempo')} BPM
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                    className="bg-[#00FFE7] text-black p-2 rounded-lg hover:bg-[#00FFE7]/90 transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="bg-[#333] text-white p-2 rounded-lg hover:bg-[#444] transition-colors"
                  >
                    <Download size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="bg-[#333] text-white p-2 rounded-lg hover:bg-[#444] transition-colors"
                  >
                    <Share2 size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#333] text-white p-2 rounded-lg hover:bg-[#444] transition-colors ml-auto"
                  >
                    <Heart size={20} />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <Music size={48} className="mx-auto mb-4" />
                  <p>Generate a track to see it here</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TheGenerator
