import { useState, useEffect, useRef } from 'react'
import { words } from './words'
import './App.css'

// Floating icons component
const FloatingIcons = () => {
  const icons = [
    // Wordle letters with different animations
    { char: 'W', animation: 'floatSlow', duration: '8s', delay: '0s', fontSize: '3rem' },
    { char: 'O', animation: 'floatMedium', duration: '10s', delay: '1s', fontSize: '3rem' },
    { char: 'R', animation: 'floatFast', duration: '7s', delay: '2s', fontSize: '3rem' },
    { char: 'D', animation: 'floatSlow', duration: '9s', delay: '3s', fontSize: '3rem' },
    { char: 'L', animation: 'floatMedium', duration: '11s', delay: '4s', fontSize: '3rem' },
    { char: 'E', animation: 'floatFast', duration: '8s', delay: '5s', fontSize: '3rem' },
    
    // Game-related emojis
    { char: '🎲', animation: 'floatSlow', duration: '10s', delay: '1s', fontSize: '2.5rem' },
    { char: '🎮', animation: 'floatMedium', duration: '9s', delay: '2s', fontSize: '2.5rem' },
    { char: '🎯', animation: 'floatFast', duration: '7s', delay: '3s', fontSize: '2.5rem' },
    
    // Animals
    { char: '🐕', animation: 'floatSlow', duration: '12s', delay: '0.5s', fontSize: '2.8rem' },
    { char: '🐈', animation: 'floatMedium', duration: '11s', delay: '1.5s', fontSize: '2.8rem' },
    { char: '🐶', animation: 'floatFast', duration: '9s', delay: '2.5s', fontSize: '2.8rem' },
    { char: '😺', animation: 'floatSlow', duration: '10s', delay: '3.5s', fontSize: '2.8rem' },
    
    // Sports and equipment
    { char: '🏀', animation: 'floatMedium', duration: '8s', delay: '0.7s', fontSize: '2.3rem' },
    { char: '🏈', animation: 'floatFast', duration: '9s', delay: '1.7s', fontSize: '2.3rem' },
    { char: '⚽', animation: 'floatSlow', duration: '11s', delay: '2.7s', fontSize: '2.3rem' },
    { char: '🎾', animation: 'floatMedium', duration: '10s', delay: '3.7s', fontSize: '2.3rem' },
    
    // Protection and equipment
    { char: '⛑️', animation: 'floatFast', duration: '9s', delay: '0.2s', fontSize: '2.6rem' },
    { char: '🪖', animation: 'floatSlow', duration: '11s', delay: '1.2s', fontSize: '2.6rem' },
    { char: '🏆', animation: 'floatMedium', duration: '8s', delay: '2.2s', fontSize: '2.6rem' },
    { char: '🛡️', animation: 'floatFast', duration: '10s', delay: '3.2s', fontSize: '2.6rem' }
  ]

  return (
    <div className="floating-icons">
      {icons.map((icon, index) => (
        <div
          key={index}
          className="floating-icon"
          style={{
            animation: `${icon.animation} ${icon.duration} ease-in-out infinite`,
            animationDelay: icon.delay,
            left: `${Math.random() * 90 + 5}%`, // Keep icons away from edges
            top: `${Math.random() * 90 + 5}%`, // Keep icons away from edges
            fontSize: icon.fontSize
          }}
        >
          {icon.char}
        </div>
      ))}
    </div>
  )
}

function App() {
  // Game state
  const [currentWord, setCurrentWord] = useState('') // The word player needs to guess
  const [guesses, setGuesses] = useState([]) // Array of previous guesses
  const [currentGuess, setCurrentGuess] = useState('') // Current input word
  const [gameOver, setGameOver] = useState(false) // Whether the game has ended
  const [message, setMessage] = useState('') // Game status message
  const [victories, setVictories] = useState(0) // Number of consecutive wins
  const [isVictory, setIsVictory] = useState(false) // Whether current game was won
  const [isMobile, setIsMobile] = useState(false) // Whether we're on a mobile device
  
  // Timer state
  const [time, setTime] = useState(0) // Game duration in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false) // Timer active state

  // Reference to hidden input for mobile keyboard
  const inputRef = useRef(null)

  // Detect mobile device on mount
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(isTouchDevice)
    }
    checkMobile()
  }, [])

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
  const handleKeyInput = (key) => {
    if (gameOver) return

    key = key.toLowerCase()
    
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
    else if (key === 'backspace' || key === 'delete') {
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

  // Handle physical keyboard events - only for non-mobile
  useEffect(() => {
    if (isMobile) return // Skip on mobile devices

    const handleKeyPress = (event) => {
      handleKeyInput(event.key)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentGuess, currentWord, guesses, gameOver, time, isMobile])

  // Handle mobile input changes
  const handleInputChange = (event) => {
    const value = event.target.value
    const lastChar = value[value.length - 1]
    if (lastChar) {
      handleKeyInput(lastChar)
    }
    // Clear the input for next character
    event.target.value = ''
  }

  // Focus input when container is clicked - only for mobile
  const handleContainerClick = () => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus()
    }
  }

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
    <>
      <FloatingIcons />
      <div className="game-container" onClick={handleContainerClick}>
        {/* Hidden input for mobile keyboard - only shown on mobile */}
        {isMobile && (
          <input
            ref={inputRef}
            type="text"
            className="mobile-input"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            onChange={handleInputChange}
            inputMode="text"
          />
        )}

        {/* Game Header */}
        <div className="header">
          <h1>Endless Wordle</h1>
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
    </>
  )
}

export default App
