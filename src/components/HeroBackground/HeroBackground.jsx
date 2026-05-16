import { useEffect, useRef } from 'react'
import styles from './HeroBackground.module.css'

const STREAK_COUNT = 220
const BLOB_COUNT   = 7

const PALETTE = [
  [255, 255, 255],
  [255, 255, 255],
  [210, 230, 255],
  [210, 230, 255],
  [160, 205, 255],
  [100, 175, 255],
  [0,   210, 255],
  [80,  150, 255],
  [200,  90,  90],
  [80,  210, 160],
]

function rand(a, b) { return a + Math.random() * (b - a) }


function makeStreak(W, H, warm = false) {
  const yFrac = rand(0.18, 0.70)
  const dir   = Math.random() < 0.5 ? 1 : -1
  const xHead = warm
    ? rand(-W * 0.2, W * 1.2)
    : dir > 0 ? rand(-W, -100) : rand(W + 100, W * 2)
  return {
    yFrac,
    yBase: yFrac * H,
    dir,
    xHead,
    speed:   rand(0.25, 1.3),
    length:  rand(120, 900),
    opacity: rand(0.1, 0.55),
    width:   rand(0.4, 1.6),
    color:   PALETTE[Math.floor(Math.random() * PALETTE.length)],
  }
}

const SCREEN_CENTER = 0.44

function curvedY(x, yBase, yFrac, W, H) {
  const t    = (x / W - 0.5) * 2
  const dist = Math.abs(yFrac - SCREEN_CENTER) / SCREEN_CENTER
  const k    = 0.04 + dist * 0.07
  const sign = yFrac <= SCREEN_CENTER ? -1 : 1
  return yBase + sign * k * t * t * H
}

function drawStreak(ctx, s, W, H) {
  const { yBase, yFrac, xHead, dir, length, opacity, width } = s
  const [r, gr, b] = s.color
  const xTail = xHead - dir * length

  const STEPS = 14
  const pts = []
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS
    const x = xTail + (xHead - xTail) * t
    pts.push([x, curvedY(x, yBase, yFrac, W, H)])
  }

  const visible = pts.some(([x, y]) => x > -20 && x < W + 20 && y > -20 && y < H + 20)
  if (!visible) return

  const [px0, py0] = pts[0]
  const [px1, py1] = pts[STEPS]

  function makeGrad() {
    const grd = ctx.createLinearGradient(px0, py0, px1, py1)
    grd.addColorStop(0,    `rgba(${r},${gr},${b},0)`)
    grd.addColorStop(0.35, `rgba(${r},${gr},${b},0.5)`)
    grd.addColorStop(1,    `rgba(${r},${gr},${b},1)`)
    return grd
  }

  function tracePath() {
    ctx.beginPath()
    pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
  }

  ctx.save()
  ctx.lineCap = 'round'

  ctx.globalAlpha = opacity * 0.06
  ctx.strokeStyle = makeGrad()
  ctx.lineWidth   = width * 14
  tracePath(); ctx.stroke()

  ctx.globalAlpha = opacity * 0.18
  ctx.strokeStyle = makeGrad()
  ctx.lineWidth   = width * 5
  tracePath(); ctx.stroke()

  ctx.globalAlpha = opacity
  ctx.strokeStyle = makeGrad()
  ctx.lineWidth   = width
  tracePath(); ctx.stroke()

  ctx.restore()
}


function makeBlob(W, H, warm = false) {
  const yFrac = rand(0.20, 0.66)
  const dir   = Math.random() < 0.5 ? 1 : -1
  return {
    x:       warm ? rand(0, W) : (dir > 0 ? rand(-400, -50) : rand(W + 50, W + 400)),
    y:       yFrac * H,
    yFrac,
    dir,
    speed:   rand(0.08, 0.35),
    rx:      rand(180, 380),
    ry:      rand(60,  140),
    opacity: rand(0.5, 0.10),
  }
}

function drawBlob(ctx, b, W, H) {
  const { x, y, rx, ry, opacity } = b
  if (x + rx < -20 || x - rx > W + 20) return

  ctx.save()
  ctx.translate(x, y)
  ctx.scale(1, ry / rx)

  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  grd.addColorStop(0,   `rgba(220, 235, 255, ${opacity})`)
  grd.addColorStop(0.4, `rgba(180, 210, 255, ${opacity * 0.5})`)
  grd.addColorStop(1,   'rgba(0, 0, 0, 0)')

  ctx.globalAlpha = 1
  ctx.fillStyle   = grd
  ctx.beginPath()
  ctx.arc(0, 0, rx, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}


export default function HeroBackground() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const streaks   = useRef([])
  const blobs     = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      streaks.current = Array.from({ length: STREAK_COUNT }, () =>
        makeStreak(canvas.width, canvas.height, true)
      )
      blobs.current = Array.from({ length: BLOB_COUNT }, () =>
        makeBlob(canvas.width, canvas.height, true)
      )
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function frame() {
      const { width: W, height: H } = canvas
      ctx.clearRect(0, 0, W, H)

      const fog = ctx.createRadialGradient(W / 2, H * 0.44, 0, W / 2, H * 0.44, W * 0.65)
      fog.addColorStop(0,    'rgba(20, 40, 100, 0.14)')
      fog.addColorStop(0.45, 'rgba(15, 25, 70,  0.07)')
      fog.addColorStop(1,    'rgba(0,  0,  0,   0)')
      ctx.fillStyle = fog
      ctx.fillRect(0, 0, W, H)

      for (const s of streaks.current) {
        drawStreak(ctx, s, W, H)
        s.xHead += s.dir * s.speed
        const gone = s.dir > 0
          ? s.xHead - s.length > W + 50
          : s.xHead + s.length < -50
        if (gone) Object.assign(s, makeStreak(W, H, false))
      }

      for (const b of blobs.current) {
        drawBlob(ctx, b, W, H)
        b.x += b.dir * b.speed
        const gone = b.dir > 0 ? b.x - b.rx > W + 50 : b.x + b.rx < -50
        if (gone) Object.assign(b, makeBlob(W, H, false))
      }


      const floor = ctx.createLinearGradient(0, H * 0.48, 0, H)
      floor.addColorStop(0, 'rgba(11,11,11,0)')
      floor.addColorStop(1, 'rgba(11,11,11,0.97)')
      ctx.fillStyle = floor
      ctx.fillRect(0, 0, W, H)

      const refl = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, W * 0.3)
      refl.addColorStop(0, 'rgba(60, 80, 180, 0.06)')
      refl.addColorStop(1, 'rgba(0,  0,  0,   0)')
      ctx.fillStyle = refl
      ctx.fillRect(0, H * 0.7, W, H * 0.3)

      rafRef.current = requestAnimationFrame(frame)
    }

    frame()
    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none motion-reduce:hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={`${styles.animationCanvas} absolute top-0 left-0 w-full h-full`}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
