'use client'

import { useEffect, useRef } from 'react'

const HERO_VIDEO = 'https://customer-assets.emergentagent.com/job_filmmaker-barcelona/artifacts/qkv7mv6p_Toma%20Dron%201.mp4'
const HERO_VIDEO_FALLBACK = 'https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4'

export default function HeroMedia() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

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
    <div ref={containerRef} className="absolute inset-0 bg-[#071126]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
        <source src={HERO_VIDEO_FALLBACK} type="video/mp4" />
      </video>
    </div>
  )
}
