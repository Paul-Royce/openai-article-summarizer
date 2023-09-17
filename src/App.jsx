import { useState } from 'react'
import Hero from './components/Hero'
import Demo from './components/Demo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <div className="main">
        <div className="gradient" />
      </div>

      <div className="app">
        <Hero />
        <Demo />
      </div>
    </main>
  )
}

export default App
