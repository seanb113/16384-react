import React from 'react'
import Tile from './Tile'

interface tilesProps {
  tiles: number[]
}

interface tilesState {}

export default class tiles extends React.Component<tilesProps, tilesState> {
  render () {
    return (
      <div className="tiles">
        {
          this.tileGroups().map((tiles: number[], groupIndex: number) => {
            return (
              <div key={groupIndex} className="tiles-row">
                {
                  tiles.map((tile: number, tileIndex: number) => {
                    return <tile key={groupIndex * 4 + tileIndex} value={tile} />
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  tileGroups () {
    let groups : any[] = []

    this.props.tiles.forEach((value: number, index: number) => {
      let groupIndex : number = Math.floor(index / 4)
      groups[groupIndex] = groups[groupIndex] || []
      groups[groupIndex].push(value)
    })

    return groups
  }
}