/* Exteranl dependencies */
import React, { useState, useMemo, useCallback, useRef } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FlattenSimpleInterpolation } from 'styled-components'
import _ from 'lodash'

/* Interanl dependencies */
import { Wrapper } from './DragAndDropList.styled'

interface DragAndDropListProps<T> {
  className?: string
  interpolation?: FlattenSimpleInterpolation
  list: T[]
  component: (...args: any[]) => React.ReactElement | React.ReactElement
}

type ThrottleHandlerType<T = any> = (hoverdIndex: number, list: T[]) => T[] | void

let globalOriginIndex = 0

const throttleHover = _.throttle((hoverdIndex, list) => {
  if (globalOriginIndex === hoverdIndex) {
    return null
  }

  const isMovingBottom = globalOriginIndex < hoverdIndex

  const preIndex = isMovingBottom ? globalOriginIndex : hoverdIndex
  const postIndex = isMovingBottom ? hoverdIndex : globalOriginIndex

  const middleList = (() => {
    const middle = list.slice(preIndex, postIndex + 1)

    if (_.isEmpty(middle)) {
      return []
    }
    
    if (isMovingBottom) {
      middle.push(middle.shift()!)
    } else {
      middle.unshift(middle.pop()!)
    }

    globalOriginIndex = hoverdIndex

    return middle
  })()

  const newList = [
    ...list.slice(0, preIndex),
    ...middleList,
    ...list.slice(postIndex + 1),
  ]

  return newList
}, 50)

function DragAndDropList<T = any>({
  className,
  interpolation,
  list: receivedList,
  component,
}: DragAndDropListProps<T>) {
  const [list, setList] = useState<T[]>(receivedList)

  const isDraggingRef = useRef(false)

  const handleHover = useCallback((hoverdIndex: number) => {
    if (!isDraggingRef.current) {
      globalOriginIndex = hoverdIndex
      isDraggingRef.current = true
    }

    const newList = throttleHover(hoverdIndex, list)

    if (newList) {
      setList(newList)
    }
  }, [list])

  const handleDrop = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  const ListComponent = useMemo(() => (
    list.map((item, index) => (
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
