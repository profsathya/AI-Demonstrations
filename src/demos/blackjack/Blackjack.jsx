import { useState, useEffect, useCallback } from 'react'
import './Blackjack.css'

// Card suits and values
const SUITS = ['♠', '♥', '♦', '♣']
const SUIT_COLORS = { '♠': 'black', '♥': 'red', '♦': 'red', '♣': 'black' }
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

// Create a fresh deck
function createDeck() {
  const deck = []
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, id: `${value}${suit}${Math.random()}` })
    }
  }
  return deck
}

// Shuffle deck using Fisher-Yates
function shuffleDeck(deck) {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Calculate hand value
function calculateHand(cards) {
  let value = 0
  let aces = 0

  for (const card of cards) {
    if (card.value === 'A') {
      aces++
      value += 11
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      value += 10
    } else {
      value += parseInt(card.value)
    }
  }

  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }

  return value
}

// Check if hand is blackjack
function isBlackjack(cards) {
  return cards.length === 2 && calculateHand(cards) === 21
}

// Card component
function Card({ card, hidden = false, dealing = false, index = 0 }) {
  const color = SUIT_COLORS[card.suit]

  return (
    <div
      className={`card ${hidden ? 'hidden' : ''} ${dealing ? 'dealing' : ''}`}
      style={{ '--deal-delay': `${index * 0.15}s` }}
    >
      {hidden ? (
        <div className="card-back">
          <div className="card-pattern"></div>
        </div>
      ) : (
        <div className={`card-front ${color}`}>
          <div className="card-corner top-left">
            <span className="card-value">{card.value}</span>
            <span className="card-suit">{card.suit}</span>
          </div>
          <div className="card-center">{card.suit}</div>
          <div className="card-corner bottom-right">
            <span className="card-value">{card.value}</span>
            <span className="card-suit">{card.suit}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Hand component
function Hand({ cards, label, value, isDealer = false, hideFirst = false, dealing = false }) {
  return (
    <div className="hand">
      <div className="hand-label">
        {label}
        {!hideFirst && value > 0 && (
          <span className={`hand-value ${value > 21 ? 'bust' : value === 21 ? 'blackjack' : ''}`}>
            {value}
          </span>
        )}
      </div>
      <div className="cards">
        {cards.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            hidden={hideFirst && i === 0}
            dealing={dealing}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}

// Chip component
function Chip({ value, onClick, disabled }) {
  const colors = {
    5: '#e74c3c',
    10: '#3498db',
    25: '#2ecc71',
    50: '#9b59b6',
    100: '#f39c12'
  }

  return (
    <button
      className="chip"
      style={{ '--chip-color': colors[value] }}
      onClick={() => onClick(value)}
      disabled={disabled}
    >
      ${value}
    </button>
  )
}

// Main game component
export default function Blackjack() {
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [balance, setBalance] = useState(1000)
  const [currentBet, setCurrentBet] = useState(0)
  const [gameState, setGameState] = useState('betting') // betting, playing, dealerTurn, ended
  const [message, setMessage] = useState('Place your bet!')
  const [result, setResult] = useState(null) // win, lose, push, blackjack
  const [stats, setStats] = useState({ wins: 0, losses: 0, pushes: 0, blackjacks: 0 })
  const [dealing, setDealing] = useState(false)

  // Initialize deck
  useEffect(() => {
    setDeck(shuffleDeck(createDeck()))
  }, [])

  // Draw a card from deck
  const drawCard = useCallback(() => {
    if (deck.length < 10) {
      setDeck(shuffleDeck(createDeck()))
    }
    const card = deck[0]
    setDeck(prev => prev.slice(1))
    return card
  }, [deck])

  // Place bet
  const placeBet = (amount) => {
    if (balance >= amount) {
      setCurrentBet(prev => prev + amount)
      setBalance(prev => prev - amount)
    }
  }

  // Clear bet
  const clearBet = () => {
    setBalance(prev => prev + currentBet)
    setCurrentBet(0)
  }

  // Deal initial cards
  const deal = async () => {
    if (currentBet === 0) return

    setDealing(true)
    setGameState('playing')
    setResult(null)
    setMessage('')

    // Draw cards with slight delays for animation
    const pCard1 = drawCard()
    const dCard1 = drawCard()
    const pCard2 = drawCard()
    const dCard2 = drawCard()

    setPlayerHand([pCard1])
    await new Promise(r => setTimeout(r, 200))
    setDealerHand([dCard1])
    await new Promise(r => setTimeout(r, 200))
    setPlayerHand([pCard1, pCard2])
    await new Promise(r => setTimeout(r, 200))
    setDealerHand([dCard1, dCard2])
    await new Promise(r => setTimeout(r, 300))

    setDealing(false)

    // Check for blackjacks
    const playerBJ = isBlackjack([pCard1, pCard2])
    const dealerBJ = isBlackjack([dCard1, dCard2])

    if (playerBJ && dealerBJ) {
      endGame('push', [pCard1, pCard2], [dCard1, dCard2])
    } else if (playerBJ) {
      endGame('blackjack', [pCard1, pCard2], [dCard1, dCard2])
    } else if (dealerBJ) {
      endGame('lose', [pCard1, pCard2], [dCard1, dCard2])
    } else {
      setMessage('Hit or Stand?')
    }
  }

  // Player hits
  const hit = () => {
    const newCard = drawCard()
    const newHand = [...playerHand, newCard]
    setPlayerHand(newHand)

    const value = calculateHand(newHand)
    if (value > 21) {
      endGame('lose', newHand, dealerHand)
    } else if (value === 21) {
      stand(newHand)
    }
  }

  // Player stands
  const stand = async (currentPlayerHand = playerHand) => {
    setGameState('dealerTurn')
    setMessage('Dealer reveals...')

    let currentDealerHand = [...dealerHand]

    // Dealer draws until 17 or higher
    await new Promise(r => setTimeout(r, 800))

    while (calculateHand(currentDealerHand) < 17) {
      const newCard = drawCard()
      currentDealerHand = [...currentDealerHand, newCard]
      setDealerHand(currentDealerHand)
      await new Promise(r => setTimeout(r, 600))
    }

    // Determine winner
    const playerValue = calculateHand(currentPlayerHand)
    const dealerValue = calculateHand(currentDealerHand)

    if (dealerValue > 21) {
      endGame('win', currentPlayerHand, currentDealerHand)
    } else if (dealerValue > playerValue) {
      endGame('lose', currentPlayerHand, currentDealerHand)
    } else if (playerValue > dealerValue) {
      endGame('win', currentPlayerHand, currentDealerHand)
    } else {
      endGame('push', currentPlayerHand, currentDealerHand)
    }
  }

  // Double down
  const doubleDown = () => {
    if (balance >= currentBet && playerHand.length === 2) {
      setBalance(prev => prev - currentBet)
      setCurrentBet(prev => prev * 2)

      const newCard = drawCard()
      const newHand = [...playerHand, newCard]
      setPlayerHand(newHand)

      const value = calculateHand(newHand)
      if (value > 21) {
        endGame('lose', newHand, dealerHand)
      } else {
        stand(newHand)
      }
    }
  }

  // End the game
  const endGame = (outcome, finalPlayerHand, finalDealerHand) => {
    setGameState('ended')
    setResult(outcome)

    const playerValue = calculateHand(finalPlayerHand)
    const dealerValue = calculateHand(finalDealerHand)

    switch (outcome) {
      case 'blackjack':
        setMessage(`BLACKJACK! You win $${Math.floor(currentBet * 1.5)}!`)
        setBalance(prev => prev + currentBet + Math.floor(currentBet * 1.5))
        setStats(prev => ({ ...prev, wins: prev.wins + 1, blackjacks: prev.blackjacks + 1 }))
        break
      case 'win':
        setMessage(`You win $${currentBet}!`)
        setBalance(prev => prev + currentBet * 2)
        setStats(prev => ({ ...prev, wins: prev.wins + 1 }))
        break
      case 'lose':
        if (playerValue > 21) {
          setMessage('Bust! You lose.')
        } else if (dealerValue === 21 && finalDealerHand.length === 2) {
          setMessage('Dealer Blackjack! You lose.')
        } else {
          setMessage('Dealer wins.')
        }
        setStats(prev => ({ ...prev, losses: prev.losses + 1 }))
        break
      case 'push':
        setMessage('Push! Bet returned.')
        setBalance(prev => prev + currentBet)
        setStats(prev => ({ ...prev, pushes: prev.pushes + 1 }))
        break
    }

    setCurrentBet(0)
  }

  // New round
  const newRound = () => {
    setPlayerHand([])
    setDealerHand([])
    setGameState('betting')
    setMessage('Place your bet!')
    setResult(null)

    // Reshuffle if low
    if (deck.length < 20) {
      setDeck(shuffleDeck(createDeck()))
    }
  }

  // Reset game
  const resetGame = () => {
    setBalance(1000)
    setCurrentBet(0)
    setStats({ wins: 0, losses: 0, pushes: 0, blackjacks: 0 })
    newRound()
    setDeck(shuffleDeck(createDeck()))
  }

  const playerValue = calculateHand(playerHand)
  const dealerValue = calculateHand(dealerHand)
  const canDouble = gameState === 'playing' && playerHand.length === 2 && balance >= currentBet

  return (
    <div className="blackjack">
      {/* Header */}
      <div className="game-header">
        <div className="balance">
          <span className="balance-label">Balance</span>
          <span className="balance-amount">${balance}</span>
        </div>
        <div className="stats-mini">
          <span className="stat-win">W: {stats.wins}</span>
          <span className="stat-lose">L: {stats.losses}</span>
          <span className="stat-push">P: {stats.pushes}</span>
        </div>
      </div>

      {/* Table */}
      <div className={`table ${result ? `result-${result}` : ''}`}>
        {/* Dealer hand */}
        <Hand
          cards={dealerHand}
          label="Dealer"
          value={dealerValue}
          isDealer
          hideFirst={gameState === 'playing'}
          dealing={dealing}
        />

        {/* Message */}
        <div className={`game-message ${result ? 'show-result' : ''}`}>
          {message}
        </div>

        {/* Player hand */}
        <Hand
          cards={playerHand}
          label="You"
          value={playerValue}
          dealing={dealing}
        />
      </div>

      {/* Controls */}
      <div className="controls">
        {gameState === 'betting' && (
          <>
            <div className="bet-area">
              <div className="current-bet">
                <span>Bet: </span>
                <span className="bet-amount">${currentBet}</span>
              </div>
              <div className="chips">
                {[5, 10, 25, 50, 100].map(value => (
                  <Chip
                    key={value}
                    value={value}
                    onClick={placeBet}
                    disabled={balance < value}
                  />
                ))}
              </div>
              <div className="bet-actions">
                <button className="btn btn-clear" onClick={clearBet} disabled={currentBet === 0}>
                  Clear
                </button>
                <button className="btn btn-deal" onClick={deal} disabled={currentBet === 0}>
                  Deal
                </button>
              </div>
            </div>
          </>
        )}

        {gameState === 'playing' && (
          <div className="play-actions">
            <button className="btn btn-hit" onClick={hit}>
              Hit
            </button>
            <button className="btn btn-stand" onClick={() => stand()}>
              Stand
            </button>
            <button className="btn btn-double" onClick={doubleDown} disabled={!canDouble}>
              Double
            </button>
          </div>
        )}

        {gameState === 'dealerTurn' && (
          <div className="waiting">
            <span className="waiting-dots">Dealer playing...</span>
          </div>
        )}

        {gameState === 'ended' && (
          <div className="end-actions">
            <button className="btn btn-new" onClick={newRound} disabled={balance === 0}>
              {balance === 0 ? 'Game Over' : 'New Hand'}
            </button>
            {balance === 0 && (
              <button className="btn btn-reset" onClick={resetGame}>
                Reset ($1000)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reset button always visible */}
      {balance > 0 && gameState !== 'betting' && (
        <button className="btn-reset-corner" onClick={resetGame}>
          Reset
        </button>
      )}
    </div>
  )
}
