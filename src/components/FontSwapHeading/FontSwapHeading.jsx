import { useState, useEffect, useRef } from 'react'

const SEG_THE = 'The '
const SEG_SI  = 'Superintelligence'
const SEG_CL  = 'Cloud'

const SI_START = SEG_THE.length
const CL_START = SEG_THE.length + SEG_SI.length

const ISLANDS = [
  [SI_START + 1],
  [SI_START + 13],
  [CL_START + 2],
]

const OVERLAY_BASE = {
  position: 'absolute',
  left:  '-7px',
  top:   '0px',
  fontFamily: 'var(--font-pixel)',
  fontWeight: 300,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
}

const HIGHLIGHT_OVERLAY = {
  ...OVERLAY_BASE,
  color:           'var(--color-text-primary-dark)',
  backgroundColor: 'var(--color-background-light)',
  mixBlendMode:    'screen',
  boxShadow:       'var(--box-shadow-rgb)',
}

const PIXEL_OVERLAY = {
  ...OVERLAY_BASE,
  textShadow: 'var(--text-shadow-rgb)',
}

function renderSegment(text, globalStart, stateMap) {
  return text.split('').map((ch, j) => {
    const idx     = globalStart + j
    const variant = stateMap.get(idx)

    if (variant === 'highlight' || variant === 'pixel') {
      const overlayStyle = variant === 'highlight' ? HIGHLIGHT_OVERLAY : PIXEL_OVERLAY
      return (
        <span key={j} style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{ visibility: 'hidden' }}>{ch}</span>
          <span style={overlayStyle}>{ch}</span>
        </span>
      )
    }

    return <span key={j}>{ch}</span>
  })
}export default function FontSwapHeading() {
  const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')
  const [stateMap, setStateMap] = useState(() => {
    if (debug) {
      return new Map([
        [SI_START + 1,  'highlight'],
        [SI_START + 13, 'pixel'],
        [CL_START + 2,  'pixel'],
      ])
    }
    return new Map()
  })
  const timerRef = useRef(null)

  useEffect(() => {
    if (debug) return
    let alive = true

    function clearTimer() { clearTimeout(timerRef.current) }

    function applyVariant(indices, variant) {
      setStateMap(prev => {
        const next = new Map(prev)
        indices.forEach(i => {
          if (variant === null) next.delete(i)
          else next.set(i, variant)
        })
        return next
      })
    }

    function animateIsland(indices, onDone) {
      applyVariant(indices, 'highlight')

      timerRef.current = setTimeout(() => {
        if (!alive) return
        applyVariant(indices, 'pixel')

        timerRef.current = setTimeout(() => {
          if (!alive) return
          applyVariant(indices, null)
          onDone?.()
        }, 500)
      }, 500)
    }

    let islandIndex = 0
    function nextIsland() {
      if (!alive) return
      const island = ISLANDS[islandIndex % ISLANDS.length]
      islandIndex++
      animateIsland(island, () => {
        timerRef.current = setTimeout(nextIsland, 1000)
      })
    }

    timerRef.current = setTimeout(nextIsland, 1200)

    return () => {
      alive = false
      clearTimer()
    }
  }, [])

  return (
    <h1 className="z-[1] font-sans font-[var(--font-weight-semibold)] leading-none tracking-tighter text-[var(--color-text-primary)] text-[clamp(1.85rem,7vw,2.6rem)] xs:text-[3rem] md:text-[4.5rem] lg:text-[6rem] xl:text-[7.315rem]">
      <span className="sr-only">The Superintelligence Cloud</span>

      <span aria-hidden="true">
        {renderSegment(SEG_THE, 0, stateMap)}

        <span className="no-wrap">
          {renderSegment(SEG_SI, SI_START, stateMap)}
        </span>

        <br />

        {renderSegment(SEG_CL, CL_START, stateMap)}
      </span>
    </h1>
  )
}
