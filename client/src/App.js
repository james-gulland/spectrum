import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import LoginRegister from './components/auth/LoginRegister'
import Add from './components/Add'

const App = () => {

  return (
    <div className='site-wrapper'>
        
      <BrowserRouter>
        {/* Any element inside of BrowserRouter, but outside of Routes can use the Link and will still be visible on every page */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hi" element={<LoginRegister />} />
          <Route path="/add" element={<Add />} />
        </Routes>
      </BrowserRouter>
    </div>
  )

}

export default App
