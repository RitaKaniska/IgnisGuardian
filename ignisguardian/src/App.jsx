import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import FireAlarmLogin from './pages/LoginPages'
import FireAlarmRegister from './pages/RegisterPages'
import FireAlarmDashboard from './pages/MainMenu'
import ChatbotWidget from "./ChatbotWidget";

function App() {

  return (
    <>
      <FireAlarmDashboard></FireAlarmDashboard>
      <ChatbotWidget />
    </>
  )
}

export default App
