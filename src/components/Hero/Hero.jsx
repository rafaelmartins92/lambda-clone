import HeroBackground from '../HeroBackground/HeroBackground'
import FontSwapHeading from '../FontSwapHeading/FontSwapHeading'

const btnBase =
  'appearance-none inline-flex py-[17px] px-9 border-0 cursor-pointer no-underline ' +
  'font-mono text-sm font-normal leading-relaxed tracking-widest uppercase ' +
  'justify-center items-center gap-[10px] text-center ' +
  'transition-[box-shadow,color,background] duration-100'

export default function Hero() {
  return (
    <section
      id="section-home-hero"
      className="relative flex flex-col items-center justify-center text-center w-full min-h-[calc(100dvh-100px)] bg-terminal pt-[clamp(100px,12vw,160px)] pb-[clamp(100px,12vw,160px)]"
    >
      <HeroBackground />

      <p className="font-sans text-[var(--color-neutral-100)] text-base font-semibold leading-snug mb-5 max-w-[98%] z-[1] md:text-[clamp(1.25rem,2.5vw,var(--text-lg))] md:max-w-[80%]">
        Supercomputers for training and inference
      </p>

      <h1 className="hidden motion-reduce:block relative z-[1] font-sans font-[var(--font-weight-semibold)] leading-none tracking-tighter text-[var(--color-text-primary)] text-[clamp(1.85rem,7vw,2.6rem)] xs:text-[3rem] md:text-[4.5rem] lg:text-[6rem] xl:text-[7.315rem]">
        <span>The Superintelligence <br /> Cloud</span>
      </h1>

      <FontSwapHeading />

      <div className="relative z-[1] w-full max-w-[1398px] mx-auto px-[15px]">
        <div className="flex flex-wrap flex-row gap-5 items-start justify-center mt-[50px]">
          <a
            href="https://www.orafadev.com.br/"
            className={`${btnBase} bg-shell text-terminal shadow-rgb hover:shadow-none`}
            aria-label="Launch GPU instance"
          >
            Launch GPU instance
          </a>
          <a
            href="https://www.orafadev.com.br/"
            className={`${btnBase} bg-ultraviolet text-shell hover:bg-[#815ef6]`}
            aria-label="Talk to our team"
          >
            Talk to our team
          </a>
        </div>
      </div>
    </section>
  )
}
