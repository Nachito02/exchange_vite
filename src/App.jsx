import React from 'react'
import './App.css'
import WinerySelector from './components/WinerySelector/WinerySelector'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Selector from './components/Selector/Selector'
import Main from './components/Main'
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<WinerySelector />} />
          <Route path='/:wineryId' element={<Selector />} />
          <Route path='/:wineryId/:productId' element={<Main />} />


          
        </Routes>
      </Router>
    </>
  )
}

export default App