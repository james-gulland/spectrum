import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const Home = () => {

  // references to html elements to target functionality
  const playRef = useRef(null)
  const pauseRef = useRef(null)
  const playBtnRef = useRef(null)
  const wave1Ref = useRef(null)
  const wave2Ref = useRef(null)
  
  // play states
  const [playing, setPlaying] = useState(null)

  // core data storage for user's mixtapes in profile
  const [mixtapes, setMixtapes] = useState([])
    
  // ! On Mount
  useEffect(() => {
    const getData = async () => {
      try { 
        const { data } = await axios.get('/api/mixtapes/')
        setMixtapes(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [])

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
            <div id="mood-controls">
              <div className="segmented-control">
              
                <input type="radio" name="radio2" value="3" id="tab-1" checked/>
                <label htmlFor="tab-1" className="segmented-control__1">
                  <p>Focus</p></label>
                
                <input type="radio" name="radio2" value="4" id="tab-2" />
                <label htmlFor="tab-2" className="segmented-control__2">
                  <p>Chill</p></label>
                
                <input type="radio" name="radio2" value="5" id="tab-3" />
                <label htmlFor="tab-3" className="segmented-control__3">
                  <p>Energy</p></label>
                
                <div className="segmented-control__color"></div>
              </div>
            </div>
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
      {/* <div>
        <h2>playlist</h2>
      </div> */}
      <div id="grid-container">
        {mixtapes.length > 0 ? 
          mixtapes.map(mixtape => {
            const { id, artist_name: artistName, track_name: trackName, artwork_url: artworkUrl } = mixtape 
            return (
              <div key={id} className="mixtape-card">
                {/* <div id="mixtape-card-artwork"><img src={artworkUrl}></img></div> */}
                <div id="mixtape-card-artwork" style={{ backgroundImage: `url(${artworkUrl})` }}></div>
                <div>{artistName}: {trackName}</div>
              </div>
            )
          })
          :
          <>
            {console.log('error')}
          </>
        }
        <div className="mixtape-card checked">
          <div>Add</div>
        </div>
      </div>
    </>
  )

}

export default Home