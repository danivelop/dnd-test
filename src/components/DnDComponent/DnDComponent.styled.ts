/* Exteranl dependencies */
import styled, { css } from 'styled-components'

interface WrapperProps {
  isDragging: boolean
}

export const Wrapper = styled.div<WrapperProps>`
  display: flex;
  width: 100%;
  border: 1px solid black;
  border-radius: 4px;

  ${({ isDragging }) => isDragging && css`
    opacity: 0;
  `}
`

export const Text = styled.p`
  font-size: 16px;
`

export const DragAndDropListStyle = css`
  width: 500px;
  margin: 0 auto;

  ${Wrapper} + ${Wrapper} {
    margin-top: 10px;
  }
`
