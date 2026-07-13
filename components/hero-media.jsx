'use client'

import { useEffect, useRef, useState } from 'react'

const HERO_VIDEO = 'https://customer-assets.emergentagent.com/job_filmmaker-barcelona/artifacts/qkv7mv6p_Toma%20Dron%201.mp4'
const HERO_VIDEO_FALLBACK = 'https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4'

export default function HeroMedia() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [loadVideo, setLoadVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = navigator.connection?.saveData === true
    if (reducedMotion || saveData) return undefined

    let timeoutId
    let frameId = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => setLoadVideo(true), 12000)
    })
    const startVideo = () => setLoadVideo(true)
    window.addEventListener('pointerdown', startVideo, { once: true, passive: true })
    window.addEventListener('scroll', startVideo, { once: true, passive: true })
    window.addEventListener('keydown', startVideo, { once: true })

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
      window.removeEventListener('pointerdown', startVideo)
      window.removeEventListener('scroll', startVideo)
      window.removeEventListener('keydown', startVideo)
    }
  }, [])

  useEffect(() => {
    if (!loadVideo || !containerRef.current) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current
      if (!video) return
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }, { threshold: 0.08 })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [loadVideo])

  return (
    <div ref={containerRef} className="absolute inset-0 bg-[#071126]">
      <picture>
        <source media="(max-width: 767px)" srcSet="/hero/hero-poster-mobile.webp" type="image/webp" />
        <source srcSet="/hero/hero-poster-desktop.webp" type="image/webp" />
        <img
          src="/hero/hero-poster-desktop.jpg"
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {loadVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${videoReady ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
          <source src={HERO_VIDEO_FALLBACK} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
