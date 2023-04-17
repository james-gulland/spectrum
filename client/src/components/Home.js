import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import ReactPlayer from 'react-player'

const Home = () => {

  // DATA STATE: setting state for database query of user's mixtapes
  const [mixtapes, setMixtapes] = useState([])

  // STATES: play states for ReactPlayer
  const [playing, setPlaying] = useState(false) // is there a mixtape playing?  True or False.  Down with auto-play!
  const [currentArtist, setCurrentArtist] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null) 
  const [currentSource, setCurrentSource] = useState(null)  // setting the source (i.e. soundcloud / youtube)
  const [currentSourceUrl, setCurrentSourceUrl] = useState(null) 
  const [currentArtworkUrl, setCurrentArtworkUrl] = useState(null)

  // REF: references to html elements to target functionality
  const playRef = useRef(null)
  const pauseRef = useRef(null)
  const playBtnRef = useRef(null)
  const wave1Ref = useRef(null)
  const wave2Ref = useRef(null)
    
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

  // when clicking the play button, we change the state of the play and update SCSS references
  function handlePlayButtonClick() {
    pauseRef.current.classList.toggle('visibility')
    playRef.current.classList.toggle('visibility')
    playBtnRef.current.classList.toggle('shadow')
    wave1Ref.current.classList.toggle('paused')
    wave2Ref.current.classList.toggle('paused')
    setPlaying(!playing)
  }

  // when clicking mixtapes in the grid, it changes the current mixtape to play in ReactPlayer and updates UI elements
  function handleChangeMixtape(artistName, trackName, channelSource, sourceUrl, artworkUrl) {
    setCurrentArtist(artistName)
    setCurrentTrack(trackName)
    setCurrentSource(channelSource)
    setCurrentSourceUrl(sourceUrl)
    setCurrentArtworkUrl(artworkUrl)
  }

  return (
    <>
      <div id="control-container" className="container">
        <div id="control-header-container">
          <h1>spectrum</h1>
        </div>
        <div id="control-main-container">
          <div id="control-player-container">
            {/* <img src="https://i.ytimg.com/vi/gNSO_utZgGY/mqdefault.jpg"></img> */}

            {currentSource === 'youtube' ? (
              <ReactPlayer className="react-player" playing={playing} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
              // <ReactPlayer className="react-player" playing={playing} onStart={handleStart} onProgress={handlePlayTimer} onPlay={handlePlayButtonClick} onPause={handlePlayButtonClick}
                url={currentSourceUrl}
                volume={0.5}
                width='100%'
                height='280px'
                config={{
                  youtube: {
                    options: { visual: false, show_artwork: false }, 
                  },
                }}
              />
            ) : (
              <>
                <img src={currentArtworkUrl}></img>
                <ReactPlayer className="react-player" playing={playing} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
                // <ReactPlayer className="react-player" playing={playing} onStart={handleStart} onProgress={handlePlayTimer} onPlay={handlePlayButtonClick} onPause={handlePlayButtonClick}
                  url={currentSourceUrl}
                  volume={0.5}
                  width='0'
                  height='0'
                  config={{
                    soundcloud: {
                      // options: { visual: false, show_artwork: false, color: '#6d5dfc' }, 
                      options: { visual: false, show_artwork: false }, 
                    },
                  }}
                />
              </>
            )}
          </div>
          
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
            const { id, artist_name: artistName, track_name: trackName, channel_source: channelSource, source_url: sourceUrl, artwork_url: artworkUrl } = mixtape 
            return (
              <div key={id} className="mixtape-card" onClick={() => handleChangeMixtape(artistName, trackName, channelSource, sourceUrl, artworkUrl)}>
                <div className="mixtape-card-artwork" style={{ backgroundImage: `url(${artworkUrl})` }}></div>
                <div className="mixtape-card-info">{artistName}: {trackName}</div>
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