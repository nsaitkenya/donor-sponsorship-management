"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CAROUSEL_IMAGES = [
  "https://stareheboyscentre.org/wp-content/uploads/2025/02/IMG_8171-2048x1365.jpg",
  "https://stareheboyscentre.org/wp-content/uploads/2025/02/IMG_8160-1024x683.jpg",
  "https://stareheboyscentre.org/wp-content/uploads/2025/02/IMG_7989-1024x683.jpg",
  "https://stareheboyscentre.org/wp-content/uploads/2025/03/IMG_8147-1024x683.jpg",
  "https://stareheboyscentre.org/wp-content/uploads/2025/02/IMG_9670-2048x1365.jpg",
  "https://stareheboyscentre.org/wp-content/uploads/2025/04/IMG_8016-2048x1365-1.webp",
  "https://stareheboyscentre.org/wp-content/uploads/2025/02/IMG_9718-2048x1365.jpg",
]

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [autoPlay])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)
    setAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    setAutoPlay(false)
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl group">
      <div className="relative h-96 md:h-full w-full">
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Starehe Boys Centre students ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
      </div>

      {/* Navigation buttons */}
      <Button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full p-2"
        size="icon"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full p-2"
        size="icon"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {CAROUSEL_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setAutoPlay(false)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-8" : "bg-primary/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
