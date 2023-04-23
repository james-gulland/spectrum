import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { authenticated, removeToken } from '../../helpers/auth'

const Profile = () => {

  const marqueeRef = useRef(null)
  const [ledText, setLedText] = useState('Manage ur profile')
  const [mixtapes, setMixtapes] = useState([])
  
  const navigate = useNavigate()

  const handleLogOut = () => {
    // Remove token from local storage
    removeToken()
    navigate('/hi')
  }

  function handleMoodChange() {

  }

  const displayMixtapes = () => {
    return (
      mixtapes.map((mixtape) => {
        const { id, artist_name: artistName, track_name: trackName, channel_source: channelSource, source_url: sourceUrl, artwork_url: artworkUrl } = mixtape 
        return (
          <div key={id} className="mixtape-card">
            <div className="mixtape-card-artwork" style={{ backgroundImage: `url(${artworkUrl})` }}></div>
            <div className="mixtape-card-info">
              <div className="artist-name">{artistName}</div>
              <div className="track-name">{trackName}</div>
              <div className="source-icon">{handleIcon(channelSource)}</div>
            </div>
            <div className="delete-section" onClick={(e) => handleDelete(id)}>
              <ion-icon id="delete" name="close-outline"></ion-icon>
            </div>
          </div>
        )
      })
    )
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

  function handleDelete(idToDelete) {
    console.log('delete pressed', idToDelete)
    const deleteMixtape = async () => {
      try {
        await authenticated.delete(`/api/mixtapes/${idToDelete}`)
        const updatedMixtapes = mixtapes.filter(mixtape => mixtape.id !== idToDelete)
        setMixtapes(updatedMixtapes)
      } catch (err) {
        console.log(err)
        // setError(err.message)
      }
      displayMixtapes()
    }
    deleteMixtape()
  }

  // ! On Mount
  useEffect(() => {
    const getData = async () => {
      try { 
        const { data } = await authenticated.get('/api/mixtapes/')
        setMixtapes(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [])

  return (
    <>
      <div id="profile-container" className="container">

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
          <div id="rightside-container">
            <Link id="logout" className="profile" to={'/'} as={Link} onClick={handleLogOut}><ion-icon name="log-out-outline"></ion-icon></Link>
          </div>
        </div>

        {/* PROFILE CONTAINER */}
        <div id="change-profile-container">

          {/* FORM CONTAINER */}
          <div id="change-user-container">
            <form className="user-form">
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username" 
                  name="username"
                  placeholder="pick a nickname (100 chars)"
                  // value={registerFields.username}
                  // onChange={handleRegisterInputChange}
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@address.here"
                  // value={registerFields.email}
                  // onChange={handleRegisterInputChange}
                />
              </div>
              <div className="login-register-button">
                <button className="btn btn__primary" type="submit">Update</button>
              </div>
            </form>
          </div>

          <div id="change-mood-container">
            <div id="mood-controls">
              <div>Select your mood:</div>
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
        </div>
      </div>

      {/* GRID */}
      <div id="grid-profile-container" className="container">
        {mixtapes.length > 0 ? (
          displayMixtapes()
        ) :
          <>
            {console.log('No mixtapes found')}
          </>
        }
      </div>
    </>
  )

}

export default Profile