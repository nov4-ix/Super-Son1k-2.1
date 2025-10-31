import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Square, 
  Upload, 
  Download, 
  Mic,
  Volume2,
  Settings,
  Activity,
  Sliders,
  Music,
  FileAudio,
  Trash2,
  Copy,
  Edit3
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Track {
  id: string
  name: string
  duration: number
  waveform: number[]
  volume: number
  pan: number
  muted: boolean
  solo: boolean
}

export function GhostStudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      name: 'Track 1',
      duration: 120,
      waveform: [0.2, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 0.1, 0.8],
      volume: 0.8,
      pan: 0,
      muted: false,
      solo: false
    },
    {
      id: '2',
      name: 'Track 2',
      duration: 120,
      waveform: [0.1, 0.3, 0.6, 0.2, 0.5, 0.8, 0.3, 0.7, 0.2, 0.6],
      volume: 0.6,
      pan: 0.2,
      muted: false,
      solo: false
    }
  ])
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    toast.success(isPlaying ? 'Paused' : 'Playing')
  }

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    toast.success('Stopped')
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newTrack: Track = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        duration: 120,
        waveform: Array.from({ length: 20 }, () => Math.random()),
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false
      }
      setTracks([...tracks, newTrack])
      toast.success('Track uploaded successfully!')
    }
  }

  const handleTrackVolumeChange = (trackId: string, volume: number) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, volume } : track
    ))
  }

  const handleTrackPanChange = (trackId: string, pan: number) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, pan } : track
    ))
  }

  const handleTrackMute = (trackId: string) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, muted: !track.muted } : track
    ))
  }

  const handleTrackSolo = (trackId: string) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, solo: !track.solo } : track
    ))
  }

  const handleDeleteTrack = (trackId: string) => {
    setTracks(tracks.filter(track => track.id !== trackId))
    toast.success('Track deleted')
  }

  const handleDuplicateTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId)
    if (track) {
      const newTrack = {
        ...track,
        id: Date.now().toString(),
        name: `${track.name} (Copy)`
      }
      setTracks([...tracks, newTrack])
      toast.success('Track duplicated')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#333] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-[#00FFE7] flex items-center gap-2">
              <Music size={24} />
              Ghost Studio
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Transport Controls */}
            <div className="flex items-center space-x-2">
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
                onClick={handleStop}
                className="bg-[#333] text-white p-2 rounded-lg hover:bg-[#444] transition-colors"
              >
                <Square size={20} />
              </motion.button>
            </div>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              className="bg-[#B84DFF] text-white px-4 py-2 rounded-lg hover:bg-[#B84DFF]/90 transition-colors flex items-center gap-2"
            >
              <Upload size={16} />
              Upload
            </motion.button>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Track List */}
        <div className="w-80 bg-[#1a1a1a] border-r border-[#333] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-[#00FFE7]">
              Tracks ({tracks.length})
            </h2>

            <div className="space-y-2">
              {tracks.map((track) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTrack === track.id 
                      ? 'border-[#00FFE7] bg-[#00FFE7]/10' 
                      : 'border-[#333] bg-[#333]/50 hover:bg-[#333]'
                  }`}
                  onClick={() => setSelectedTrack(track.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{track.name}</h3>
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateTrack(track.id)
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTrack(track.id)
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Waveform */}
                  <div className="flex items-center space-x-1 mb-2">
                    {track.waveform.map((height, index) => (
                      <div
                        key={index}
                        className={`w-1 bg-[#00FFE7] rounded-full ${
                          track.muted ? 'opacity-50' : ''
                        }`}
                        style={{ height: `${height * 20}px` }}
                      />
                    ))}
                  </div>

                  {/* Track Controls */}
                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTrackMute(track.id)
                      }}
                      className={`px-2 py-1 rounded ${
                        track.muted ? 'bg-red-500 text-white' : 'bg-[#333] text-gray-400'
                      }`}
                    >
                      M
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTrackSolo(track.id)
                      }}
                      className={`px-2 py-1 rounded ${
                        track.solo ? 'bg-yellow-500 text-white' : 'bg-[#333] text-gray-400'
                      }`}
                    >
                      S
                    </button>
                    <span className="text-gray-400">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col">
          {/* Timeline */}
          <div className="h-32 bg-[#1a1a1a] border-b border-[#333] p-4">
            <div className="flex items-center space-x-4 mb-4">
              <h3 className="text-lg font-semibold text-[#00FFE7]">Timeline</h3>
              <div className="text-sm text-gray-400">
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Timeline Grid */}
            <div className="relative h-16 bg-[#333] rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-[#555] flex items-center justify-center text-xs text-gray-400"
                  >
                    {i * 6}s
                  </div>
                ))}
              </div>
              
              {/* Playhead */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-[#00FFE7] z-10"
                style={{ left: `${(currentTime / 120) * 100}%` }}
              />
            </div>
          </div>

          {/* Track Editor */}
          <div className="flex-1 p-4">
            {selectedTrack ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#00FFE7]">
                  {tracks.find(t => t.id === selectedTrack)?.name}
                </h3>

                {/* Volume Control */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Volume: {Math.round((tracks.find(t => t.id === selectedTrack)?.volume || 0) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={tracks.find(t => t.id === selectedTrack)?.volume || 0}
                    onChange={(e) => handleTrackVolumeChange(selectedTrack, parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Pan Control */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pan: {tracks.find(t => t.id === selectedTrack)?.pan || 0}
                  </label>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={tracks.find(t => t.id === selectedTrack)?.pan || 0}
                    onChange={(e) => handleTrackPanChange(selectedTrack, parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Effects */}
                <div>
                  <h4 className="text-lg font-semibold text-[#00FFE7] mb-4">Effects</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#333] p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Reverb</h5>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full"
                      />
                    </div>
                    <div className="bg-[#333] p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Delay</h5>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full"
                      />
                    </div>
                    <div className="bg-[#333] p-4 rounded-lg">
                      <h5 className="font-medium mb-2">EQ</h5>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full"
                      />
                    </div>
                    <div className="bg-[#333] p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Compressor</h5>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Activity size={48} className="mx-auto mb-4" />
                  <p>Select a track to edit</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GhostStudio
