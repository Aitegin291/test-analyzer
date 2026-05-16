import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Убедись, что импортируется именно App
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
)