'use client'

import { useEffect, useRef } from 'react'

const HERO_VIDEO = 'https://customer-assets.emergentagent.com/job_filmmaker-barcelona/artifacts/qkv7mv6p_Toma%20Dron%201.mp4'
const HERO_VIDEO_FALLBACK = 'https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4'

export default function HeroMedia({ isMuted = true, onVideoRef }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
      if (onVideoRef) onVideoRef(videoRef.current)
    }
  }, [isMuted, onVideoRef])

  useEffect(() => {
    if (!containerRef.current) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current
      if (!video) return
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }, { threshold: 0.08 })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 bg-[#0D1B2A] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover scale-[1.02]"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        poster="/hero/hero-poster-desktop.jpg"
        aria-label="Background video of Barcelona cinematic drone footage"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
        <source src={HERO_VIDEO_FALLBACK} type="video/mp4" />
      </video>
    </div>
  )
}
