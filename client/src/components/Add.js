import { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'

const Add = () => {
  
  const marqueeRef = useRef(null)
  const [ledText, setLedText] = useState('Load a mixtape URL')
  const [url, setUrl] = useState('')
  const [validatedUrl, setValidatedUrl] = useState('')
  const [playerReady, setPlayerReady] = useState(false)

  const [ mixtapeFields, setMixtapeFields ] = useState({
    track_name: '',
    artist_name: '',
    genre: '',
    channel_source: '',
    source_url: '',
    artwork_url: '',
    start_time: '',
    end_time: '',
    release_date: '',
    moods: [],
  })

  async function handleLoadClick() {
    const urlRegex = /^(?:(?:http|https):\/\/)?(?:www\.)?(?:soundcloud\.com|youtu(?:be\.com|\.be)|mixcloud\.com)\/.+$/    
    const isValidInputUrl = urlRegex.test(url)
    if (isValidInputUrl){

      // set valid URL to show in ReactPlayer
      setValidatedUrl(url)

      // check channel source of URL to process logic for retrieving metadata
      const channelSource = checkChannelSource(url)
      setMixtapeFields({
        ...mixtapeFields,
        source_url: url,
        channel_source: channelSource,
      })

      // metadata is retrieved only once the player has properly loaded.
      // please see useEffect below for that. below function is now redundant.
      // getSCMetadata()

      setLedText('Sick track :-)')
    } else {
      setLedText('Please enter correct URL...')
    }
  }

  function checkChannelSource(url){
    if (url.includes('soundcloud.com')) {
      return 'soundcloud'
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube'
    } else if (url.includes('mixcloud.com')) {
      return 'mixcloud'
    } else {
      return 'unknown'
    }
  }

  // function getSCMetadata() {
  //   const player = document.querySelector('iframe')
  //   if (player) {
  //     console.log('player loaded successfully')
  //     handleSCLoad()
  //   } else {
  //     player.addEventListener('load', handleSCLoad)
  //     console.log('player failed to load')
  //   }
  // }

  function handleSCLoad() {
    const player = document.querySelector('iframe')
    const widget = window.SC.Widget(player)

    return new Promise((resolve, reject) => {
      widget.getCurrentSound((metadata) => {
        setMixtapeFields({
          ...mixtapeFields,
          track_name: metadata.title,
          artist_name: metadata.user.username,
          genre: metadata.genre,
          artwork_url: metadata.artwork_url,
          end_time: metadata.duration,
        })
        resolve(metadata)
      }, (error) => {
        reject(error)
      })
    })
  }

  // handling input change for LOGIN fields
  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setMixtapeFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target

    let moods = [...mixtapeFields.moods] // create a copy of the moods array

    if (checked) {
      // add the mood to the array based on the checkbox that was checked
      if (name === 'mood1') {
        moods.push(1)
      } else if (name === 'mood2') {
        moods.push(2)
      } else if (name === 'mood3') {
        moods.push(3)
      }
    } else {
      // remove the mood from the array if the checkbox was unchecked
      if (name === 'mood1') {
        moods = moods.filter((mood) => mood !== 1)
      } else if (name === 'mood2') {
        moods = moods.filter((mood) => mood !== 2)
      } else if (name === 'mood3') {
        moods = moods.filter((mood) => mood !== 3)
      }
    }

    setMixtapeFields({
      ...mixtapeFields,
      moods: moods,
    })
  }

  function handleRegisterSubmit() {

  }

  // Once the player has loaded properly, and is ready, then we read and save the data to state.
  useEffect(() => {
    if (playerReady) {
      if (mixtapeFields.channel_source === 'soundcloud'){
        handleSCLoad()
      }
    }
  }, [playerReady])

  useEffect(() => {
    const marqueeTextElement = marqueeRef.current.querySelector('.marquee-text')
    const isOverflowing = marqueeTextElement.offsetWidth > marqueeRef.current.offsetWidth

    console.log(marqueeTextElement.offsetWidth, marqueeRef.current.offsetWidth)

    if (isOverflowing) {
      setTimeout(() => {
        marqueeTextElement.classList.add('scroll')
        console.log(marqueeTextElement.offsetWidth, marqueeRef.current.offsetWidth)
      }, 0)
    }
  }, [ledText])

  return (
    <div id="add-container" className="container">

      {/* HEADER */}
      <div id="add-header-container">
        <h1>spectrum</h1>
      </div>

      {/* LED SCREEN */}
      <div id="add-led-container">
        <div id="leftside-container"></div>
        <div id="login-led-container">
          <div id="marquee" className="led track" ref={marqueeRef}>
            <div className="marquee-text">{ledText}</div>
          </div>
        </div>
        <div id="rightside-container"></div>
      </div>

      {/* FORM CONTAINER */}
      <div id="add-form-container">

        {/* ENTER URL */}
        <div id="enter-url-container">
          <div id="url-fields">
            <input type="text" placeholder="enter a soundcloud or youtube url" value={url} onChange={(e) => setUrl(e.target.value)}/>
            <button onClick={handleLoadClick}>Load</button>
          </div>
        </div>

        {/* PREVIEW MIXTAPE */}
        <div id="preview-mixtape-container">
          <div id="preview-reactplayer">
            <ReactPlayer className="react-player"
              url={validatedUrl}
              onReady={() => setPlayerReady(true)}
              // ref={reactPlayerRef}
              volume={0.5}
              width='100%'
              height='100%'
              config={{
                youtube: {
                  options: { visual: false, show_artwork: false }, 
                },
              }}
            />
          </div>

          {/* PREVIEW FORM */}
          <div id="preview-fields">
            <form className="add-mixtape-form" onSubmit={handleRegisterSubmit}>
              <div>
                <label htmlFor="track_name">Mixtape name:</label>
                <input
                  type="text"
                  id="track_name" 
                  name="track_name"
                  value={mixtapeFields.track_name}
                  onChange={handleFieldChange}
                />
              </div>
              <div>
                <label htmlFor="artist_name">Artist:</label>
                <input
                  type="text"
                  id="artist_name"
                  name="artist_name"
                  value={mixtapeFields.artist_name}
                  onChange={handleFieldChange}
                />
              </div>
              <div id="split">
                <div>
                  <label htmlFor="genre">Genre:</label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={mixtapeFields.genre}
                    onChange={handleFieldChange}
                  />
                </div>
                <div>
                  <label htmlFor="start_time">Start time:</label>
                  <input
                    type="text"
                    id="start_time"
                    name="start_time"
                    placeholder='00:00'
                    value={mixtapeFields.start_time}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
              <div id="split">
                <label htmlFor="mood1">Focus</label>
                <input type="checkbox" id="mood1" name="mood1" value="focus" onChange={handleCheckboxChange} />
                <label htmlFor="mood2">Chill</label>
                <input type="checkbox" id="mood2" name="mood2" value="chill" onChange={handleCheckboxChange} />
                <label htmlFor="mood3">Energy</label>
                <input type="checkbox" id="mood3" name="mood3" value="energy" onChange={handleCheckboxChange} />
              </div>
              <div className="login-register-button">
                <button className="btn btn__primary" type="submit">Add</button>
              </div>
            </form>

          </div>
        </div>
      </div>


    </div>
  )
}

export default Add