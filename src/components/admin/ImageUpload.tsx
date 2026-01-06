'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleUpload = useCallback(async (file: File) => {
    if (disabled) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP, and GIF images are allowed')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Upload failed')
      }

      const { url } = await res.json()
      onChange(url)
      toast.success('Image uploaded!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }, [disabled, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleRemove = useCallback(() => {
    onChange(null)
  }, [onChange])

  if (value) {
    return (
      <div className="relative">
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#38b6c4]/30">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
        </div>
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled}
          className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${dragActive
          ? 'border-[#f5a623] bg-[#f5a623]/10'
          : 'border-[#38b6c4]/30 hover:border-[#38b6c4]/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="flex flex-col items-center gap-3">
        {uploading ? (
          <>
            <Loader2 size={40} className="text-[#38b6c4] animate-spin" />
            <p className="text-[#e0f7fa]">Uploading...</p>
          </>
        ) : (
          <>
            {dragActive ? (
              <Upload size={40} className="text-[#f5a623]" />
            ) : (
              <ImageIcon size={40} className="text-[#38b6c4]/50" />
            )}
            <div>
              <p className="text-[#e0f7fa]">
                {dragActive ? 'Drop image here' : 'Drag & drop an image or click to browse'}
              </p>
              <p className="text-[#38b6c4]/70 text-sm mt-1">
                JPEG, PNG, WebP, or GIF (max 5MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
