'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  required = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date()
  )
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedDate = value ? new Date(value) : null

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const renderHeader = () => (
    <div className="flex items-center justify-between px-2 py-3 border-b border-[#38b6c4]/20">
      <button
        type="button"
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="p-1.5 rounded-lg hover:bg-[#38b6c4]/20 text-[#e0f7fa] transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-[#e0f7fa] font-medium">
        {format(currentMonth, 'MMMM yyyy')}
      </span>
      <button
        type="button"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-1.5 rounded-lg hover:bg-[#38b6c4]/20 text-[#e0f7fa] transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )

  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    return (
      <div className="grid grid-cols-7 gap-1 px-2 py-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-[#38b6c4] font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const isSelected = selectedDate && isSameDay(day, selectedDate)
        const isCurrentMonth = isSameMonth(day, monthStart)
        const isTodayDate = isToday(day)

        days.push(
          <button
            key={day.toString()}
            type="button"
            onClick={() => {
              onChange(format(cloneDay, 'yyyy-MM-dd'))
              setIsOpen(false)
            }}
            className={`
              w-9 h-9 rounded-lg text-sm font-medium transition-all
              ${isSelected
                ? 'bg-[#38b6c4] text-[#1a2e2e]'
                : isCurrentMonth
                  ? 'text-[#e0f7fa] hover:bg-[#38b6c4]/20'
                  : 'text-[#e0f7fa]/30'
              }
              ${isTodayDate && !isSelected ? 'ring-1 ring-[#f5a623]' : ''}
            `}
          >
            {format(day, 'd')}
          </button>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      )
      days = []
    }

    return <div className="px-2 pb-3 space-y-1">{rows}</div>
  }

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
        <span>{value ? format(new Date(value), 'MMMM d, yyyy') : placeholder}</span>
        <Calendar size={18} className="text-[#38b6c4]" />
      </button>
      {required && <input type="hidden" value={value} required />}

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-[#1a2e2e]/95 backdrop-blur-xl border border-[#38b6c4]/30 rounded-xl shadow-xl shadow-black/50 overflow-hidden">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={() => {
                onChange(format(new Date(), 'yyyy-MM-dd'))
                setIsOpen(false)
              }}
              className="w-full py-2 rounded-lg bg-[#38b6c4]/10 text-[#38b6c4] text-sm font-medium hover:bg-[#38b6c4]/20 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
