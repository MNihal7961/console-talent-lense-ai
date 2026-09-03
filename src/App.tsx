import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App:React.FC= () => {
  return (
    <div>
      App
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default App