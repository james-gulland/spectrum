import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {

  // STATES for controls:
  const marqueeRef = useRef(null)
  const [ledText, setLedText] = useState('Login or Register?')
  const [selectedOption, setSelectedOption] = useState('login')
  
  // STATES for the form fields:
  const [ loginFields, setLoginFields ] = useState({
    email: '',
    password: '',
  })

  const [ registerFields, setRegisterFields ] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  // navigate away from page once successful
  const navigate = useNavigate()
  
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

  // handling the radio button selection for either login or register
  function handleOptionChange(e) {
    setSelectedOption(e.target.value)
    setLedText(`OK, let's ${e.target.value}`)
  }

  // handling input change for LOGIN fields
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target
    setLoginFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // handling input change for REGISTER fields
  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target
    setRegisterFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // handling submit for LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    console.log('login submit')
    try {
      const { data } = await axios.post('/api/auth/login/', loginFields)
      localStorage.setItem('SPECTRUM-TOKEN', data.token)
      navigate('/')
    } catch (err) {
      console.log('error', err.response.statusText)
      setLedText(`Error! ${err.response.statusText}`)
      // setLedText(err.response.data.message)
    }
  }

  // handling submit for REGISTER
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    // console.log('register submit')
    try {
      const { data } = await axios.post('/api/auth/register/', registerFields)
      setSelectedOption('login')
      setLedText(`Welcome, ${data.username}! Now please login...`)

    } catch (err) {
      console.log('error', err.response.statusText)
      setLedText(`Error! ${err.response.statusText}. Make sure password is at least 8 chars long and your email is unqiue... you got this.`)
    }
    
  }

  return (

    <div id="login-container" className="container">
      
      <div id="login-header-container">
        <h1>spectrum</h1>
      </div>
      
      <div id="login-form-container">
        <div id="leftside-container">
          <Link id="home" className="profile" to={'/'} as={Link}><ion-icon name="home"></ion-icon></Link>
        </div>
        <div id="login-led-container">
          <div id="marquee" className="led track" ref={marqueeRef}>
            <div className="marquee-text">{ledText}</div>
          </div>
          <div id="login-control-container"> 
            <div className="login-control">
                    
              <input type="radio" name="radio2" value="login" id="tab-1" checked={selectedOption === 'login'} onChange={handleOptionChange}/>
              <label htmlFor="tab-1" className="login-control__1">
                <p>Login</p></label>
              
              <input type="radio" name="radio2" value="register" id="tab-2" checked={selectedOption === 'register'} onChange={handleOptionChange}/>
              <label htmlFor="tab-2" className="login-control__2">
                <p>Register</p></label>
              
              <div className="login-control__color"></div>
            </div>
          </div>

          {selectedOption === 'login' ? (
            <form className="login-register-form" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@address.here"
                  value={loginFields.email}
                  onChange={handleLoginInputChange}
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginFields.password}
                  onChange={handleLoginInputChange}
                />
              </div>
              <div className="login-register-button">
                <button className="btn btn__primary" type="submit">Login</button>
              </div>
            </form>
          ) : (
            <form className="login-register-form" onSubmit={handleRegisterSubmit}>
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username" 
                  name="username"
                  placeholder="pick a nickname"
                  value={registerFields.username}
                  onChange={handleRegisterInputChange}
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@address.here"
                  value={registerFields.email}
                  onChange={handleRegisterInputChange}
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="min 8 characters, make it unique"
                  value={registerFields.password}
                  onChange={handleRegisterInputChange}
                />
              </div>
              <div>
                <label htmlFor="password_confirmation">Confirm Password:</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={registerFields.password_confirmation}
                  onChange={handleRegisterInputChange}
                />
              </div>
              <div className="login-register-button">
                <button className="btn btn__primary" type="submit">Register</button>
              </div>
            </form>
          )}
        </div>
        <div id="rightside-container">
        </div>
      </div>
    </div>

  )

}

export default Login