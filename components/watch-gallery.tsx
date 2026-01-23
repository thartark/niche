"use client"

import { useState } from "react"
import Image from "next/image"

interface WatchGalleryProps {
  images: string[]
  brand: string
  model: string
}

export function WatchGallery({ images, brand, model }: WatchGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={images[selectedImage] || "/placeholder.svg?height=800&width=800"}
          alt={`${brand} ${model} - Image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square overflow-hidden rounded border-2 transition-all ${
                selectedImage === index
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${brand} ${model} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
