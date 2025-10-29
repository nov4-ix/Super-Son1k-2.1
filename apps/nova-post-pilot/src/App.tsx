import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  Send,
  Copy,
  Download,
  Share2,
  BarChart3,
  Brain,
  Sparkles,
  Clock,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const postSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  platform: z.string().min(1, 'Platform is required'),
  tone: z.string().min(1, 'Tone is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  callToAction: z.string().optional(),
  hashtags: z.string().optional(),
})

type PostForm = z.infer<typeof postSchema>

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'youtube', name: 'YouTube', icon: '📺' }
]

const tones = [
  'Professional', 'Casual', 'Friendly', 'Authoritative', 'Playful', 
  'Inspirational', 'Educational', 'Humorous', 'Motivational', 'Trendy'
]

const targetAudiences = [
  'Gen Z (18-26)', 'Millennials (27-42)', 'Gen X (43-58)', 
  'Baby Boomers (59-77)', 'Small Business Owners', 'Entrepreneurs',
  'Students', 'Professionals', 'Creatives', 'Tech Enthusiasts'
]

interface GeneratedPost {
  id: string
  content: string
  hashtags: string[]
  engagement: {
    likes: number
    comments: number
    shares: number
    reach: number
  }
  platform: string
  createdAt: string
}

export function NovaPostPilot() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([])
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      platform: 'instagram',
      tone: 'Professional',
      targetAudience: 'Millennials (27-42)'
    }
  })

  const onSubmit = async (data: PostForm) => {
    setIsGenerating(true)
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockPost: GeneratedPost = {
        id: Math.random().toString(36).substr(2, 9),
        content: `🎵 Exciting news! We're revolutionizing music creation with AI technology. ${data.topic} is changing the game for ${data.targetAudience.toLowerCase()}. Ready to create your next hit? 🚀`,
        hashtags: ['#AI', '#Music', '#Innovation', '#Creative', '#Tech'],
        engagement: {
          likes: Math.floor(Math.random() * 1000) + 100,
          comments: Math.floor(Math.random() * 100) + 10,
          shares: Math.floor(Math.random() * 50) + 5,
          reach: Math.floor(Math.random() * 5000) + 500
        },
        platform: data.platform,
        createdAt: new Date().toISOString()
      }
      
      setGeneratedPosts([mockPost, ...generatedPosts])
      setSelectedPost(mockPost)
      toast.success('Post generated successfully!')
    } catch (error) {
      toast.error('Failed to generate post')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyPost = (post: GeneratedPost) => {
    navigator.clipboard.writeText(post.content)
    toast.success('Post copied to clipboard!')
  }

  const handleSchedulePost = (post: GeneratedPost) => {
    toast.success('Post scheduled successfully!')
  }

  const handleDownloadPost = (post: GeneratedPost) => {
    const blob = new Blob([post.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `post-${post.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Post downloaded!')
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-[#00FFE7] mb-2 flex items-center justify-center gap-2">
            <Zap size={32} />
            Nova Post Pilot
          </h1>
          <p className="text-gray-400">
            AI-powered marketing intelligence and content generation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-[#00FFE7] flex items-center gap-2">
                <Brain size={20} />
                Generate Content
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Topic *
                  </label>
                  <textarea
                    {...register('topic')}
                    className="w-full h-20 px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7] resize-none"
                    placeholder="What do you want to post about?"
                  />
                  {errors.topic && (
                    <p className="text-red-400 text-sm mt-1">{errors.topic.message}</p>
                  )}
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Platform *
                  </label>
                  <select
                    {...register('platform')}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                  >
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>
                        {platform.icon} {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tone *
                  </label>
                  <select
                    {...register('tone')}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                  >
                    {tones.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Audience *
                  </label>
                  <select
                    {...register('targetAudience')}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                  >
                    {targetAudiences.map(audience => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </select>
                </div>

                {/* Call to Action */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Call to Action
                  </label>
                  <input
                    type="text"
                    {...register('callToAction')}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                    placeholder="e.g., Learn more, Sign up, Download"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    {...register('hashtags')}
                    className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
                    placeholder="#hashtag1 #hashtag2"
                  />
                </div>

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-[#00FFE7] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#00FFE7]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Post
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Generated Posts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#00FFE7] flex items-center gap-2">
                <BarChart3 size={20} />
                Generated Posts ({generatedPosts.length})
              </h2>

              {generatedPosts.length === 0 ? (
                <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-8 text-center">
                  <div className="text-gray-400">
                    <Target size={48} className="mx-auto mb-4" />
                    <p>No posts generated yet</p>
                    <p className="text-sm">Use the form to create your first post</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-[#1a1a1a] border rounded-xl p-6 cursor-pointer transition-colors ${
                        selectedPost?.id === post.id 
                          ? 'border-[#00FFE7] bg-[#00FFE7]/10' 
                          : 'border-[#333] hover:border-[#555]'
                      }`}
                      onClick={() => setSelectedPost(post)}
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#00FFE7] rounded-full flex items-center justify-center text-black font-bold">
                            {platforms.find(p => p.id === post.platform)?.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {platforms.find(p => p.id === post.platform)?.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyPost(post)
                            }}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSchedulePost(post)
                            }}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Calendar size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadPost(post)
                            }}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Download size={16} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-gray-300 leading-relaxed">
                          {post.content}
                        </p>
                      </div>

                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.hashtags.map((hashtag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#333] text-[#00FFE7] rounded text-sm"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>

                      {/* Engagement Metrics */}
                      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-[#333]">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                            <Heart size={14} />
                            <span className="text-sm">Likes</span>
                          </div>
                          <div className="text-lg font-semibold text-[#00FFE7]">
                            {post.engagement.likes.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                            <MessageCircle size={14} />
                            <span className="text-sm">Comments</span>
                          </div>
                          <div className="text-lg font-semibold text-[#00FFE7]">
                            {post.engagement.comments.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                            <Share2 size={14} />
                            <span className="text-sm">Shares</span>
                          </div>
                          <div className="text-lg font-semibold text-[#00FFE7]">
                            {post.engagement.shares.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                            <Eye size={14} />
                            <span className="text-sm">Reach</span>
                          </div>
                          <div className="text-lg font-semibold text-[#00FFE7]">
                            {post.engagement.reach.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NovaPostPilot
