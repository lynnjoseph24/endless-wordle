import { useState, useEffect } from 'react'
import { words } from './words'
import './App.css'

function App() {
  // Game state
  const [currentWord, setCurrentWord] = useState('') // The word player needs to guess
  const [guesses, setGuesses] = useState([]) // Array of previous guesses
  const [currentGuess, setCurrentGuess] = useState('') // Current input word
  const [gameOver, setGameOver] = useState(false) // Whether the game has ended
  const [message, setMessage] = useState('') // Game status message
  const [victories, setVictories] = useState(0) // Number of consecutive wins
  const [isVictory, setIsVictory] = useState(false) // Whether current game was won
  
  // Timer state
  const [time, setTime] = useState(0) // Game duration in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false) // Timer active state

  // Initialize game with random word
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * words.length)
    setCurrentWord(words[randomIndex])
  }, [])

  // Timer logic
  useEffect(() => {
    let interval
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver) return

      const key = event.key.toLowerCase()
      
      // Handle Enter key press
      if (key === 'enter') {
        if (currentGuess.length === 5) {
          // Check for victory
          if (currentGuess === currentWord) {
            setGameOver(true)
            setIsVictory(true)
            setVictories(prev => prev + 1)
            setIsTimerRunning(false)
            setMessage(`🎉 Congratulations! You won! Time: ${formatTime(time)}`)
            return
          }
          // Check for game over (no more guesses)
          if (guesses.length >= 5) {
            setGameOver(true)
            setIsVictory(false)
            setIsTimerRunning(false)
            setVictories(0) // Reset victories on loss
            setMessage(`😢 Game Over! The word was "${currentWord.toUpperCase()}" Time: ${formatTime(time)}`)
            return
          }
          // Add guess to history and clear current guess
          setGuesses([...guesses, currentGuess])
          setCurrentGuess('')
        }
      } 
      // Handle Backspace key press
      else if (key === 'backspace') {
        setCurrentGuess(prev => prev.slice(0, -1))
      } 
      // Handle letter key press
      else if (/^[a-z]$/.test(key) && currentGuess.length < 5) {
        // Start timer on first guess
        if (guesses.length === 0 && currentGuess.length === 0) {
          setIsTimerRunning(true)
        }
        setCurrentGuess(prev => prev + key)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentGuess, currentWord, guesses, gameOver, time])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Determine color for each letter tile
  const getLetterColor = (letter, index, guess) => {
    if (!guess) return ''
    if (letter === currentWord[index]) return 'correct' // Exact match
    if (currentWord.includes(letter)) return 'present' // Letter exists but wrong position
    return 'absent' // Letter not in word
  }

  // Reset game state for new game
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
      {/* Game Header */}
      <div className="header">
        <h1>Never Ending Wordle</h1>
      </div>

      {/* Stats Display */}
      <div className="stats">
        <div className="victory-counter">
          Victories: <span className="victory-number">{victories}</span>
        </div>
        <div className="timer">
          Time: <span className="timer-number">{formatTime(time)}</span>
        </div>
      </div>

      {/* Game Board */}
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

      {/* Game Over Message */}
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
