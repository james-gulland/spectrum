import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { authenticated, removeToken } from '../../helpers/auth'

const Profile = () => {

  const marqueeRef = useRef(null)
  const [ledText, setLedText] = useState('Manage ur profile')
  const [mixtapes, setMixtapes] = useState([])
  const [ userFields, setUserFields ] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  
  const navigate = useNavigate()

  const handleLogOut = () => {
    // Remove token from local storage
    removeToken()
    navigate('/hi')
  }

  function handleUserInputChange(e) {
    const { name, value } = e.target
    setUserFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    console.log('change submit')
    try {
      const { data } = await authenticated.put('/api/auth/user/', userFields)
      setLedText(`Updated for you, ${data.username}!`)
    } catch (err) {
      console.log('error', err.response.statusText)
      setLedText(`Error! ${err.response.statusText}`)
      // setLedText(err.response.data.message)
    }
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
        console.log('got through to delete mixtape...')
        await authenticated.delete(`/api/mixtapes/${idToDelete}/`)
        console.log('should have completed delete now...')
        // const updatedMixtapes = mixtapes.filter(mixtape => mixtape.id !== idToDelete)
        setMixtapes(prevMixtapes => prevMixtapes.filter(mixtape => mixtape.id !== idToDelete))
        console.log(mixtapes)
        // setMixtapes(updatedMixtapes)
      } catch (err) {
        console.log(err)
        // setError(err.message)
      }
      // displayMixtapes()
    }
    deleteMixtape()
    // console.log(mixtapes)
  }

  // ! On Mount retrieve user data
  useEffect(() => {
    const getUserData = async () => {
      try { 
        const { data } = await authenticated.get('/api/auth/user/')
        console.log('user data here', data)
        setUserFields({
          username: data.username,
          email: data.email,
        })
      } catch (err) {
        console.log(err)
      }
    }
    getUserData()
  }, [])

  // ! On Mount retrieve mixtapes
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
  })

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
            <form className="user-form" onSubmit={handleUserSubmit}>
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username" 
                  name="username"
                  placeholder="pick a nickname (100 chars)"
                  value={userFields.username}
                  onChange={handleUserInputChange}
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@address.here"
                  value={userFields.email}
                  onChange={handleUserInputChange}
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="enter your existing or new password"
                  value={userFields.password}
                  onChange={handleUserInputChange}
                />
              </div>
              <div>
                <label htmlFor="password_confirmation">Confirm Password:</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={userFields.password_confirmation}
                  onChange={handleUserInputChange}
                />
              </div>
              <div className="login-register-button">
                <button className="btn btn__primary" type="submit">Update</button>
              </div>
            </form>
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