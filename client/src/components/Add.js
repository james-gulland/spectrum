import { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'

const Add = () => {
  
  const marqueeRef = useRef(null)
  const [ledText, setLedText] = useState('Load a mixtape URL')
  const [url, setUrl] = useState('')
  const [validatedUrl, setValidatedUrl] = useState('')

  function handleLoadClick() {
    const urlRegex = /^(?:(?:http|https):\/\/)?(?:www\.)?(?:soundcloud\.com|youtu(?:be\.com|\.be)|mixcloud\.com)\/.+$/    
    const isValidInputUrl = urlRegex.test(url)
    if (isValidInputUrl){
      setValidatedUrl(url)
      setLedText('Sick track :-)')
    } else {
      setLedText('Please enter correct URL...')
    }
  }

  function handleRegisterSubmit() {

  }

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
            <input type="text" placeholder="enter a soundcloud or youtube url" value={url} onChange={(e) => setUrl(e.target.value)}/>            <button onClick={handleLoadClick}>Load</button>
          </div>
        </div>

        {/* PREVIEW MIXTAPE */}
        <div id="preview-mixtape-container">
          <div id="preview-reactplayer">
            <ReactPlayer className="react-player"
              url={validatedUrl}
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
                <label htmlFor="mixtape-name">Mixtape name:</label>
                <input
                  type="text"
                  id="mixtape-name" 
                  name="mixtape-name"
                  // value={registerFields.username}
                  // onChange={handleRegisterInputChange}
                />
              </div>
              <div>
                <label htmlFor="mixtape-artist">Artist:</label>
                <input
                  type="text"
                  id="mixtape-artist"
                  name="mixtape-artist"
                  // value={registerFields.email}
                  // onChange={handleRegisterInputChange}
                />
              </div>
              {/* <div>
                <label htmlFor="start-time">Start time:</label>
                <input
                  type="text"
                  id="start-time"
                  name="start-time"
                  // value={registerFields.password}
                  // onChange={handleRegisterInputChange}
                />
              </div>
              <div>
                <label htmlFor="genre">Genre:</label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  // value={registerFields.password_confirmation}
                  // onChange={handleRegisterInputChange}
                />
              </div> */}
              <div id="split">
                <div>
                  <label htmlFor="genre">Genre:</label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    // value={registerFields.password_confirmation}
                    // onChange={handleRegisterInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="start-time">Start time:</label>
                  <input
                    type="text"
                    id="start-time"
                    name="start-time"
                    // value={registerFields.password}
                    // onChange={handleRegisterInputChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="mood">Mood selector:</label>
                <input
                  type="checkbox"
                  id="mood"
                  name="mood"
                  // value={registerFields.password_confirmation}
                  // onChange={handleRegisterInputChange}
                />
              </div>
              <div className="login-register-button">
                <button className="btn btn__primary" type="submit">Add</button>
              </div>
            </form>

          </div>
        </div>
        {/* <div id="add-mixtape-container">
          <button>Add</button>
        </div> */}
      </div>


    </div>
  )
}

export default Add