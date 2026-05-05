'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon, ArrowLeft, ArrowRight, Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface MultiImageUploadProps {
  values: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 5 * 1024 * 1024

export default function MultiImageUpload({ values, onChange, disabled }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const uploadFiles = useCallback(async (files: File[]) => {
    if (disabled || files.length === 0) return

    const valid: File[] = []
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Only JPEG, PNG, WebP, GIF allowed`)
        continue
      }
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name}: must be under 5MB`)
        continue
      }
      valid.push(file)
    }
    if (valid.length === 0) return

    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of valid) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || `Upload failed for ${file.name}`)
        }
        const { url } = await res.json()
        uploaded.push(url)
      }
      onChange([...values, ...uploaded])
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [disabled, onChange, values])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    uploadFiles(files)
    e.target.value = ''
  }, [uploadFiles])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    uploadFiles(files)
  }, [uploadFiles])

  const remove = (index: number) => onChange(values.filter((_, i) => i !== index))

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= values.length) return
    const next = values.slice()
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const setCover = (index: number) => {
    if (index === 0) return
    const next = values.slice()
    const [picked] = next.splice(index, 1)
    next.unshift(picked)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-[#f5a623] bg-[#f5a623]/10' : 'border-[#38b6c4]/30 hover:border-[#38b6c4]/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <>
              <Loader2 size={32} className="text-[#38b6c4] animate-spin" />
              <p className="text-[#e0f7fa]">Uploading...</p>
            </>
          ) : (
            <>
              {dragActive ? (
                <Upload size={32} className="text-[#f5a623]" />
              ) : (
                <ImageIcon size={32} className="text-[#38b6c4]/50" />
              )}
              <p className="text-[#e0f7fa]">
                {dragActive ? 'Drop images here' : 'Drag & drop or click to add photos'}
              </p>
              <p className="text-[#38b6c4]/70 text-xs">
                Multiple files supported · JPEG / PNG / WebP / GIF · 5MB each
              </p>
            </>
          )}
        </div>
      </div>

      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {values.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative rounded-lg overflow-hidden border border-[#38b6c4]/30 bg-black/20"
            >
              <div className="relative w-full h-32">
                <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" />
              </div>
              {index === 0 && (
                <span className="absolute top-1 left-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f5a623] text-[#1a2e2e] text-[10px] font-semibold">
                  <Star size={10} /> Cover
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  title="Move left"
                  className="p-1.5 rounded-full bg-[#1a2e2e]/80 text-[#e0f7fa] hover:bg-[#38b6c4] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setCover(index)}
                  disabled={index === 0}
                  title="Make cover"
                  className="p-1.5 rounded-full bg-[#1a2e2e]/80 text-[#f5a623] hover:bg-[#f5a623] hover:text-[#1a2e2e] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Star size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === values.length - 1}
                  title="Move right"
                  className="p-1.5 rounded-full bg-[#1a2e2e]/80 text-[#e0f7fa] hover:bg-[#38b6c4] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  title="Remove"
                  className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
