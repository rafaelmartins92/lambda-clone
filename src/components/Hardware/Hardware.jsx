import { useState } from 'react'
import styles from './Hardware.module.css'

const PRODUCTS = [
  { title: 'NVIDIA VR200 NVL72', description: 'Rack-scale systems optimized for agentic AI.', image: '/images/VR200.jpg', alt: 'NVIDIA VR200 NVL72' },
  { title: 'NVIDIA GB300 NVL72', description: 'Rack-scale systems optimized for AI reasoning', image: '/images/gb300.png', alt: 'NVIDIA GB300 NVL72' },
  { title: 'NVIDIA HGX B300', description: 'Peak performance per watt for the largest training runs', image: '/images/hgx-b300.webp', alt: 'NVIDIA HGX B300' },
  { title: 'NVIDIA HGX B200', description: 'Versatile fine-tuning and inference', image: '/images/b200.png', alt: 'NVIDIA HGX B200' },
]

export default function Hardware() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imgErrors, setImgErrors] = useState({})

  function handleImgError(i) {
    setImgErrors(prev => ({ ...prev, [i]: true }))
  }

  return (
    <section className="bg-terminal">
      <div className="max-w-[1398px] mx-auto px-[15px] pt-[clamp(100px,12vw,160px)] pb-[clamp(100px,12vw,160px)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-0">
          <div className="w-full md:w-7/12 grid-margin-x">
            <h2 className="font-sans text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.1] tracking-tight text-shell">
              The engines of<br />superintelligence
            </h2>
          </div>
          <div className="w-full md:w-5/12 grid-margin-x">
            <p className="font-mono text-base font-normal leading-relaxed text-shell md:pt-10">
              Give your team the computational precision to train foundation models and serve inference at global scale.
            </p>
          </div>
        </div>

        <div className="flex flex-row justify-start gap-2 mt-20 h-[610px] max-md:flex-col max-md:h-auto">
          {PRODUCTS.map((product, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={i}
                type="button"
                className={`${styles.hwCard} block relative bg-terminal-deep border border-neutral-800 cursor-pointer text-left overflow-visible h-[610px] flex-[1_1_240px] max-md:h-auto max-md:min-h-[300px] max-md:!flex-none${isActive ? ' basis-[46%]' : ''}`}
                aria-expanded={isActive}
                onClick={() => setActiveIndex(i)}
              >
                <div className={`flex absolute inset-0 overflow-hidden items-start justify-center max-md:relative max-md:h-[300px]${isActive ? ' [mix-blend-mode:normal]' : ' [mix-blend-mode:luminosity]'}`}>
                  <img
                    src={product.image}
                    alt={product.alt}
                    width={410}
                    height={410}
                    className="block w-[410px] h-[410px] max-w-[610px] flex-shrink-0 object-cover"
                    onError={() => handleImgError(i)}
                    style={{ display: imgErrors[i] ? 'none' : undefined }}
                  />
                </div>

                <div className="flex static w-full h-full flex-col items-start justify-end overflow-hidden">
                  <div className={`${styles.hwTextPanel} relative w-full px-10 py-10 opacity-90 bg-terminal-deep box-border max-md:static max-md:!h-auto${isActive ? ' h-[300px]' : ' h-[132px]'}`}>
                    <h3 className="font-sans text-2xl font-semibold leading-[1.3] tracking-[-0.01em] text-shell m-0 mb-[-10px] p-0">
                      {product.title}
                    </h3>
                    <p className={`${styles.hwDescription} font-mono text-base font-normal leading-6 text-[var(--color-text-secondary)] mt-5 absolute h-[170px] top-[85px] left-0 px-10 max-md:relative max-md:top-auto max-md:left-auto max-md:px-0 max-md:h-auto max-md:opacity-100 max-md:visible max-md:translate-y-0 max-md:transition-none${isActive ? ' opacity-100 visible translate-y-0' : ' opacity-0 invisible -translate-y-5'}`}>
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className={`${styles.hwIndicator} block w-[calc(100%+2px)] h-[10px] -ml-px mt-2 max-md:hidden${isActive ? ' bg-ultraviolet' : ' bg-shell'}`} />
              </button>
            )
          })}
        </div>

      </div>
    </section>
  )
}
