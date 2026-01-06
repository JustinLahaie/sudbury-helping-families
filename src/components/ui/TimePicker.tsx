'use client'

import { useState, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export default function TimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  required = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse existing value
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 12, minute: 0, period: 'PM' as const }
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (match) {
      return {
        hour: parseInt(match[1]),
        minute: parseInt(match[2]),
        period: match[3].toUpperCase() as 'AM' | 'PM',
      }
    }
    return { hour: 12, minute: 0, period: 'PM' as const }
  }

  const [time, setTime] = useState(parseTime(value))

  useEffect(() => {
    if (value) {
      setTime(parseTime(value))
    }
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (h: number, m: number, p: string) => {
    return `${h}:${m.toString().padStart(2, '0')} ${p}`
  }

  const handleTimeChange = (field: 'hour' | 'minute' | 'period', val: number | string) => {
    const newTime = { ...time, [field]: val }
    setTime(newTime)
    onChange(formatTime(newTime.hour, newTime.minute, newTime.period))
  }

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const minutes = [0, 15, 30, 45]

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full bg-[#1a2e2e] border border-[#38b6c4]/30 rounded-lg px-4 py-3
          text-left flex items-center justify-between gap-3
          focus:outline-none focus:border-[#38b6c4] transition-colors
          ${value ? 'text-[#e0f7fa]' : 'text-[#e0f7fa]/50'}
        `}
      >
        <span>{value || placeholder}</span>
        <Clock size={18} className="text-[#38b6c4]" />
      </button>
      {required && <input type="hidden" value={value} required />}

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-[#1a2e2e]/95 backdrop-blur-xl border border-[#38b6c4]/30 rounded-xl shadow-xl shadow-black/50 overflow-hidden">
          <div className="p-4">
            <div className="text-center text-[#e0f7fa] font-medium mb-4">
              {value || 'Select Time'}
            </div>

            {/* Hour Selection */}
            <div className="mb-4">
              <div className="text-xs text-[#38b6c4] mb-2 font-medium">Hour</div>
              <div className="grid grid-cols-6 gap-1">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleTimeChange('hour', h)}
                    className={`
                      py-2 rounded-lg text-sm font-medium transition-all
                      ${time.hour === h
                        ? 'bg-[#38b6c4] text-[#1a2e2e]'
                        : 'text-[#e0f7fa] hover:bg-[#38b6c4]/20'
                      }
                    `}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Minute Selection */}
            <div className="mb-4">
              <div className="text-xs text-[#38b6c4] mb-2 font-medium">Minute</div>
              <div className="grid grid-cols-4 gap-1">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleTimeChange('minute', m)}
                    className={`
                      py-2 rounded-lg text-sm font-medium transition-all
                      ${time.minute === m
                        ? 'bg-[#38b6c4] text-[#1a2e2e]'
                        : 'text-[#e0f7fa] hover:bg-[#38b6c4]/20'
                      }
                    `}
                  >
                    :{m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM Selection */}
            <div className="mb-4">
              <div className="text-xs text-[#38b6c4] mb-2 font-medium">Period</div>
              <div className="grid grid-cols-2 gap-2">
                {['AM', 'PM'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleTimeChange('period', p)}
                    className={`
                      py-2.5 rounded-lg text-sm font-medium transition-all
                      ${time.period === p
                        ? 'bg-[#f5a623] text-[#1a2e2e]'
                        : 'text-[#e0f7fa] hover:bg-[#38b6c4]/20 border border-[#38b6c4]/20'
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Select */}
            <div className="pt-3 border-t border-[#38b6c4]/20">
              <div className="text-xs text-[#38b6c4] mb-2 font-medium">Quick Select</div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: '9 AM', h: 9, m: 0, p: 'AM' },
                  { label: '12 PM', h: 12, m: 0, p: 'PM' },
                  { label: '3 PM', h: 3, m: 0, p: 'PM' },
                  { label: '5 PM', h: 5, m: 0, p: 'PM' },
                  { label: '7 PM', h: 7, m: 0, p: 'PM' },
                  { label: '9 PM', h: 9, m: 0, p: 'PM' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setTime({ hour: preset.h, minute: preset.m, period: preset.p as 'AM' | 'PM' })
                      onChange(formatTime(preset.h, preset.m, preset.p))
                      setIsOpen(false)
                    }}
                    className="py-1.5 rounded-lg text-xs text-[#e0f7fa]/70 hover:bg-[#38b6c4]/20 hover:text-[#e0f7fa] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-[#38b6c4]/10 text-[#38b6c4] text-sm font-medium hover:bg-[#38b6c4]/20 transition-colors border-t border-[#38b6c4]/20"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
