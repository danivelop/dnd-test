/* Exteranl dependencies */
import styled, { FlattenSimpleInterpolation } from 'styled-components'

interface WrapperProps {
  interpolation?: FlattenSimpleInterpolation
}

export const Wrapper = styled.div<WrapperProps>`
  ${({ interpolation }) => interpolation}
`