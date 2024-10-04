import React from 'react'
import styled from 'styled-components'
import { Plus } from '@styled-icons/evil';
import { Minus } from '@styled-icons/evil';
import { useCount } from '../checkout/Checkout'

const SelectFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  color: #fff;
  padding: 16px 0;

  /* margin-top: 0.5rem;
  margin-bottom: 0.5rem; */
`

const SelectMenu = styled.div`
  font-size: 1.5rem;
  font-weight: 300;
  padding: 0 16px;
  box-sizing: border-box;
  margin: 0;
  border: none;
  text-align: center;
`

const IncrementButton = styled(Plus)`
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const DecrementButton = styled(Minus)`
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const InputCount = styled.input`
  font-size: 1.5rem;
  font-weight: 300;
  padding: 0 16px;
  box-sizing: border-box;
  margin: 0;
  border: none;
  text-align: center;
  background-color: #141414;
  color: #fff;
  border: 1px solid #fff;
  width: 50%;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Ocultar flechas en Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
`

export default function IncrementToken({ initialValue, max, step }) {
  const [count, incrementCount, decrementCount, setCount] = useCount(initialValue, max, step)
  return (
    <SelectFrame>
      <DecrementButton size="34" onClick={decrementCount}></DecrementButton>
      {/* <SelectMenu>{count}</SelectMenu>
       */}

       <InputCount value={count} type='number' onChange={e => setCount(parseInt(e.target.value))} />
      <IncrementButton size="34" onClick={incrementCount}></IncrementButton>
    </SelectFrame>
  )
}
