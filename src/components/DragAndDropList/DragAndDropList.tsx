/* Exteranl dependencies */
import React, { useState, useMemo, useCallback } from 'react'
import { DndProvider, XYCoord } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Immutable, { isImmutable } from 'immutable'
import { FlattenSimpleInterpolation } from 'styled-components'
import _ from 'lodash'

/* Interanl dependencies */
import { DragItem } from './DragAndDropItem'
import { Wrapper } from './DragAndDropList.styled'

interface DragAndDropListProps<T> {
  className?: string
  interpolation?: FlattenSimpleInterpolation
  list: T[] | Immutable.List<T>
  component: (item: T) => React.ReactElement
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
    return
  }

  if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    return
  }

  const dragItem = list[dragIndex]
  const newList = [...list]
  newList.splice(dragIndex, 1)
  newList.splice(hoverIndex, 0, dragItem)

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
}: DragAndDropListProps<T>) {
  const [list, setList] = useState<T[]>(isImmutable(receivedList) ? receivedList.toArray() : receivedList)

  const handleHover = useCallback((item: DragItem, hoverIndex: number, itemElement: HTMLDivElement, clientOffset: XYCoord) => {
    throttleHover(item, hoverIndex, itemElement, clientOffset, list, setList)
  }, [list])

  const handleDrop = useCallback(() => {}, [])

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

  return (
    <DndProvider backend={HTML5Backend}>
      <Wrapper
        className={className}
        interpolation={interpolation}
      >
        { ListComponent }
      </Wrapper>
    </DndProvider>
  )
}

export default DragAndDropList
