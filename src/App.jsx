import { useState, useEffect } from 'react'
import { words } from './words'
import './App.css'

function App() {
  const [currentWord, setCurrentWord] = useState('')
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [victories, setVictories] = useState(0)
  const [isVictory, setIsVictory] = useState(false)
  const [time, setTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    // Pick a random word when the game starts
    const randomIndex = Math.floor(Math.random() * words.length)
    setCurrentWord(words[randomIndex])
  }, [])

  useEffect(() => {
    let interval
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver) return

      const key = event.key.toLowerCase()
      
      if (key === 'enter') {
        if (currentGuess.length === 5) {
          if (currentGuess === currentWord) {
            setGameOver(true)
            setIsVictory(true)
            setVictories(prev => prev + 1)
            setIsTimerRunning(false)
            setMessage(`🎉 Congratulations! You won! Time: ${formatTime(time)}`)
            return
          }
          if (guesses.length >= 5) {
            setGameOver(true)
            setIsVictory(false)
            setIsTimerRunning(false)
            setVictories(0)
            setMessage(`😢 Game Over! The word was "${currentWord.toUpperCase()}" Time: ${formatTime(time)}`)
            return
          }
          setGuesses([...guesses, currentGuess])
          setCurrentGuess('')
        }
      } else if (key === 'backspace') {
        setCurrentGuess(prev => prev.slice(0, -1))
      } else if (/^[a-z]$/.test(key) && currentGuess.length < 5) {
        if (guesses.length === 0 && currentGuess.length === 0) {
          setIsTimerRunning(true)
        }
        setCurrentGuess(prev => prev + key)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentGuess, currentWord, guesses, gameOver, time])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getLetterColor = (letter, index, guess) => {
    if (!guess) return ''
    if (letter === currentWord[index]) return 'correct'
    if (currentWord.includes(letter)) return 'present'
    return 'absent'
  }

  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * words.length)
    setCurrentWord(words[randomIndex])
    setGuesses([])
    setCurrentGuess('')
    setGameOver(false)
    setMessage('')
    setIsVictory(false)
    setTime(0)
    setIsTimerRunning(false)
  }

  return (
    <div className="game-container">
      <div className="header">
        <h1>Never Ending Wordle</h1>
      </div>
      <div className="stats">
        <div className="victory-counter">
          Victories: <span className="victory-number">{victories}</span>
        </div>
        <div className="timer">
          Time: <span className="timer-number">{formatTime(time)}</span>
        </div>
      </div>
      <div className="game-board">
        {[...Array(6)].map((_, rowIndex) => {
          const guess = guesses[rowIndex] || '';
          const isCorrectRow = guess === currentWord;
          
          return (
            <div key={rowIndex} className={`row ${isCorrectRow ? 'correct' : ''}`}>
              {[...Array(5)].map((_, colIndex) => {
                const letter = guess[colIndex] || (rowIndex === guesses.length ? currentGuess[colIndex] : '');
                const color = getLetterColor(letter, colIndex, guess);
                
                return (
                  <div key={colIndex} className={`tile ${color}`}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {message && (
        <div className={`message ${isVictory ? 'victory' : 'defeat'}`}>
          {message}
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  )
}

export default App
