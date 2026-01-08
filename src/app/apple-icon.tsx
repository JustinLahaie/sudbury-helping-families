import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: '#1a2e2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Cyan curved shape (top-left) */}
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: '28px solid #38b6c4',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            transform: 'rotate(-45deg)',
            top: 20,
            left: 20,
          }}
        />
        {/* Amber curved shape (bottom-right) */}
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: '28px solid #f5a623',
            borderLeftColor: 'transparent',
            borderTopColor: 'transparent',
            transform: 'rotate(-45deg)',
            top: 20,
            left: 20,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
