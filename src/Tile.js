import React from 'react'

interface TileProps {
  value: number
}

interface TileState {}

export default class Tile extends React.Component<TileProps, TileState> {
  render () {
    return (
      <div className={`tile tile-${this.props.value}`}>
        {this.props.value}
      </div>
    )
  }
}