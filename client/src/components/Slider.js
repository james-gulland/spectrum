import { useEffect, useRef } from 'react'

const Slider = () => {
  const containerRef = useRef(null)
  const btnRef = useRef(null)
  const colorRef = useRef(null)
  const tooltipRef = useRef(null)

  const onMouseMove = (e) => {
    e.preventDefault()
    const targetRect = containerRef.current.getBoundingClientRect()
    let x = e.pageX - targetRect.left + 10
    if (x > targetRect.width) {
      x = targetRect.width
    }
    if (x < 0) {
      x = 0
    }
    btnRef.current.x = x - 10
    btnRef.current.style.left = btnRef.current.x + 'px'

    // get the position of the button inside the container (%)
    const percentPosition = (btnRef.current.x + 10) / targetRect.width * 100

    // color width = position of button (%)
    colorRef.current.style.width = percentPosition + '%'

    // move the tooltip when button moves, and show the tooltip
    tooltipRef.current.style.left = btnRef.current.x - 5 + 'px'
    tooltipRef.current.style.opacity = 1

    // show the percentage in the tooltip
    tooltipRef.current.textContent = Math.round(percentPosition) + '%'
  }

  const onMouseUp = (e) => {
    window.removeEventListener('mousemove', onMouseMove)
    tooltipRef.current.style.opacity = 0

    btnRef.current.addEventListener('mouseover', function () {
      tooltipRef.current.style.opacity = 1
    })

    btnRef.current.addEventListener('mouseout', function () {
      tooltipRef.current.style.opacity = 0
    })
  }

  useEffect(() => {
    const container = containerRef.current
    const btn = btnRef.current
    dragElement(container, btn)
  }, [])

  const dragElement = (target, btn) => {
    target.addEventListener('mousedown', (e) => {
      onMouseMove(e)
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    })
  }

  return (
    <div className="slider">
      <div className="slider__box" ref={containerRef}>
        <span className="slider__btn" id="find" ref={btnRef}></span>
        <span className="slider__color" ref={colorRef}></span>
        <span className="slider__tooltip" ref={tooltipRef}>50%</span>
      </div>
    </div>
  )
}

export default Slider