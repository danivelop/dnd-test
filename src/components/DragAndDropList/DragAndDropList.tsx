/* Exteranl dependencies */
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { XYCoord, useDragDropManager } from 'react-dnd'
import Immutable, { isImmutable } from 'immutable'
import { FlattenSimpleInterpolation } from 'styled-components'
import _ from 'lodash'

/* Interanl dependencies */
import { DragItem } from './DragAndDropItem'
import { Wrapper } from './DragAndDropList.styled'

interface OnDropProps<T> {
  dragItem: T
  dragIndex: number
  prevItem?: T
  nextItem?: T
}

interface DragAndDropListProps<T> {
  className?: string
  interpolation?: FlattenSimpleInterpolation
  list: T[] | Immutable.List<T>
  component: (item: T) => React.ReactElement
  onDrop?: (args: OnDropProps<T>) => void
}

function shiftArray(list: any[], removeIndex: number, addIndex: number) {
  const dragItem = list[removeIndex]
  const newList = [...list]
  newList.splice(removeIndex, 1)
  newList.splice(addIndex, 0, dragItem)

  return newList
}

const throttleHover = _.throttle((item, hoverIndex, itemElement, clientOffset, list, setList) => {
  const { index: dragIndex } = item

  if (dragIndex === hoverIndex) {
    return
  }

  const hoverBoundingRect = itemElement.getBoundingClientRect()

  const hoverMiddleY =
    (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

  const hoverClientY = clientOffset.y - hoverBoundingRect.top
  if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    if (dragIndex < hoverIndex - 1) {
      const newList = shiftArray(list, dragIndex, hoverIndex - 1)

      if (newList) {
        setList(newList)
        item.index = hoverIndex - 1
      }
    }
    return
  }

  if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    if (dragIndex > hoverIndex + 1) {
      const newList = shiftArray(list, dragIndex, hoverIndex + 1)

      if (newList) {
        setList(newList)
        item.index = hoverIndex + 1
      }
    }
    return
  }

  const newList = shiftArray(list, dragIndex, hoverIndex)

  if (newList) {
    setList(newList)
    item.index = hoverIndex
  }
}, 50)

function DragAndDropList<T = any>({
  className,
  interpolation,
  list: receivedList,
  component,
  onDrop = _.noop,
}: DragAndDropListProps<T>) {
  const [list, setList] = useState<T[]>(isImmutable(receivedList) ? receivedList.toArray() : receivedList)

  const hoverIndexRef = useRef<number>(0)

  const dragdropManager = useDragDropManager()

  const handleHover = useCallback((item: DragItem, hoverIndex: number, itemElement: HTMLDivElement, clientOffset: XYCoord) => {
    hoverIndexRef.current = hoverIndex
    throttleHover(item, hoverIndex, itemElement, clientOffset, list, setList)
  }, [list])

  const handleDrop = useCallback((item: DragItem) => {
    const { index: dragIndex } = item

    onDrop({
      dragItem: list[dragIndex],
      dragIndex,
      prevItem: list[dragIndex - 1],
      nextItem: list[dragIndex + 1],
    })
  }, [
    list,
    onDrop,
  ])

  const ListComponent = useMemo(() => (
    list.map((item: T, index: number) => (
      React.cloneElement(component(item), {
        index,
        onHover: handleHover,
        onDrop: handleDrop,
      })
    ))
  ), [
    component,
    handleDrop,
    handleHover,
    list,
  ])

  useEffect(() => {
    const monitor = dragdropManager.getMonitor()

    if (!monitor.isDragging()) {
      setList(isImmutable(receivedList) ? receivedList.toArray() : receivedList)
      return
    }

    const newList = [...isImmutable(receivedList) ? receivedList.toArray() : receivedList]
    const dragItem = list[hoverIndexRef.current]
    const dragIndex = newList.findIndex(item => dragItem === item)

    if (dragIndex !== -1) {
      const newItem = newList[dragIndex]
      newList.splice(dragIndex, 1)
      newList.splice(hoverIndexRef.current, 0, newItem)

      setList(newList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedList])

  return (
    <Wrapper
      className={className}
      interpolation={interpolation}
    >
      { ListComponent }
    </Wrapper>
  )
}

export default DragAndDropList
