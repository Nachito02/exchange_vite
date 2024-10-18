import React from 'react'

import styled, {keyframes} from 'styled-components'

import { Spinner2 } from '@styled-icons/icomoon';

const ButtonFrame = styled.button`
  font-family: Futura, Helvetica, sans-serif;
  padding: 0;
  text-align: center;
  border-radius: 8px;
  box-sizing: border-box;
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: center;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  border-width: 1px;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border-style: solid;
  opacity: 1;
  border-width: 1px;
  border-color: ${props => props.type === 'cta' ? '#d5841b' : '#fff'};
  background: ${props => props.type === 'cta' ? '#d5841b': 'transparent'};
  color: #FFF;
  transform: scale(1);
  transition: transform 0.3s ease;

  :hover {
    transform: scale(1.02);
  }
`

const CtaText = styled.div`
  width: 100%;
`

const CtaTextFlex = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled(Spinner2)`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`

const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.25rem 0 0.3rem;
`

export default function Button({ text, onClick = () => {}, preventDefault = true, pending, ...rest }) {
  return (
    <ButtonFrame
      onClick={e => {
        if (preventDefault) {
          e.preventDefault()
        }
        onClick(e)
      }}
      {...rest}
    >
      {pending ? (
        <CtaTextFlex>
          {text}
          <SpinnerWrapper alt="loader" />{' '}
        </CtaTextFlex>
      ) : (
        <CtaText>{text}</CtaText>
      )}
    </ButtonFrame>
  )
}
