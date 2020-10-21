class Game {
  
  static Steps : string[] = ['up', 'down', 'left', 'right']

  tiles: number[]

  score: number

  over: boolean

  won: boolean

  callbacks: any

  constructor () {
    this.tiles = []
    this.score = 0
    this.over  = false
    this.won   = false
    this.callbacks = {}
  }

  start () : void {
    this.init()
  }

  restart () : void {
    this.init()
  }

  up () : void {
    let score = 0

    for (let rowIndex = 12; rowIndex < 16; rowIndex++) {
      let index = rowIndex

      for (let columnIndex = rowIndex - 4; columnIndex >= rowIndex - 12; columnIndex -= 4) {
        let rowValue = this.tiles[index]
        let colValue = this.tiles[columnIndex]

        if (colValue === 0) {
          this.tiles[index] = 0
          this.tiles[columnIndex] = rowValue
        } else if (rowValue === colValue) {
          this.tiles[index] = 0
          this.tiles[columnIndex] = rowValue + colValue
          score += rowValue
          if (this.tiles[columnIndex] === 2048) {
            this.won = true
            this.callbacks['won'] && this.callbacks['won']()
          }

          if (columnIndex > rowIndex - 12 && this.tiles[columnIndex - 4] === this.tiles[columnIndex]) break
        }

        index = columnIndex
      }
    }

    if (score !== 0) this.addScore(score)
  }

  down () : void {
    let score = 0

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      let index = rowIndex

      for (let columnIndex = rowIndex + 4; columnIndex <= rowIndex + 12; columnIndex += 4) {
        let rowValue = this.tiles[index]
        let colValue = this.tiles[columnIndex]

        if (colValue === 0) {
          this.tiles[index] = 0
          this.tiles[columnIndex] = rowValue
        } else if (rowValue === colValue) {
          this.tiles[index] = 0
          this.tiles[columnIndex] = rowValue + colValue
          score += rowValue

          if (this.tiles[columnIndex] === 2048) {
            this.won = true
            this.callbacks['won'] && this.callbacks['won']()
          }

          if (columnIndex < rowIndex + 12 && this.tiles[columnIndex + 4] === this.tiles[columnIndex]) break
        }

        index = columnIndex
      }
    }

    if (score !== 0) this.addScore(score)
  }

  left () : void {
    let score = 0

    for (let columnIndex = 3; columnIndex <= 15; columnIndex += 4) {
      let index = columnIndex

      for (let rowIndex = columnIndex - 1; rowIndex >= columnIndex - 3; rowIndex--) {
        let columnValue = this.tiles[index]
        let rowValue = this.tiles[rowIndex]

        if (rowValue === 0) {
          this.tiles[index] = 0
          this.tiles[rowIndex] = columnValue
        } else if (columnValue === rowValue) {
          this.tiles[index] = 0
          this.tiles[rowIndex] = columnValue + rowValue
          score += columnValue

          if (this.tiles[rowIndex] === 2048) {
            this.won = true
            this.callbacks['won'] && this.callbacks['won']()
          }

          if (rowIndex < columnIndex - 3 && this.tiles[rowIndex - 1] === this.tiles[rowIndex]) break
        }

        index = rowIndex
      }
    }

    if (score !== 0) this.addScore(score)
  }

  right () : void {
    let score = 0

    for (let columnIndex = 0; columnIndex <= 12; columnIndex += 4) {
      let index = columnIndex

      for (let rowIndex = columnIndex + 1; rowIndex <= columnIndex + 3; rowIndex++) {
        let columnValue = this.tiles[index]
        let rowValue = this.tiles[rowIndex]

        if (rowValue === 0) {
          this.tiles[index] = 0
          this.tiles[rowIndex] = columnValue
        } else if (columnValue === rowValue) {
          this.tiles[index] = 0
          this.tiles[rowIndex] = columnValue + rowValue
          score += columnValue

          if (this.tiles[rowIndex] === 2048) {
            this.won = true
            this.callbacks['won'] && this.callbacks['won']()
          }

          if (rowIndex < columnIndex + 3 && this.tiles[rowIndex + 1] === this.tiles[rowIndex]) break
        }

        index = rowIndex
      }
    }

    if (score !== 0) this.addScore(score)
  }

  dispatch (step: string) : boolean {
    switch (step) {
      case "up":
        this.up()
        return true
      case "down":
        this.down()
        return true
      case "left":
        this.left()
        return true
      case "right":
        this.right()
        return true
      default:
        return false
    }
  }

  respond (step: string) : boolean {
    if (!this.over && !this.won && this.dispatch(step)) {
      this.generateBlock()
      this.checkOver()
      return true
    }

    return false
  }

  addCallback (event: string, callback: any) : void {
    this.callbacks[event] = callback
  }

  removeCallback (event: string) : void {
    delete this.callbacks[event]
  }

  init () : void {
    this.tiles = Array(16).fill(0)
    Array(2).fill(null).forEach(this.generateBlock.bind(this))
    this.score = 0
    this.won = false
    this.over = false
  }

 checkOver () : boolean {
    if (this.hasEmptytile()) return false

    for (let i = 0; i < Game.Steps.length; i++) {
      const tiles = this.tiles.slice()

      this.dispatch(Game.Steps[i])

      if (this.hasEmptytile()) {
        this.tiles = tiles
        return false
      }

      this.tiles = tiles
    }

    this.over = true
    this.callbacks['over'] && this.callbacks['over']()
    return true
  }

  addScore (score: number) {
    this.score = this.score + score

    this.callbacks['addScore'] && this.callbacks['addScore'](score)
  }

  hasEmptytile (): boolean {
    return this.tiles.filter(tile => tile === 0).length !== 0
  }

  generateBlock (): void {
    while (this.hasEmptytile()) {
      const randomIndex = Math.floor(Math.random() * 16)

      if (this.tiles[randomIndex] === 0) {
        if (Math.random() < 0.5) {
          this.tiles[randomIndex] = 2
        } else {
          this.tiles[randomIndex] = 4
        }
        break
      }
    }
  }
}

export default new Game()