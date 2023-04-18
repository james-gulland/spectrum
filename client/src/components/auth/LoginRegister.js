import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
  
  // useEffect(() => {
  //   const marqueeTextElement = marqueeRef.current.querySelector('.marquee-text')
  //   const isOverflowing = marqueeTextElement.offsetWidth > marqueeRef.current.offsetWidth

  //   console.log(marqueeTextElement.offsetWidth, marqueeRef.current.offsetWidth)

  //   if (isOverflowing) {
  //     setTimeout(() => {
  //       marqueeTextElement.classList.add('scroll')
  //       console.log(marqueeTextElement.offsetWidth, marqueeRef.current.offsetWidth)
  //     }, 0)
  //   }
  // }, [ledText])

  // handling the radio button selection for either login or register
  function handleOptionChange(e) {
    setSelectedOption(e.target.value)
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
      setLedText(`Error! ${err.response.statusText}`)
      // setLedText(err.response.data.message)
    }
    
  }

  return (

    <div id="control-container" className="container">
      <div id="control-header-container">
        <h1>spectrum</h1>
      </div>
    
      <div id="control-led-container">
        <div id="marquee" className="led track" ref={marqueeRef}></div>
        <div className="marquee-text">{ledText}</div>
      </div>

      <div className="segmented-control">
              
        <input type="radio" name="radio2" value="login" id="tab-1" checked={selectedOption === 'login'} onChange={handleOptionChange}/>
        <label htmlFor="tab-1" className="segmented-control__1">
          <p>Login</p></label>
        
        <input type="radio" name="radio2" value="register" id="tab-2" checked={selectedOption === 'register'} onChange={handleOptionChange}/>
        <label htmlFor="tab-2" className="segmented-control__2">
          <p>Register</p></label>
        
        <div className="segmented-control__color"></div>
      </div>

      {selectedOption === 'login' ? (
        <form onSubmit={handleLoginSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginFields.email}
            onChange={handleLoginInputChange}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginFields.password}
            onChange={handleLoginInputChange}
          />
          <br />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={registerFields.username}
            onChange={handleRegisterInputChange}
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={registerFields.email}
            onChange={handleRegisterInputChange}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={registerFields.password}
            onChange={handleRegisterInputChange}
          />
          <br />
          <label htmlFor="password_confirmation">Confirm Password:</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={registerFields.password_confirmation}
            onChange={handleRegisterInputChange}
          />
          <br />
          <button type="submit">Register</button>
        </form>
      )}

    </div>

  )

}

export default Login