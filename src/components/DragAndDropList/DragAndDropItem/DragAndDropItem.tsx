/* Exteranl dependencies */
import React, { useRef } from 'react'
import {
  useDrag,
  useDrop,
  useDragLayer,
  DragSourceMonitor,
  DropTargetMonitor,
  XYCoord,
} from 'react-dnd'
import _ from 'lodash'

interface ChildrenProps {
  itemRef: React.RefObject<HTMLDivElement>
  isDragging: boolean
  isDraggingGlobal: boolean
}

interface DragAndDropItemProps {
  type: string
  index?: number
  children: ({ itemRef, isDragging, isDraggingGlobal }: ChildrenProps) => React.ReactElement
  onHover?: (item: DragItem, hoverIndex: number, itemElement: HTMLDivElement, clientOffset: XYCoord) => void
  onDrop?: () => void
}

export interface DragItem {
  index: number
  type: string
}

function DragAndDropItem({
  type,
  index = 0,
  children,
  onHover = _.noop,
  onDrop = _.noop,
}: DragAndDropItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  const { isDragging: isDraggingGlobal } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }))
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
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
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      const clientOffset = monitor.getClientOffset()

      if (!itemRef.current || !clientOffset) {
        return
      }

      onHover(item, index, itemRef.current, clientOffset)
    },
  }), [
    type,
    index,
    onHover,
  ])

  drag(drop(itemRef))

  return children({ itemRef, isDragging, isDraggingGlobal })
}

export default DragAndDropItem
