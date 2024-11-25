import { useState } from 'react'
import Intro from './Intro'
import Quiz from './Quiz'

const AppView = {
  Intro: 'Intro',
  Quiz: 'Quiz',
}

function App() {
  const [view, setView] = useState(AppView.Intro)

  function changeToQuizView() {
    setView(AppView.Quiz)
  }

  return (
    <main>
      {view === AppView.Intro && <Intro changeView={changeToQuizView} />}
      {view === AppView.Quiz && <Quiz />}
    </main>
  )
}

export default App
