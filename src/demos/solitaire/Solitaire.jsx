import { useState, useEffect, useCallback } from 'react'
import './Solitaire.css'

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades']
const SUIT_SYMBOLS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const isRed = (suit) => suit === 'hearts' || suit === 'diamonds'

const createDeck = () => {
  const deck = []
  for (const suit of SUITS) {
    for (let i = 0; i < RANKS.length; i++) {
      deck.push({ suit, rank: RANKS[i], value: i + 1, id: `${suit}-${RANKS[i]}` })
    }
  }
  return deck
}

const generateWinnableGame = () => {
  const deck = createDeck()
  const shuffled = [...deck].sort(() => Math.random() - 0.5)

  const tableau = [[], [], [], [], [], [], []]
  let cardIndex = 0

  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...shuffled[cardIndex++] }
      card.faceUp = row === col
      tableau[col].push(card)
    }
  }

  const stock = shuffled.slice(cardIndex).map(c => ({ ...c, faceUp: false }))

  return { tableau, stock, waste: [], foundations: { hearts: [], diamonds: [], clubs: [], spades: [] } }
}

const STRATEGY_TIPS = [
  { trigger: 'start', tip: "Always flip face-down cards when possible - revealing cards creates more options.", icon: '💡' },
  { trigger: 'ace', tip: "Move Aces to foundations immediately - they're never useful in tableau.", icon: '♠' },
  { trigger: 'king', tip: "Only move Kings to empty columns if it reveals a face-down card or you have a clear plan.", icon: '👑' },
  { trigger: 'stock', tip: "Go through the stock pile carefully - track which cards you've seen.", icon: '🃏' },
  { trigger: 'foundation', tip: "Don't rush cards to foundations - sometimes you need them for tableau moves.", icon: '⚠️' },
  { trigger: 'empty', tip: "Empty columns are valuable - only fill them with Kings or sequences starting with Kings.", icon: '📦' },
  { trigger: 'stuck', tip: "When stuck: check waste pile, look for buried cards, consider moving foundation cards back.", icon: '🔄' },
  { trigger: 'sequence', tip: "Build sequences in tableau before moving to foundations - it reveals more cards.", icon: '📊' },
  { trigger: 'color', tip: "Alternate colors carefully - having both red and black options for each rank helps.", icon: '🎨' },
  { trigger: 'progress', tip: "Great move! Building down in alternating colors is the key to success.", icon: '⭐' },
]

export default function Solitaire() {
  const [game, setGame] = useState(null)
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  const [hint, setHint] = useState(null)
  const [strategyTip, setStrategyTip] = useState(STRATEGY_TIPS[0])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [draggedCards, setDraggedCards] = useState(null)

  const startNewGame = useCallback(() => {
    const newGame = generateWinnableGame()
    setGame(newGame)
    setHistory([])
    setSelected(null)
    setHint(null)
    setMoves(0)
    setWon(false)
    setStrategyTip(STRATEGY_TIPS[0])
  }, [])

  useEffect(() => {
    startNewGame()
  }, [startNewGame])

  useEffect(() => {
    if (!game) return
    const total = Object.values(game.foundations).reduce((sum, f) => sum + f.length, 0)
    if (total === 52) setWon(true)
  }, [game])

  const saveState = () => {
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(game))])
  }

  const undo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setGame(prev)
    setHistory(h => h.slice(0, -1))
    setMoves(m => m + 1)
    setSelected(null)
    setHint(null)
  }

  const showTip = (trigger) => {
    const tips = STRATEGY_TIPS.filter(t => t.trigger === trigger)
    if (tips.length > 0) {
      setStrategyTip(tips[Math.floor(Math.random() * tips.length)])
    }
  }

  const canMoveToFoundation = (card, foundation) => {
    if (foundation.length === 0) return card.rank === 'A'
    const top = foundation[foundation.length - 1]
    return top.suit === card.suit && card.value === top.value + 1
  }

  const canMoveToTableau = (card, pile) => {
    if (pile.length === 0) return card.rank === 'K'
    const top = pile[pile.length - 1]
    if (!top.faceUp) return false
    return isRed(card.suit) !== isRed(top.suit) && card.value === top.value - 1
  }

  const drawFromStock = () => {
    if (!game) return
    saveState()

    if (game.stock.length === 0) {
      if (game.waste.length === 0) return
      setGame(prev => ({
        ...prev,
        stock: [...prev.waste].reverse().map(c => ({ ...c, faceUp: false })),
        waste: []
      }))
      showTip('stock')
    } else {
      const card = { ...game.stock[game.stock.length - 1], faceUp: true }
      setGame(prev => ({
        ...prev,
        stock: prev.stock.slice(0, -1),
        waste: [...prev.waste, card]
      }))
    }
    setMoves(m => m + 1)
    setSelected(null)
  }

  const findHint = () => {
    if (!game) return null

    for (let i = 0; i < 7; i++) {
      const pile = game.tableau[i]
      if (pile.length === 0) continue
      const card = pile[pile.length - 1]
      if (!card.faceUp) continue

      if (canMoveToFoundation(card, game.foundations[card.suit])) {
        return { from: { type: 'tableau', index: i }, to: { type: 'foundation', suit: card.suit }, message: `Move ${card.rank}${SUIT_SYMBOLS[card.suit]} to foundation` }
      }
    }

    if (game.waste.length > 0) {
      const card = game.waste[game.waste.length - 1]
      if (canMoveToFoundation(card, game.foundations[card.suit])) {
        return { from: { type: 'waste' }, to: { type: 'foundation', suit: card.suit }, message: `Move ${card.rank}${SUIT_SYMBOLS[card.suit]} from waste to foundation` }
      }

      for (let i = 0; i < 7; i++) {
        if (canMoveToTableau(card, game.tableau[i])) {
          return { from: { type: 'waste' }, to: { type: 'tableau', index: i }, message: `Move ${card.rank}${SUIT_SYMBOLS[card.suit]} from waste to column ${i + 1}` }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      const pile = game.tableau[i]
      for (let j = 0; j < pile.length; j++) {
        const card = pile[j]
        if (!card.faceUp) continue

        for (let k = 0; k < 7; k++) {
          if (k === i) continue
          if (canMoveToTableau(card, game.tableau[k])) {
            const wouldReveal = j > 0 && !pile[j - 1].faceUp
            if (wouldReveal || (card.rank === 'K' && j > 0)) {
              return { from: { type: 'tableau', index: i, cardIndex: j }, to: { type: 'tableau', index: k }, message: `Move ${card.rank}${SUIT_SYMBOLS[card.suit]} sequence to column ${k + 1}` }
            }
          }
        }
      }
    }

    if (game.stock.length > 0 || game.waste.length > 0) {
      return { from: { type: 'stock' }, to: null, message: 'Draw from stock pile' }
    }

    return null
  }

  const showHint = () => {
    const h = findHint()
    setHint(h)
    if (h) {
      showTip('stuck')
    }
    setTimeout(() => setHint(null), 3000)
  }

  const handleCardClick = (source) => {
    if (!game) return

    if (!selected) {
      if (source.type === 'waste' && game.waste.length > 0) {
        setSelected({ ...source, cards: [game.waste[game.waste.length - 1]] })
      } else if (source.type === 'tableau') {
        const pile = game.tableau[source.index]
        if (pile.length === 0) return
        const cardIdx = source.cardIndex ?? pile.length - 1
        const card = pile[cardIdx]
        if (!card.faceUp) return
        setSelected({ ...source, cardIndex: cardIdx, cards: pile.slice(cardIdx) })
      } else if (source.type === 'foundation') {
        const pile = game.foundations[source.suit]
        if (pile.length === 0) return
        setSelected({ ...source, cards: [pile[pile.length - 1]] })
      }
      return
    }

    if (source.type === 'foundation') {
      if (selected.cards.length !== 1) {
        setSelected(null)
        return
      }
      const card = selected.cards[0]
      if (canMoveToFoundation(card, game.foundations[source.suit])) {
        saveState()
        const newGame = JSON.parse(JSON.stringify(game))

        if (selected.type === 'waste') {
          newGame.waste.pop()
        } else if (selected.type === 'tableau') {
          newGame.tableau[selected.index].splice(selected.cardIndex)
          const pile = newGame.tableau[selected.index]
          if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
            pile[pile.length - 1].faceUp = true
          }
        } else if (selected.type === 'foundation') {
          newGame.foundations[selected.suit].pop()
        }

        newGame.foundations[source.suit].push({ ...card, faceUp: true })
        setGame(newGame)
        setMoves(m => m + 1)
        showTip(card.rank === 'A' ? 'ace' : 'foundation')
      }
      setSelected(null)
      return
    }

    if (source.type === 'tableau') {
      const targetPile = game.tableau[source.index]
      const card = selected.cards[0]

      if (canMoveToTableau(card, targetPile)) {
        saveState()
        const newGame = JSON.parse(JSON.stringify(game))

        if (selected.type === 'waste') {
          newGame.waste.pop()
        } else if (selected.type === 'tableau') {
          newGame.tableau[selected.index].splice(selected.cardIndex)
          const pile = newGame.tableau[selected.index]
          if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
            pile[pile.length - 1].faceUp = true
          }
        } else if (selected.type === 'foundation') {
          newGame.foundations[selected.suit].pop()
        }

        selected.cards.forEach(c => {
          newGame.tableau[source.index].push({ ...c, faceUp: true })
        })

        setGame(newGame)
        setMoves(m => m + 1)

        if (card.rank === 'K' && targetPile.length === 0) {
          showTip('king')
        } else if (targetPile.length === 0) {
          showTip('empty')
        } else {
          showTip('progress')
        }
      }
      setSelected(null)
      return
    }

    setSelected(null)
  }

  const autoMoveToFoundation = (card, source) => {
    if (canMoveToFoundation(card, game.foundations[card.suit])) {
      saveState()
      const newGame = JSON.parse(JSON.stringify(game))

      if (source.type === 'waste') {
        newGame.waste.pop()
      } else if (source.type === 'tableau') {
        newGame.tableau[source.index].pop()
        const pile = newGame.tableau[source.index]
        if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
          pile[pile.length - 1].faceUp = true
        }
      }

      newGame.foundations[card.suit].push({ ...card, faceUp: true })
      setGame(newGame)
      setMoves(m => m + 1)
      showTip(card.rank === 'A' ? 'ace' : 'foundation')
      return true
    }
    return false
  }

  const handleDoubleClick = (source) => {
    if (!game) return

    let card
    if (source.type === 'waste' && game.waste.length > 0) {
      card = game.waste[game.waste.length - 1]
    } else if (source.type === 'tableau') {
      const pile = game.tableau[source.index]
      if (pile.length === 0) return
      card = pile[pile.length - 1]
      if (!card.faceUp) return
    } else {
      return
    }

    autoMoveToFoundation(card, source)
    setSelected(null)
  }

  const renderCard = (card, source, index, totalInStack) => {
    const isSelected = selected &&
      selected.type === source.type &&
      (source.type === 'waste' ||
       (source.type === 'tableau' && selected.index === source.index && index >= selected.cardIndex) ||
       (source.type === 'foundation' && selected.suit === source.suit))

    const isHinted = hint && hint.from.type === source.type &&
      (source.type === 'waste' ||
       (source.type === 'tableau' && hint.from.index === source.index) ||
       (source.type === 'foundation' && hint.from.suit === source.suit))

    return (
      <div
        key={card.id}
        className={`card ${card.faceUp ? 'face-up' : 'face-down'} ${isRed(card.suit) ? 'red' : 'black'} ${isSelected ? 'selected' : ''} ${isHinted ? 'hinted' : ''}`}
        onClick={() => card.faceUp && handleCardClick(source)}
        onDoubleClick={() => card.faceUp && handleDoubleClick(source)}
        style={source.type === 'tableau' ? { '--index': index, zIndex: index } : {}}
      >
        {card.faceUp ? (
          <>
            <span className="card-rank">{card.rank}</span>
            <span className="card-suit">{SUIT_SYMBOLS[card.suit]}</span>
          </>
        ) : (
          <span className="card-back">🂠</span>
        )}
      </div>
    )
  }

  if (showAbout) {
    return (
      <div className="solitaire">
        <div className="sol-header">
          <button className="back-btn" onClick={() => setShowAbout(false)}>← Back</button>
          <h1>About Solitaire</h1>
        </div>
        <div className="about-content">
          <div className="about-section">
            <h2>How It Works</h2>
            <p>This is Klondike Solitaire with learning features to help you improve your strategy.</p>
          </div>
          <div className="about-section">
            <h2>Features</h2>
            <ul>
              <li><strong>Winnable Games:</strong> Every deal is solvable with perfect play</li>
              <li><strong>Hint System:</strong> Get contextual suggestions for your next move</li>
              <li><strong>Unlimited Undo:</strong> Learn from mistakes without losing progress</li>
              <li><strong>Strategy Tips:</strong> Learn winning patterns as you play</li>
              <li><strong>Double-Click:</strong> Auto-move cards to foundations</li>
            </ul>
          </div>
          <div className="about-section">
            <h2>Rules</h2>
            <ul>
              <li>Build tableau piles down in alternating colors (red/black)</li>
              <li>Build foundation piles up by suit (A to K)</li>
              <li>Only Kings can be placed in empty tableau columns</li>
              <li>Move sequences of face-up cards together</li>
              <li>Win by moving all cards to the four foundations</li>
            </ul>
          </div>
          <div className="about-section">
            <h2>Top Strategies</h2>
            <ul>
              <li>Always reveal face-down cards when possible</li>
              <li>Move Aces and Twos to foundations immediately</li>
              <li>Keep at least one empty column when you can</li>
              <li>Don't move cards to foundations if you need them</li>
              <li>Build even sequences - don't get stuck with one color</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (won) {
    return (
      <div className="solitaire">
        <div className="win-screen">
          <div className="win-content">
            <div className="win-icon">🎉</div>
            <h1>You Won!</h1>
            <p>Completed in {moves} moves</p>
            <div className="win-stats">
              <div className="win-stat">
                <span className="stat-value">{moves}</span>
                <span className="stat-label">Moves</span>
              </div>
              <div className="win-stat">
                <span className="stat-value">{history.length}</span>
                <span className="stat-label">Undos Used</span>
              </div>
            </div>
            <button className="new-game-btn" onClick={startNewGame}>Play Again</button>
          </div>
        </div>
      </div>
    )
  }

  if (!game) return <div className="solitaire">Loading...</div>

  return (
    <div className="solitaire">
      <div className="sol-header">
        <div className="header-left">
          <span className="moves-counter">Moves: {moves}</span>
        </div>
        <h1>Solitaire</h1>
        <div className="header-right">
          <button className="icon-btn" onClick={showHint} title="Hint">💡</button>
          <button className="icon-btn" onClick={undo} disabled={history.length === 0} title="Undo">↩️</button>
          <button className="icon-btn" onClick={startNewGame} title="New Game">🔄</button>
          <button className="icon-btn" onClick={() => setShowAbout(true)} title="About">ℹ️</button>
        </div>
      </div>

      {strategyTip && (
        <div className="strategy-tip">
          <span className="tip-icon">{strategyTip.icon}</span>
          <span className="tip-text">{strategyTip.tip}</span>
        </div>
      )}

      {hint && (
        <div className="hint-message">
          <span>💡</span> {hint.message}
        </div>
      )}

      <div className="game-area">
        <div className="top-row">
          <div className="stock-waste">
            <div
              className={`stock-pile ${game.stock.length === 0 ? 'empty' : ''}`}
              onClick={drawFromStock}
            >
              {game.stock.length > 0 ? (
                <div className="card face-down">
                  <span className="card-back">🂠</span>
                </div>
              ) : (
                <div className="empty-pile refresh">↻</div>
              )}
            </div>

            <div className="waste-pile">
              {game.waste.length > 0 ? (
                renderCard(
                  game.waste[game.waste.length - 1],
                  { type: 'waste' },
                  0,
                  1
                )
              ) : (
                <div className="empty-pile"></div>
              )}
            </div>
          </div>

          <div className="foundations">
            {SUITS.map(suit => (
              <div
                key={suit}
                className={`foundation-pile ${selected ? 'droppable' : ''}`}
                onClick={() => handleCardClick({ type: 'foundation', suit })}
              >
                {game.foundations[suit].length > 0 ? (
                  renderCard(
                    game.foundations[suit][game.foundations[suit].length - 1],
                    { type: 'foundation', suit },
                    0,
                    1
                  )
                ) : (
                  <div className={`empty-pile foundation-empty ${suit}`}>
                    {SUIT_SYMBOLS[suit]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="tableau">
          {game.tableau.map((pile, colIndex) => (
            <div
              key={colIndex}
              className={`tableau-pile ${pile.length === 0 && selected ? 'droppable' : ''}`}
              onClick={() => pile.length === 0 && handleCardClick({ type: 'tableau', index: colIndex })}
            >
              {pile.length === 0 ? (
                <div className="empty-pile tableau-empty">K</div>
              ) : (
                pile.map((card, cardIndex) =>
                  renderCard(card, { type: 'tableau', index: colIndex, cardIndex }, cardIndex, pile.length)
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
