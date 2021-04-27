import React from 'react'
import { useDrop } from 'react-dnd'

import { ItemTypes } from 'components/Board'
import { moveKnight, canMoveKnight } from 'components/Game'
import Square from 'components/Square'

function BoardSquare({ x, y, children }: any) {
  const black = (x + y) % 2 === 1

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.KNIGHT,
    canDrop: () => canMoveKnight(x, y),
    drop: () => moveKnight(x, y),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [x, y])
  
  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Square black={black}>{children}</Square>
      {isOver && !canDrop && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: 'red',
          }}
        />
      )}
      {!isOver && canDrop && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: 'yellow',
          }}
        />
      )}
      {isOver && canDrop && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: 'green',
          }}
        />
      )}
    </div>
  )
}

export default BoardSquare
