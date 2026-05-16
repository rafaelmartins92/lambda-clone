const COS  = 0.866
const SIN  = 0.5
const W    = 118
const D    = 70
const SH   = 36
const STEP = 2 * D * SIN + SH - 20

const OX   = 282
const OY0  = 152
const VW   = 670
const VH   = 660

function iso(r, d, slab) {
  return [
    OX + (r - d) * COS * W,
    OY0 + slab * STEP + (r + d) * SIN * D,
  ]
}

function pts(corners) { return corners.map(p => p.join(',')).join(' ') }

const ACCENT       = '#6236F4'
const ACCENT_MUTED = '#b0afa6'
const EDGE         = 'rgba(255,255,255,0.15)'
const TEXT_COLOR   = '#e7e6d9'
const GAP_OFFSET   = 50

// ── Per-slab labels ──────────────────────────────────────────────────────────
const LABELS = [
  'Purpose-built datacenters',
  'AI infrastructure',
  'Managed services',
  'Co-engineering',
]


function DotGrid({ slab }) {
  const dots = []
  const steps = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]
  steps.forEach(r => steps.forEach(d => {
    const [x, y] = iso(r, d, slab)
    dots.push(<circle key={`${r}${d}`} cx={x} cy={y} r={1.3} fill="rgba(255,255,255,0.32)" />)
  }))
  return <g>{dots}</g>
}

function SquareSymbol({ slab, isActive }) {
  const s = 1
  const corners = [iso(-s,-s,slab), iso(s,-s,slab), iso(s,s,slab), iso(-s,s,slab)]
  const mainStroke = isActive ? ACCENT_MUTED : ACCENT
  return (
    <g>
      <polygon points={pts(corners)} fill="rgba(98,54,244,0.18)" stroke={mainStroke} strokeWidth="1.4" />
      <polygon
        points={pts(corners.map(([x, y]) => [x + 1, y - 1]))}
        fill="none" stroke="#00e6ff" strokeWidth="0.7" opacity="0.65"
      />
      <polygon
        points={pts(corners.map(([x, y]) => [x - 1, y + 1]))}
        fill="none" stroke="#ff0060" strokeWidth="0.5" opacity="0.5"
      />
    </g>
  )
}

function TargetRings({ slab, isActive }) {
  const [cx, cy] = iso(0, 0, slab)
  const rx0 = COS * W
  const ry0 = SIN * D
  const mainStroke = isActive ? ACCENT_MUTED : ACCENT
  return (
    <g>
      {[0.28, 0.52, 0.76, 1.0].map((scale, i) => {
        const rx = rx0 * scale * 1
        const ry = ry0 * scale * 1
        const isOuter = i === 3
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none"
              stroke={isOuter ? mainStroke : `rgba(${i % 2 === 0 ? '98,54,244' : '255,255,255'},${0.55 - i * 0.08})`}
              strokeWidth={isOuter ? 1.6 : 0.9}
            />
            {isOuter && (
              <>
                <ellipse cx={cx + 1} cy={cy - 1} rx={rx} ry={ry} fill="none" stroke="#00e6ff" strokeWidth="0.7" opacity="0.6" />
                <ellipse cx={cx - 1} cy={cy + 1} rx={rx} ry={ry} fill="none" stroke="#ff0060" strokeWidth="0.5" opacity="0.5" />
              </>
            )}
          </g>
        )
      })}
    </g>
  )
}

function EllipseSymbol({ slab, isActive }) {
  const [cx, cy] = iso(0, 0, slab)
  const rx = COS * W * 1
  const ry = SIN * D * 1
  const dots = []
  const steps = [-0.35, -0.175, 0, 0.175, 0.35]
  steps.forEach(r => steps.forEach(d => {
    const [x, y] = iso(r * 0.55, d * 0.55, slab)
    const nx = (x - cx) / rx, ny = (y - cy) / ry
    if (nx * nx + ny * ny < 0.88) {
      dots.push(<circle key={`${r}${d}`} cx={x} cy={y} r={1.1} fill="rgba(255,255,255,0.35)" />)
    }
  }))
  const mainStroke = isActive ? ACCENT_MUTED : ACCENT
  return (
    <g>
      {dots}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={mainStroke} strokeWidth="1.6" />
      <ellipse cx={cx + 1} cy={cy - 1} rx={rx} ry={ry} fill="none" stroke="#00e6ff" strokeWidth="0.7" opacity="0.6" />
      <ellipse cx={cx - 1} cy={cy + 1} rx={rx} ry={ry} fill="none" stroke="#ff0060" strokeWidth="0.5" opacity="0.5" />
    </g>
  )
}

const SYMBOLS = [DotGrid, SquareSymbol, TargetRings, EllipseSymbol]

function RgbBorder({ slab }) {
  const corners = [iso(-1,-1,slab), iso(1,-1,slab), iso(1,1,slab), iso(-1,1,slab)]
  return (
    <g>
      <polygon points={pts(corners.map(([x,y]) => [x+1.2,y-1.2]))} fill="none" stroke="#00e6ff" strokeWidth="1" opacity="0.7" />
      <polygon points={pts(corners.map(([x,y]) => [x-1.2,y+1.2]))} fill="none" stroke="#ff0060" strokeWidth="0.8" opacity="0.55" />
      <polygon points={pts(corners)} fill="none" stroke={ACCENT_MUTED} strokeWidth="1.6" />
    </g>
  )
}


function Slab({ slab, isActive }) {
  const tl = iso(-1,-1,slab), tr = iso(1,-1,slab)
  const br = iso( 1, 1,slab), bl = iso(-1, 1,slab)
  const trB = [tr[0], tr[1]+SH], brB = [br[0], br[1]+SH], blB = [bl[0], bl[1]+SH]

  const lx = (tl[0]+tr[0]+br[0]+bl[0])/4
  const ly = (tl[1]+tr[1]+br[1]+bl[1])/4

  const stroke = isActive ? 'none' : EDGE
  const sw     = 0.6
  const fill   = isActive ? 'rgba(98,54,244,0.09)' : 'rgba(255,255,255,0.02)'

  const Symbol = isActive ? SYMBOLS[slab] : null

  return (
    <g>
      <polygon points={pts([tr,br,brB,trB])} fill="rgba(255,255,255,0.05)" stroke={isActive ? ACCENT_MUTED : EDGE} strokeWidth={sw} />
      <polygon points={pts([br,bl,blB,brB])} fill="rgba(0,0,0,0.22)" stroke={isActive ? ACCENT_MUTED : EDGE} strokeWidth={sw} />
      <polygon points={pts([tl,tr,br,bl])} fill={fill} stroke={stroke} strokeWidth={sw} />
      {Symbol && <Symbol slab={slab} isActive={isActive} />}
      {isActive && <RgbBorder slab={slab} />}
      <text
        x={(bl[0] + br[0]) / 2} y={(bl[1] + blB[1]) / 2 + 8}
        fill={TEXT_COLOR}
        fontSize="12"
        fontFamily="'Suisse Intl Mono','Courier New',monospace"
        letterSpacing="0.05em"
        textAnchor="middle"
        transform={`rotate(20, ${(bl[0] + br[0]) / 2 - 80}, ${(bl[1] + blB[1]) / 2 + 8})`}
        style={{ userSelect: 'none' }}
      >
        {LABELS[slab]}
      </text>
    </g>
  )
}

export default function IsometricIllustration({ activeIndex = 0 }) {
  const getSlabOffset = (slabIndex) => {
    if (activeIndex > 0 && slabIndex >= activeIndex) {
      return GAP_OFFSET
    }
    return 0
  }

  return (
    <div style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: '100%', height: 'auto' }}
      >
        {[3, 2, 1, 0].map(i => {
          const offset = getSlabOffset(i)
          return (
            <g
              key={i}
              style={{
                transform: `translateY(${offset}px)`,
                transition: 'transform 420ms cubic-bezier(0.6,0,0.4,1)',
              }}
            >
              <Slab slab={i} isActive={i === activeIndex} />
            </g>
          )
        })}

        {[
          { text: 'AI DEVELOPERS',     frac: 1.5 },
          { text: 'ENTERPRISE',        frac: 2.5 },
          { text: 'SUPERINTELLIGENCE', frac: 3.5 },
        ].map(({ text, frac }, i) => {
          const [x, y] = iso(1, -1, frac)
          const offset = activeIndex > 0 && frac > activeIndex ? GAP_OFFSET : 0
          return (
            <text key={i} x={x + 11} y={y + 4 + offset}
              fill={TEXT_COLOR} fontSize="11"
              fontFamily="'Suisse Intl Mono','Courier New',monospace"
              letterSpacing="0.08em"
              style={{ 
                userSelect: 'none',
                transition: 'transform 420ms cubic-bezier(0.6,0,0.4,1)',
                transform: `translateY(0px)`
              }}
            >
              {text}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
