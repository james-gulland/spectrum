import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import ReactPlayer from 'react-player'
import { getUserID, authenticated, isAuthenticated } from '../helpers/auth'
import { Link } from 'react-router-dom'
import spectrumWave from '../images/geometric.jpeg'

const Home = () => {

  // DATA STATE: setting state for database query of user's mixtapes
  const [mixtapes, setMixtapes] = useState([])

  // STATES: specific states for the mixtape information
  const [currentArtist, setCurrentArtist] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null) 
  const [currentSource, setCurrentSource] = useState(null)  // setting the source (i.e. soundcloud / youtube)
  const [currentSourceUrl, setCurrentSourceUrl] = useState(null) 
  const [currentArtworkUrl, setCurrentArtworkUrl] = useState(null)
  const [selectedMood, setSelectedMood] = useState('all') // default to All

  
  // STATES: play states for ReactPlayer
  const [playing, setPlaying] = useState(false) // is there a mixtape playing?  True or False.  Down with auto-play!
  const [currentTime, setCurrentTime] = useState(0)
  const [currentMaxDuration, setCurrentMaxDuration] = useState(0) 
  const [currentVolume, setCurrentVolume] = useState(0.5)
  const [ledText, setLedText] = useState('Welcome to Spectrum')

  // REF: references to html elements to target functionality
  const reactPlayerRef = useRef(null)
  const playBtnRef = useRef(null)
  const playRef = useRef(null)
  const pauseRef = useRef(null)
  const wave1Ref = useRef(null)
  const wave2Ref = useRef(null)
  const marqueeRef = useRef(null)
    
  // ! On Mount
  useEffect(() => {
    const getData = async () => {
      try { 
        if (isAuthenticated()){
          const { data } = await authenticated.get('/api/mixtapes/')
          setMixtapes(data)
          console.log(data)
          console.log('user id:', getUserID())
        }
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [])

  // update the LED container with scrolling text if too long (updates when playing)
  useEffect(() => {
    const marqueeTextElement = marqueeRef.current.querySelector('.marquee-text')
    const isOverflowing = marqueeTextElement.offsetWidth > marqueeRef.current.offsetWidth
    // console.log(marqueeTextElement.offsetWidth, marqueeRef.current.offsetWidth)

    if (isOverflowing) {
      setTimeout(() => {
        marqueeTextElement.classList.add('scroll')
        // console.log(marqueeTextElement.offsetWidth, marqueeRef.current.offsetWidth)
      }, 0)
    }
  }, [playing])

  // when clicking the play button, change the state of the play and update SCSS references
  function handlePlayButtonClick() {
    if (currentArtist) {
      pauseRef.current.classList.toggle('visibility')
      playRef.current.classList.toggle('visibility')
      playBtnRef.current.classList.toggle('shadow')
      wave1Ref.current.classList.toggle('paused')
      wave2Ref.current.classList.toggle('paused')
      setPlaying(!playing)
    } else {
      setLedText('Please load track...')
    }

  }

  // when clicking mixtapes in the grid, it changes the current mixtape to play in ReactPlayer and updates UI elements
  function handleChangeMixtape(artistName, trackName, channelSource, sourceUrl, artworkUrl) {
    setCurrentArtist(artistName)
    setCurrentTrack(trackName)
    setCurrentSource(channelSource)
    setCurrentSourceUrl(sourceUrl)
    setCurrentArtworkUrl(artworkUrl)
    setLedText(artistName + ': ' + trackName)

    const mixtapeCards = document.querySelectorAll('.mixtape-card')
    mixtapeCards.forEach(card => {
      if (card.classList.contains('checked')) {
        card.classList.remove('checked')
      }
    })

    const clickedCard = event.target.closest('.mixtape-card')
    clickedCard.classList.add('checked')

  }

  // updates current time with progress from ReactPlayer callback prop (onProgress) to be used for labels + progress bar
  function handleProgress(progress) {
    const { playedSeconds } = progress
    setCurrentTime(playedSeconds)
  }

  // updates current time based on seeking new time with progress bar
  function handleSeek(e){
    // update the state with current time + make sure ReactPlayer updates too
    const seekTime = e.target.value
    setCurrentTime(seekTime)
    reactPlayerRef.current.seekTo(seekTime)
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.round(totalSeconds % 60)
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
    return `${minutes}:${formattedSeconds}`
  }

  const handleMoodChange = (e) => {
    // setSelectedMood(Number(e.target.value)) // convert value to number
    setSelectedMood(e.target.value)
  }

  function filterMixtapes() {
    if (selectedMood === 'all') {
      return mixtapes
    } else {
      return mixtapes.filter((mixtape) =>
        mixtape.moods.some((mood) => mood.name === selectedMood)
      )
    }
  }

  function handleIcon(source) {
    if (source === 'youtube') {
      return <ion-icon name="logo-youtube"></ion-icon>
    } else if (source === 'soundcloud') {
      
      // unfortunately the below link is broken, using temporary icon :(
      // return <ion-icon name="logo-soundcloud"></ion-icon>
      return <ion-icon name="cloud"></ion-icon>
    }
  }

  return (
    <>
      <div id="control-container" className="container">
        <div id="control-header-container">
          <h1>spectrum</h1>
        </div>
        <div id="control-main-container">
          <div id="control-player-container">
            {currentSource === 'youtube' ? (
              <ReactPlayer className="react-player" playing={playing} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onProgress={handleProgress} onDuration={setCurrentMaxDuration}
                url={currentSourceUrl}
                ref={reactPlayerRef}
                volume={currentVolume}
                width='100%'
                height='100%'
                config={{
                  // youtube: {
                  //   options: { visual: false, show_artwork: false }, 
                  // },
                }}
              />
            ) : (
              <>
                <img src={currentArtworkUrl ? currentArtworkUrl : spectrumWave}></img>
                <ReactPlayer className="react-player" playing={playing} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onProgress={handleProgress} onDuration={setCurrentMaxDuration}
                  url={currentSourceUrl}
                  ref={reactPlayerRef}
                  volume={currentVolume}
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
            <div id="marquee" className="led track" ref={marqueeRef}>
              {/* <div className="marquee-text">{currentArtist ? currentArtist + ': ' + currentTrack : 'Welcome to Spectrum'}</div> */}
              <div className="marquee-text">{ledText}</div>
            </div>
            <div id="mood-controls">
              <form id="mood-radio" onChange={handleMoodChange}>
                <div className="radio-control main">
                  
                  <input type="radio" name="radio2" value="all" id="tab-0" defaultChecked/>
                  <label htmlFor="tab-0" className="radio-control__0">
                    <p>All</p></label>

                  <input type="radio" name="radio2" value="focus" id="tab-1"/>
                  <label htmlFor="tab-1" className="radio-control__1">
                    <p>Focus</p></label>
                  
                  <input type="radio" name="radio2" value="chill" id="tab-2" />
                  <label htmlFor="tab-2" className="radio-control__2">
                    <p>Chill</p></label>
                  
                  <input type="radio" name="radio2" value="energy" id="tab-3" />
                  <label htmlFor="tab-3" className="radio-control__3">
                    <p>Energy</p></label>
                  
                  <div className="radio-control__color"></div>
                  
                </div>
              </form>  
            </div>
          </div>
          <div id="control-volume-container">
            <div id="nav-container">
              <div id="profile">
                {isAuthenticated() ?
                  <Link className="profile" to={`profile/${getUserID()}`} as={Link}><ion-icon name="person"></ion-icon></Link>
                  :
                  <Link className="profile" to={'hi'} as={Link}><ion-icon name="person"></ion-icon></Link>
                }
              </div>
            </div>
            <div id="volume-container">
              <div className="volume">
                {/* <Slider /> */}
                <label htmlFor="volume">Volume</label>
                <input type="range" name="volume" id="volume-bar" value={currentVolume} min="0" max="1" step="0.01" onChange={(e) => setCurrentVolume(parseFloat(e.target.value))}/>
              </div>
            </div>
          </div>
        </div>
        <div id="control-seek-container">
          <div className="circle">
            <span className="circle__btn" ref={playBtnRef} onClick={handlePlayButtonClick}>
              <ion-icon class="pause" className={`pause ${playing ? 'visibility' : ''}`} name="pause" ref={pauseRef}></ion-icon>
              <ion-icon class="play" className={`play ${playing ? '' : 'visibility'}`} name="play" ref={playRef}></ion-icon>
            </span>
            <span className="circle__back-1 paused" ref={wave1Ref}></span>
            <span className="circle__back-2 paused" ref={wave2Ref}></span>
          </div>
          <div id="progress-bar-container">
            <input type="range" name="seek" id="progress-bar" value={currentTime} min="0" max={currentMaxDuration} onChange={handleSeek}/>
            {currentArtist ? (
              <>
                <div id="current-time-label">{formatTime(currentTime)}</div>
                <div id="max-duration-label">{formatTime(currentMaxDuration)}</div>
              </>
            ) : null}
          </div>
        </div>
      </div>
      {/* <div>
        <h2>playlist</h2>
      </div> */}
      
      <div id="grid-container" className="container">
        {/* {mixtapes.length > 0 ? 
          mixtapes.filter(mixtape => mixtape.moods.includes(selectedMood) || selectedMood === 4)
            .map(mixtape => { */}
        {filterMixtapes().length > 0 ? (
          filterMixtapes().map((mixtape) => {
            const { id, artist_name: artistName, track_name: trackName, channel_source: channelSource, source_url: sourceUrl, artwork_url: artworkUrl } = mixtape 
            return (
              <div key={id} className="mixtape-card" onClick={() => handleChangeMixtape(artistName, trackName, channelSource, sourceUrl, artworkUrl) }>
                <div className="mixtape-card-artwork" style={{ backgroundImage: `url(${artworkUrl})` }}></div>
                <div className="mixtape-card-info">
                  <div className="artist-name">{artistName}</div>
                  <div className="track-name">{trackName}</div>
                  <div className="source-icon">{handleIcon(channelSource)}</div>
                </div>
              </div>
            )
          })
        ) :
          <>
            {console.log('No mixtapes found')}
          </>
        }
        {isAuthenticated() ?
          <>
            <Link to={'/add'} as={Link}>
              <div className="mixtape-card">
                <div id="add-artwork" className="mixtape-card-artwork">
                  {/* <ion-icon class="pause" className="add-icon"></ion-icon> */}
                  <ion-icon id="add" name="add-outline"></ion-icon>
                </div>
                <div className="mixtape-card-info">
                  <div className="artist-name">Add a mixtape</div>
                  <div className="track-name">Save to your profile</div>
                </div>
              </div>
            </Link> 
          </>
          :
          <>
            <Link className="hi" to={'hi'} as={Link}>
              <div className="mixtape-card">
                <div id="add-artwork" className="mixtape-card-artwork">
                  {/* <ion-icon class="pause" className="add-icon"></ion-icon> */}
                  <ion-icon id="add" name="add-outline"></ion-icon>
                </div>
                <div className="mixtape-card-info">
                  <div className="artist-name">Add a mixtape</div>
                  <div className="track-name">Save to your profile</div>
                </div>
              </div>
            </Link>
          </>
        }
      </div>
    </>
  )

}

export default Home