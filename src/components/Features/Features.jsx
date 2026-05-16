import { useState } from 'react'
import IsometricIllustration from '../IsometricIllustration/IsometricIllustration'
import styles from './Features.module.css'

const ITEMS = [
  {
    number: '01',
    title: 'You bring models. We bring the compute.',
    body: 'Get complete AI factories integrating high-density power, liquid cooling, and NVIDIA GPUs into one system designed for peak AI performance.',
    locked: true,
  },
  {
    number: '02',
    title: 'Your supercomputer. Your rules.',
    body: 'Accelerate every stage of your AI lifecycle. Train foundation models and serve billions of tokens.',
  },
  {
    number: '03',
    title: 'Orchestration, handled.',
    body: 'Run large-scale AI workloads without the operational burden. We manage your clusters so you can focus on innovation.',
  },
  {
    number: '04',
    title: 'Experts included.',
    body: "Co-engineer your workloads with the very people building the infrastructure behind the world's most advanced models.",
  },
]

export default function Features() {
  const [openIndex, setOpenIndex] = useState(0)

  function toggle(i) {
    setOpenIndex(i)
  }

  return (
    <section className="relative bg-terminal pt-[clamp(100px,12vw,160px)] pb-[clamp(100px,12vw,160px)]">
      <div className="absolute top-0 left-0 w-full h-px bg-[var(--color-background-gray)]" />

      <div className="w-full max-w-[1398px] mx-auto px-[15px]">
        <div className="flex flex-col gap-[80px]">
          <div className="w-full lg:w-[calc(58.333%-1.875rem)]">
            <h2 className="font-sans font-[var(--font-weight-semibold)] leading-tight tracking-tighter text-[var(--color-text-primary)] text-[clamp(2.3rem,6vw,4.5rem)]">
              Built for AI. Ready for superintelligence.
            </h2>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="w-full lg:w-[calc(58.333%-1rem)]">
              <div className="w-full">
                {ITEMS.map((item, i) => {
                  const isOpen = i === openIndex
                  return (
                    <div
                      key={i}
                      className={`flex flex-row gap-[clamp(20px,5vw,45px)] py-[35px] border-b border-neutral-800${i === 0 ? ' border-t' : ''}`}
                    >
                      <div className="flex-shrink-0">
                        <span
                          className={`${styles.accordionNumber} font-mono font-normal text-[clamp(1.5rem,3vw,2.15rem)] font-reguylar leading-snug tracking-tight text-shell`}
                          aria-hidden="true"
                        >
                          {item.number}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col">
                        <h3 className="m-0">
                          <button
                            type="button"
                            className="appearance-none flex w-full p-0 border-0 bg-transparent cursor-pointer text-left items-center justify-between"
                            aria-expanded={isOpen}
                            data-locked={item.locked || undefined}
                            onClick={() => toggle(i)}
                          >
                            <span className="font-sans text-[clamp(1.5rem,3vw,2.15rem)] font-semibold leading-snug tracking-tight text-shell block hover:opacity-70 transition-opacity duration-100">
                              {item.title}
                            </span>
                            <span
                              className="text-2xl font-light text-shell ml-4 flex-shrink-0 select-none transition-transform duration-100"
                              aria-hidden="true"
                            >
                              {isOpen ? '−' : '+'}
                            </span>
                          </button>
                        </h3>
                        <div
                          className={`${styles.accordionBody}${isOpen ? ` ${styles.accordionBodyOpen}` : ''}`}
                          role="region"
                          {...(!isOpen ? { inert: '' } : {})}
                        >
                          <p className="leading-[1.6] m-0">{item.body}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="w-full lg:w-[calc(41.667%-1rem)]">
              <div className="relative mt-5 lg:-mt-10 lg:pl-10 aspect-[691/883] lg:aspect-[883/1128] w-auto max-w-full">
                <IsometricIllustration activeIndex={openIndex} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
