import React, { useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import BoardSquare from 'components/BoardSquare'
import Knight from 'components/Knight'

interface BoardProps {
  knightPosition: number[]
}

export const ItemTypes = {
  KNIGHT: 'knight'
}

function Board({ knightPosition }: BoardProps) {
  const renderPiece = useCallback((x, y, [knightX, knightY]) => {
    if (x === knightX && y === knightY) {
      return <Knight />
    }
    return null
  }, [])

  const renderSquare = useCallback((i, knightPosition) => {
    const x = i % 8
    const y = Math.floor(i / 8)

    return (
      <div
        key={i}
        style={{ width: '12.5%', height: '12.5%' }}
      >
        <BoardSquare x={x} y={y}>
          {renderPiece(x, y, knightPosition)}
        </BoardSquare>
      </div>
    )
  }, [renderPiece])

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          width: '840px',
          height: '840px',
          display: 'flex',
          flexWrap: 'wrap',
          border: '1px solid black',
        }}
      >
        {(new Array(64).fill(0)).map((_, index) => renderSquare(index, knightPosition))}
      </div>
    </DndProvider>
  )
}

export default Board