import React from 'react'
import { useDrag } from 'react-dnd'
import { ItemTypes } from 'components/Board'

function Knight() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.KNIGHT,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  return (
    <div
      ref={drag}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        opacity: isDragging ? 0.5 : 1,
        fontSize: '100px',
        fontWeight: 'bold',
        cursor: 'move',
      }}
    >
      ♘
    </div>
  )
}

export default Knight
