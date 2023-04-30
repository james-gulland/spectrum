import { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticated } from '../helpers/auth'

const Add = () => {
  
  const marqueeRef = useRef(null)
  const [ledText, setLedText] = useState('Load a mixtape URL')
  const [url, setUrl] = useState('')
  const [validatedUrl, setValidatedUrl] = useState('')
  const [playerReady, setPlayerReady] = useState(false)
  const youTubeKey = process.env.REACT_APP_YOUTUBE_KEY
  const navigate = useNavigate()  

  const [ mixtapeFields, setMixtapeFields ] = useState({
    track_name: '',
    artist_name: '',
    genre: '',
    channel_source: '',
    source_url: '',
    artwork_url: '',
    start_time: null,
    end_time: null,
    release_date: null,
    moods: [4], // add 'default' if none entered
  })

  // function called when the mixtape is loaded via 'Load' button
  // it will checked to make sure the URL is valid. if ok, sets in state for ReactPlayer to use, otherwise throws an error.
  function handleLoadClick() {
    // setMixtapeFields(initialMixtapeFields)
    const urlRegex = /^(?:(?:http|https):\/\/)?(?:www\.)?(?:soundcloud\.com|youtu(?:be\.com|\.be)|mixcloud\.com)\/.+$/    
    const isValidInputUrl = urlRegex.test(url)

    // console.log('defining url', isValidInputUrl)
    if (isValidInputUrl){

      // set valid URL to show in ReactPlayer
      setValidatedUrl(url)

      // check channel source of URL and add to state along with the URL
      const channelSource = checkChannelSource(url)
      // setMixtapeFields({
      //   ...mixtapeFields,
      //   source_url: url,
      //   channel_source: channelSource,
      // })

      setMixtapeFields({
        ...mixtapeFields,
        track_name: '',
        artist_name: '',
        genre: '',
        start_time: null,
        source_url: url,
        channel_source: channelSource,
      })
      
      // set success message
      setLedText('Sick mix ;-)')
    } else {
      setLedText('Please enter correct URL...')
    }
  }

  // const initialMixtapeFields = {
  //   track_name: '',
  //   artist_name: '',
  //   genre: '',
  //   channel_source: '',
  //   source_url: '',
  //   artwork_url: '',
  //   start_time: null,
  //   end_time: null,
  //   release_date: null,
  //   moods: [4], // add 'default' if none entered
  // }

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

  // purpose of this function is to retrieve soundcloud metadata to store in state (and therefore to db once added)
  // called once the ReactPlayer is ready (onReady) and if mixtape is a Soundcloud track
  // NOTE: this is a hacky way of retrieving metadata since the official APIs are no longer available to developers
  // Instead, I found hidden documentation that retrives data from the SC Widget API instead (and it works!)
  async function handleSCLoad() {
    const player = document.querySelector('iframe')
    const widget = window.SC.Widget(player)

    return new Promise((resolve, reject) => {
      widget.getCurrentSound((metadata) => {
        
        // widget returns low quality thumbnail so changing to high quality
        const originalArtworkUrl = metadata.artwork_url
        const higherQualityArtwork = originalArtworkUrl.replace(/-large\.jpg$/, '-t500x500.jpg')
        metadata.artwork_url = higherQualityArtwork

        setMixtapeFields({
          ...mixtapeFields,
          track_name: metadata.title,
          artist_name: metadata.user.username,
          genre: metadata.genre,
          artwork_url: metadata.artwork_url,
          // end_time: metadata.duration,
        })
        resolve(metadata)
      }, (error) => {
        reject(error)
      })
    })
  }

  // purpose of this function is to retrieve youtube metadata to store in state (and therefore to db once added)
  // called once the ReactPlayer is ready (onReady) and if mixtape is a Soundcloud track
  // NOTE: this is the official youtube Data API and is really nice to use and powerful. They are open for developers :)
  function handleYTLoad() {
    const getData = async () => {
      try {
        // take validated url and identifies the unique ID of the video, to pass through to API
        const youtubeUrl = new URL(validatedUrl)
        const videoId = youtubeUrl.searchParams.get('v')
        
        // get the youtube API data from the unique ID
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youTubeKey}&part=snippet,contentDetails,statistics,status`)
        
        // store data to state
        const { items: [{ snippet }] } = data
        setMixtapeFields({
          ...mixtapeFields,
          track_name: snippet.title,
          artist_name: snippet.channelTitle,
          // genre: snippet.genre,
          artwork_url: snippet.thumbnails.medium.url,
          // end_time: snippet.duration,
        })

      } catch (err) {
        console.log('didnt load data!', err)
      }

    }
    getData()
  }

  // handling input change for LOGIN fields
  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setMixtapeFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // handing input change for checkboxes only, which are annoying buggers.  
  // I am sure there is a better way of doing this, but I have bigger battles...
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

  // form submit - send track data to database
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('Trying to save data...')
      // const { data } = await axios.post('/api/mixtapes/', mixtapeFields)
      const { data } = await authenticated.post('/api/mixtapes/', mixtapeFields)
      console.log('stored add data success ->', data)
      navigate('/')
    } catch (err) {
      console.log('error', err.response.statusText)
      setLedText(`Error! ${err.response.statusText}`)
      // setLedText(err.response.data.message)
    }
  }

  // Once the player has loaded properly, and is ready, then we read and save the data to state.
  // allows user to load a new track also (thus validatedUrl changes and triggers)
  useEffect(() => {
    console.log('useEffect hit')
    if (playerReady && validatedUrl) {
      if (mixtapeFields.channel_source === 'soundcloud'){
        handleSCLoad()
        setPlayerReady(false)
      } else if (mixtapeFields.channel_source === 'youtube') {
        handleYTLoad()
        setPlayerReady(false)
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
        <div id="leftside-container">
          <Link id="home" className="profile" to={'/'} as={Link}><ion-icon name="home"></ion-icon></Link>
        </div>
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
            <input type="text" className="url-input" placeholder="enter a soundcloud or youtube url" value={url} onChange={(e) => setUrl(e.target.value)}/>
            <button className="btn__secondary" onClick={handleLoadClick}>Load</button>
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
            <form className="add-mixtape-form" onSubmit={handleAddSubmit}>
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
              <div id="split" className="check-container">
                <div>
                  <label htmlFor="mood1">Focus</label>
                  <input type="checkbox" className="checkbox" id="mood1" name="mood1" value="focus" onChange={handleCheckboxChange} />
                </div>
                <div>
                  <label htmlFor="mood2">Chill</label>
                  <input type="checkbox" className="checkbox" id="mood2" name="mood2" value="chill" onChange={handleCheckboxChange} />
                </div>
                <div>
                  <label htmlFor="mood3">Energy</label>
                  <input type="checkbox" className="checkbox" id="mood3" name="mood3" value="energy" onChange={handleCheckboxChange} />
                </div>
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