
import React from 'react'
import Tiles from './Tiles'
import game from './Game'
import './App.css'

interface AppProps {}

interface AppState {
  score: number,
  addition: number,
  tiles: number[],
  over: boolean,
  won: boolean
}

export default class App extends React.Component<AppProps, AppState> {
  constructor (props: any) {
    super(props)

    game.start()

    this.state = {
      score: 0,
      tiles: game.tiles,
      over: false,
      won: false,
      addition: 0
    }

    this.handleKeydown = this.handleKeydown.bind(this)
    this.restart = this.restart.bind(this)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeydown)

    game.addCallback('over', () => {
      this.setState({ over: true })
    })

    game.addCallback('won', () => {
      this.setState({ won: true })
    })

    game.addCallback('addScore', (score: number) => {
      this.setState({ addition:  score })
    })
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeydown)

    game.removeCallback('over')
    game.removeCallback('won')
    game.removeCallback('addScore')
  }

  render () {
    return (
      <div className="app">
        <div className="game-header">
          <h1 className="title">
            2048
          </h1>
          <div className="score-container">
            {this.state.score}

            {
              this.state.addition !== 0 && <div className="score-addition">
                +{this.state.addition}
              </div>
            }
          </div>
        </div>

        <div className="game-intro">
          <button className="restart-button" onClick={this.restart}>New Game</button>
          <h2 className="subtitle">Play 2048 Game</h2>
          Join the numbers and get to the <b>2048 tile!</b>
        </div>

        <div className="game-container">
          {
            (this.state.won || this.state.over) &&
              <div className={`game-message game-${(this.state.won && 'won') || (this.state.over && 'over')}`}>
                <p>
                  {this.state.won ? 'You win!' : 'Game over!'}
                </p>

                <div className='actions'>
                  <button className='retry-button' onClick={this.restart}>Try again</button>
                </div>
              </div>
          }
          <tiles tiles={this.state.tiles} />
        </div>

        <p className="game-explanation">
          <b className="important">How to play: </b>
          Use your <b>arrow keys</b> to move the tiles. When two tiles with the same number touch, they <b>merge into one!</b>
        </p>
      </div>
    )
  }

  restart (event: any) {
    event.preventDefault()
    game.restart()
    this.setState({
      tiles: game.tiles,
      addition: 0,
      score: 0,
      over: false,
      won: false
    })
  }

  private handleKeydown (event: any) {
    const keyMap : any = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'
    }

    if (game.respond(keyMap[event.code])) {
      this.refreshGameState()
    }
  }

  private refreshGameState () : void {
    this.setState({
      tiles: game.tiles,
      score: game.score,
      over: game.over,
      won: game.won
    })
  }
}
