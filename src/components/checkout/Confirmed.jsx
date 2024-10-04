import React, { useEffect } from 'react'
import styled from 'styled-components'

import { amountFormatter, TRADE_TYPES } from '../../utils'
import Button from '../shared/Button'

import { Close } from '@styled-icons/material/Close';

import { useAppContext } from '../../context'
import CheckImage from '../shared/CheckImage'
import { useTranslation } from 'react-i18next';

const ConfirmedFrame = styled.div`
  width: 100%;
  /* padding: 2rem; */
  box-sizing: border-box;
  font-size: 36px;
  font-weight: 500;
  /* line-height: 170%; */
  text-align: center;
`

function Controls({ closeCheckout }) {
  const { t } = useTranslation();

  return (
    <FrameControls>
      <Unicorn>
        <span role="img" aria-label="unicorn">
        </span>{' '}
        {t('labels.pay')}
      </Unicorn>
      <CloseFrame onClick={() => closeCheckout()} alt="close"></CloseFrame>
    </FrameControls>
  )
}

const FrameControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

const Unicorn = styled.p`
  color: #fff;
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`

export default function Confirmed({ hash, type, amount, clearLastTransaction, closeCheckout }) {
  const [state, setState] = useAppContext()

  function link(hash) {
    switch(parseInt(state.networkId)) {
      case 3:
        return `https://ropsten.etherscan.io/tx/${hash}` 
      case 4:
        return `https://rinkeby.etherscan.io/tx/${hash}` 
        case 10:
          return `https://optimistic.etherscan.io/tx/${hash}`	
      default:
        return `https://etherscan.io/tx/${hash}`
    }
  }

  useEffect(() => {
    if (!state.visible) {
      clearLastTransaction()
    }
  }, [state.visible, clearLastTransaction])

  const { t } = useTranslation();

  if (type === TRADE_TYPES.UNLOCK) {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout} />
          <CheckImage></CheckImage>
          <InfoFrame>
            <Owned>
              <p> {t('wallet.unlock-token')} </p>
            </Owned>
          </InfoFrame>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
            {t('wallet.view-etherscan')}
          </EtherscanLink>
        </CheckoutPrompt>
        <Shim />
      </ConfirmedFrame>
    )
  } else if (type === TRADE_TYPES.BUY) {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout} />
          <CheckImage></CheckImage>
          <InfoFrame>
            <Owned>
              <p> {t('wallet.you-got-tokens', { amount: amountFormatter(amount, 18, 0), token: state.tokenName})}</p>
            </Owned>
          </InfoFrame>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
            {t('wallet.transaction-details')} ↗
          </EtherscanLink>
        </CheckoutPrompt>
        <ButtonFrame
          text={t('wallet.redeem-your-token', {token: state.tokenName})}
          type={'cta'}
          onClick={() => {
            clearLastTransaction()
            setState(state => ({ ...state, tradeType: TRADE_TYPES.REDEEM }))
            // Trigger buy frame here!
          }}
        />
        {/* <Shim /> */}
      </ConfirmedFrame>
    )
  } else if (type === TRADE_TYPES.SELL) {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout} />
          <CheckImage></CheckImage>
          <InfoFrame>
            <Owned>
              <p> {t('wallet.sold-wine')}</p>
            </Owned>
          </InfoFrame>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
            {t('wallet.transaction-details')} ↗
          </EtherscanLink>
        </CheckoutPrompt>
        {/* <Shim /> */}
      </ConfirmedFrame>
    )
  } else {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout} />
          <CheckImage></CheckImage>
          <InfoFrame>
            <Owned>
              <p> {t('wallet.you-got-tokens', { amount: amountFormatter(amount, 18, 0), token: state.tokenName})} </p>
            </Owned>
          </InfoFrame>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
            {t('wallet.transaction-details')} ↗
          </EtherscanLink>
        </CheckoutPrompt>
        {/* <Shim /> */}
      </ConfirmedFrame>
    )
  }
}

const TopFrame = styled.div`
  width: 100%;
  background-color: #141414;
  border-radius: 8px;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 32px;
  box-sizing: border-box;
`
const Shim = styled.div`
  height: 20px;
`

const CloseFrame = styled(Close)`
  width: 25px;
  color: #fff;
  font-weight: 600;
  margin: 0px;
  /* margin-right: 2px;
  margin-top: -7px; */
  height: 25px;
  font-size: 16px;
  padding: 4px;
  cursor: pointer;
`
const ButtonFrame = styled(Button)`
  width: calc(100% - 64px);
  margin: 16px 32px;
  height: 48px;
  padding: 16px;
`

const InfoFrame = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: 0;
  justify-content: 'center';
  align-items: flex-end;
  padding: 0;
  /* padding: 1rem 0 1rem 0; */
  margin-top: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  /* background-color: ${props => (props.hasPickedAmount ? '#000' : 'none')}; */
  /* border: ${props => (props.hasPickedAmount ? '1px solid #3d3d3d' : 'none')}; */
`

const Owned = styled.div`
  font-weight: 700;
  color: #efe7e4;
  font-size: 24px;
  margin-bottom: 12px;
  margin: 0px;
  white-space: pre-wrap;
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  padding: 0 32px;
  text-align: left;
  color: '#000';
  font-style: italic;
  width: 100%;
  box-sizing: border-box;
`
const EtherscanLink = styled.a`
  text-decoration: none;
  color: var(--uniswap-primary):
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`
