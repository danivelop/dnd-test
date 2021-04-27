/* Exteranl dependencies */
import React from 'react'
import {
  useDrag,
  useDrop,
  useDragLayer,
  ConnectDragSource,
  ConnectDropTarget,
} from 'react-dnd'
import _ from 'lodash'

interface ChildrenProps {
  drag: ConnectDragSource
  drop: ConnectDropTarget
  isDragging: boolean
  isDraggingGlobal: boolean
}

interface DragAndDropItemProps {
  type: string
  index?: number
  children: ({ drag, drop, isDragging, isDraggingGlobal }: ChildrenProps) => React.ReactElement
  onHover?: (hoverdIndex: number) => void
  onDrop?: () => void
}

function DragAndDropItem({
  type,
  index = 0,
  children,
  onHover = _.noop,
  onDrop = _.noop,
}: DragAndDropItemProps) {
  const { isDragging: isDraggingGlobal } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }))
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: () => {
      onDrop()
    },
  }), [
    type,
    index,
    onDrop,
  ])

  const [, drop] = useDrop(() => ({
    accept: type,
    hover: () => {
      onHover(index)
    },
  }), [
    type,
    index,
    onHover,
  ])

  return children({ drag, drop, isDragging, isDraggingGlobal })
}

export default DragAndDropItem
