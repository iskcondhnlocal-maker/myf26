"use client";
import React, { useRef, useState, useEffect } from "react";

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true); // Autoplay means it starts playing
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(true); // Starts muted for autoplay
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStartedInteracting, setHasStartedInteracting] = useState(false); // Tracks if user has clicked play to start the 'real' experience
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to start autoplay on mount
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        // Browser might block autoplay
        setIsPlaying(false);
      });
      // Safety check for duration if it's already loaded
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  }, []);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime || 0);
      if (videoRef.current.duration && duration === 0) {
         setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setCurrentTime(videoRef.current.currentTime || 0);
    }
  };

  const startRealVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsMuted(false);
      setIsPlaying(true);
      setHasStartedInteracting(true);
    }
  };

  const togglePlay = () => {
    if (!hasStartedInteracting) {
      startRealVideo();
      return;
    }

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = x / rect.width;
      const newTime = percent * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    handleSeek(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleSeek(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden group z-20 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        onClick={togglePlay}
        src="https://pub-f709223223e64d77b65165c308171877.r2.dev/06_compressed.mp4"
        className="w-full h-full max-h-full object-contain bg-black"
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        muted={isMuted}
        playsInline
        autoPlay
        loop={!hasStartedInteracting}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleLoadedMetadata}
        onDurationChange={handleLoadedMetadata}
      />

      {/* Large centered play button - visible initially (before interaction) OR when paused after interaction */}
      {(!hasStartedInteracting || !isPlaying) && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-colors hover:bg-black/20 z-10"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-[var(--color-secondary)]/90 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-transform hover:scale-110 active:scale-95">
            <span className="material-symbols-outlined text-[#000000] text-5xl ml-2" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </div>
        </div>
      )}

      {/* Controls Overlay - Visible only after interaction, and shown on hover or when paused */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col transition-opacity duration-300 z-20 ${!hasStartedInteracting ? 'opacity-0 pointer-events-none' : (isPlaying ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100' : 'opacity-100')}`}>
        
        {/* Progress Bar (Full width on its own row) */}
        <div className="w-full px-3 sm:px-4 pt-4 pb-1">
          <div 
            ref={progressBarRef}
            className="w-full h-6 flex items-center cursor-pointer group/progress touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="w-full h-[4px] group-hover/progress:h-[6px] transition-all bg-white/20 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-[var(--color-secondary)] transition-all duration-100 ease-linear"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full px-3 sm:px-4 pb-3 sm:pb-4">
          
          {/* Play/Pause, Mute & Time */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button 
              onClick={togglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[var(--color-secondary)] text-[#000000] hover:bg-white transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <button 
              onClick={toggleMute}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors backdrop-blur-md"
              title={isMuted ? "Unmute" : "Mute"}
            >
              <span className="material-symbols-outlined text-lg sm:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            
            <span className="text-white text-[10px] sm:text-xs font-mono font-medium opacity-80 tracking-wider shrink-0 ml-1 sm:ml-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Speed & Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-black/50 backdrop-blur-md rounded-lg p-1 border border-white/10">
              {[0.5, 1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-[10px] sm:text-xs font-black transition-colors ${
                    playbackRate === speed 
                      ? 'bg-[var(--color-secondary)] text-[#000000]' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button 
              onClick={toggleFullscreen}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors backdrop-blur-md"
              title="Fullscreen"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">
                fullscreen
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
