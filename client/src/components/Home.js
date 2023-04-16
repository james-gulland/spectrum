import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const Home = () => {

  const playRef = useRef(null)
  const pauseRef = useRef(null)
  const playBtnRef = useRef(null)
  const wave1Ref = useRef(null)
  const wave2Ref = useRef(null)
  const [playing, setPlaying] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/mixtapes/')
      console.log(data)
    }
    getData()
  })

  function handlePlayButtonClick() {
    pauseRef.current.classList.toggle('visibility')
    playRef.current.classList.toggle('visibility')
    playBtnRef.current.classList.toggle('shadow')
    wave1Ref.current.classList.toggle('paused')
    wave2Ref.current.classList.toggle('paused')
    setPlaying(!playing)
  }

  return (
    <>
      <div id="control-container" className="container">
        <div id="control-header-container">
          <h1>spectrum</h1>
        </div>
        <div id="control-main-container">
          <div id="control-artwork-container"><img src="https://i.ytimg.com/vi/gNSO_utZgGY/mqdefault.jpg"></img></div>
          {/* <div id="control-artwork-container"><img src="https://i.ytimg.com/vi/gNSO_utZgGY/hqdefault.jpg"></img></div> */}
          <div id="control-led-container">
            <div id="marquee" className="led track">
              <div className="marquee-text">Test Data</div>
            </div>
            <div id="mood-controls"></div>
          </div>
          <div id="control-volume-container"></div>
        </div>
        <div id="control-play-container">
          <div className="circle">
            <span className="circle__btn" ref={playBtnRef} onClick={handlePlayButtonClick}>
              <ion-icon class="pause" className={`pause ${playing ? 'visibility' : ''}`} name="pause" ref={pauseRef}></ion-icon>
              <ion-icon class="play" className={`play ${playing ? '' : 'visibility'}`} name="play" ref={playRef}></ion-icon>
            </span>
            <span className="circle__back-1 paused" ref={wave1Ref}></span>
            <span className="circle__back-2 paused" ref={wave2Ref}></span>
          </div>
        </div>
      </div>
    </>
  )

}

export default Home