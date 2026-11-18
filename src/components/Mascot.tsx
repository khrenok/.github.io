import { useEffect, useRef } from 'react'

const EYE_LEFT = 'M399 393 H494 V404 C490 424 472 435 446 435 C420 435 402 424 399 404 Z'
const EYE_RIGHT = 'M548 393 H643 V404 C639 424 621 435 595 435 C569 435 551 424 548 404 Z'

function clamp(value: number) {
  return Math.min(1, Math.max(-1, value))
}

export default function Mascot() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const pointerQuery = window.matchMedia('(pointer: fine)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let enabled = pointerQuery.matches && !motionQuery.matches
    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const paint = () => {
      stage.style.setProperty('--look-x', `${currentX.toFixed(2)}px`)
      stage.style.setProperty('--look-y', `${currentY.toFixed(2)}px`)
    }

    const animate = () => {
      frame = 0
      currentX += (targetX - currentX) * 0.16
      currentY += (targetY - currentY) * 0.16
      paint()

      if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(animate)
    }

    const reset = () => {
      targetX = 0
      targetY = 0
      if (!enabled) {
        currentX = 0
        currentY = 0
        if (frame) window.cancelAnimationFrame(frame)
        frame = 0
        paint()
      } else {
        schedule()
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled) return
      const rect = stage.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        reset()
        return
      }

      const eyeCenterX = rect.left + rect.width / 2
      const eyeCenterY = rect.top + rect.height * 0.4
      targetX = clamp((event.clientX - eyeCenterX) / (rect.width * 0.9)) * 12
      targetY = clamp((event.clientY - eyeCenterY) / (rect.height * 0.7)) * 5
      schedule()
    }

    const onPreferenceChange = () => {
      enabled = pointerQuery.matches && !motionQuery.matches
      reset()
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    pointerQuery.addEventListener('change', onPreferenceChange)
    motionQuery.addEventListener('change', onPreferenceChange)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
      pointerQuery.removeEventListener('change', onPreferenceChange)
      motionQuery.removeEventListener('change', onPreferenceChange)
    }
  }, [])

  return (
    <div className="mascot-stage" ref={stageRef}>
      <picture>
        <source srcSet="./images/mascot-640.webp 640w, ./images/mascot.webp 1024w" sizes="(max-width: 800px) 88vw, 42vw" type="image/webp" />
        <img src="./images/mascot.webp" width="1024" height="1024" alt="Маскот NodeTrace — пингвин-инженер с кофе на фоне терминала" fetchPriority="high" />
      </picture>
      <svg className="mascot-eyes" viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="mascot-eye-left" clipPathUnits="userSpaceOnUse"><path d={EYE_LEFT} /></clipPath>
          <clipPath id="mascot-eye-right" clipPathUnits="userSpaceOnUse"><path d={EYE_RIGHT} /></clipPath>
        </defs>

        <g clipPath="url(#mascot-eye-left)">
          <path className="mascot-eye-white" d={EYE_LEFT} />
          <g className="mascot-pupil"><circle cx="446" cy="397" r="28" /></g>
          <path className="mascot-blink-lid" d={EYE_LEFT} />
        </g>
        <path className="mascot-eye-outline" d="M399 403 C402 424 420 435 446 435 C472 435 490 424 494 403" />
        <path className="mascot-upper-lid" d="M399 393 H494 V407 H399 Z" />

        <g clipPath="url(#mascot-eye-right)">
          <path className="mascot-eye-white" d={EYE_RIGHT} />
          <g className="mascot-pupil"><circle cx="595" cy="397" r="28" /></g>
          <path className="mascot-blink-lid" d={EYE_RIGHT} />
        </g>
        <path className="mascot-eye-outline" d="M548 403 C551 424 569 435 595 435 C621 435 639 424 643 403" />
        <path className="mascot-upper-lid" d="M548 393 H643 V407 H548 Z" />

        <g className="mascot-steam">
          <path d="M799 486 C781 463 812 447 799 424 C786 402 814 388 808 360" />
          <path d="M835 486 C817 460 851 443 835 417 C820 393 851 378 842 346" />
          <path d="M869 486 C852 464 881 446 867 424 C854 403 880 390 873 365" />
        </g>
      </svg>
    </div>
  )
}
