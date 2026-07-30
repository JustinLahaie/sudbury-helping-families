'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

interface Entry {
  id: string
  name: string
  ticketCount: number
}

interface SpinningWheelProps {
  entries: Entry[]
  onSelectWinner: (entry: Entry) => void
  onWinnerClick?: (entry: Entry) => void
}

const COLORS = [
  '#38b6c4', '#f5a623', '#4CAF50', '#E91E63',
  '#9C27B0', '#FF5722', '#00BCD4', '#8BC34A',
  '#FFC107', '#3F51B5', '#FF9800', '#673AB7',
]

export default function SpinningWheel({ entries, onSelectWinner, onWinnerClick }: SpinningWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<Entry | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wheelSize = 400

  // Expand entries based on ticket count for fair representation
  const expandedEntries = entries.flatMap((entry) =>
    Array(entry.ticketCount).fill(entry)
  )

  useEffect(() => {
    drawWheel()
  }, [entries, rotation])

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = wheelSize / 2
    const centerY = wheelSize / 2
    const radius = wheelSize / 2 - 10

    ctx.clearRect(0, 0, wheelSize, wheelSize)

    if (expandedEntries.length === 0) {
      // Draw empty wheel
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fillStyle = '#1a2e2e'
      ctx.fill()
      ctx.strokeStyle = '#38b6c4'
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.fillStyle = '#e0f7fa'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('No entries yet', centerX, centerY)
      return
    }

    const sliceAngle = (2 * Math.PI) / expandedEntries.length

    // Draw slices
    expandedEntries.forEach((entry, index) => {
      const startAngle = index * sliceAngle + (rotation * Math.PI) / 180
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // Use consistent colors based on original entry index
      const colorIndex = entries.findIndex((e) => e.id === entry.id)
      ctx.fillStyle = COLORS[colorIndex % COLORS.length]
      ctx.fill()

      ctx.strokeStyle = '#1a2e2e'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw name (only for larger segments)
      if (expandedEntries.length <= 20) {
        const midAngle = startAngle + sliceAngle / 2
        const textRadius = radius * 0.65
        const x = centerX + Math.cos(midAngle) * textRadius
        const y = centerY + Math.sin(midAngle) * textRadius

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(midAngle + Math.PI / 2)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'

        // Truncate long names
        const displayName = entry.name.length > 10
          ? entry.name.slice(0, 10) + '...'
          : entry.name
        ctx.fillText(displayName, 0, 0)
        ctx.restore()
      }
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI)
    ctx.fillStyle = '#1a2e2e'
    ctx.fill()
    ctx.strokeStyle = '#f5a623'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw pointer
    ctx.beginPath()
    ctx.moveTo(wheelSize - 5, centerY - 15)
    ctx.lineTo(wheelSize - 5, centerY + 15)
    ctx.lineTo(wheelSize - 30, centerY)
    ctx.closePath()
    ctx.fillStyle = '#f5a623'
    ctx.fill()
    ctx.strokeStyle = '#1a2e2e'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  const pickRandomIndex = (count: number) => {
    // Rejection-sample from crypto for a uniformly random index (no modulo bias).
    if (count <= 0) return 0
    const limit = Math.floor(0xffffffff / count) * count
    const buf = new Uint32Array(1)
    // eslint-disable-next-line no-constant-condition
    while (true) {
      crypto.getRandomValues(buf)
      if (buf[0] < limit) return buf[0] % count
    }
  }

  const spinWheel = () => {
    if (isSpinning || expandedEntries.length === 0) return

    setIsSpinning(true)
    setWinner(null)

    // 1. Pick the winner up-front so randomness is guaranteed uniform
    //    (weighted by ticketCount because expandedEntries repeats each buyer).
    const winningIndex = pickRandomIndex(expandedEntries.length)
    const winningEntry = expandedEntries[winningIndex]

    // 2. Compute the exact rotation that lands the pointer (right side, angle 0)
    //    on the winning slice's mid-point. Slice i after rotation R occupies
    //    canvas angles [i*slice + R, (i+1)*slice + R]. To align its centre with
    //    the pointer at 360° we need R ≡ 360 - (winningIndex + 0.5)*slice (mod 360).
    const sliceAngleDeg = 360 / expandedEntries.length
    const jitter = (Math.random() - 0.5) * sliceAngleDeg * 0.6 // wobble within the slice
    const targetMod =
      ((360 - (winningIndex + 0.5) * sliceAngleDeg + jitter) % 360 + 360) % 360
    const currentMod = ((rotation % 360) + 360) % 360
    const delta = ((targetMod - currentMod) + 360) % 360
    const fullSpins = 6
    const totalRotation = fullSpins * 360 + delta

    const duration = 5000
    const startTime = Date.now()
    const startRotation = rotation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentRotation = startRotation + totalRotation * easeOut

      setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setWinner(winningEntry)
        setIsSpinning(false)

        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#38b6c4', '#f5a623', '#e0f7fa'],
        })

        onSelectWinner(winningEntry)
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <motion.canvas
          ref={canvasRef}
          width={wheelSize}
          height={wheelSize}
          className="rounded-full shadow-2xl"
          animate={isSpinning ? { scale: [1, 1.02, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning || expandedEntries.length === 0}
        className="btn-accent px-8 py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>

      {winner && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => onWinnerClick?.(winner)}
          className={`mt-6 glass-card p-6 text-center ${onWinnerClick ? 'cursor-pointer hover:ring-2 hover:ring-[#f5a623] transition-all' : ''}`}
        >
          <p className="text-[#38b6c4] text-sm mb-2">Winner!</p>
          <p className="text-2xl font-bold text-[#f5a623]">{winner.name}</p>
          {onWinnerClick && (
            <p className="text-[#e0f7fa]/50 text-xs mt-2">Click to view details</p>
          )}
        </motion.div>
      )}

      <div className="mt-6 text-center">
        <p className="text-[#e0f7fa]/60 text-sm">
          {expandedEntries.length} total ticket{expandedEntries.length !== 1 ? 's' : ''} from{' '}
          {entries.length} participant{entries.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
