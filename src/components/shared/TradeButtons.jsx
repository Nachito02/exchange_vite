import styled from 'styled-components'
import { useTranslation } from 'react-i18next';

import Button from './Button'
import { useAppContext } from '../../context'
import { TRADE_TYPES } from '../../utils'

const TradeButtonsFrame = styled.div`
  width: 100%;
  margin: 0.5rem 0rem 0.5rem 0rem;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: row;
  color: '#000';
  flex: 1;

  div {
    width: 100%;
  }

  @media only screen and (max-width: 680px) {
    /* For tablet phones: */
    flex: auto;
    width: 100%;
    justify-content: center;
  }

  @media only screen and (max-width: 576px) {
    /* For mobile phones: */
    flex-direction: column;
  }
`
const TradeButton = styled(Button)`
  max-width: 66%;
  width: 100%;
  padding: 4px;
  margin: 8px;

  @media only screen and (max-width: 680px) {
    /* For tablet phones: */
    max-width: 100%;
  }
`

export function TradeButtons({
  balanceWINES,
  isCrowdsale
}) {
  const [, setState] = useAppContext()

  const { t } = useTranslation();

  function openForm() {
    // let language = localStorage.getItem('i18nextLng');

    // let link = 'https://docs.google.com/forms/d/e/1FAIpQLSeNIuV5Df7KYXNRVUBXPtCy6QajrDUZkKHIMhyYBbiamXEehA/viewform';
    
    // if (language.startsWith('es')) {
    //   link = 'https://docs.google.com/forms/d/1M6wjywzWwGDCS-02F-Yy6-kxOHmeaDDluDpYJnVhyq8'
    // } else if (language.startsWith('pt')) {
    //   link = 'https://docs.google.com/forms/d/1WBhMWUJImMn_pkGbnd0VaD32tu8JCZOOPBndOxn6cKo'
    // }

    // // window.open(link, '_blank');
  }

  function handleToggleCheckout(tradeType) {
    setState(state => ({ ...state, visible: !state.visible, tradeType }))
  }

  return (
    <TradeButtonsFrame>
      {
        isCrowdsale === false &&
          <TradeButton
            disabled={false}
            text={t('labels.buy')}
            onClick={() => {
              openForm()
              handleToggleCheckout(TRADE_TYPES.BUY)
            }}>
          </TradeButton>
      }
      {
        isCrowdsale === false &&
          <TradeButton
            disabled={false}
            text={t('labels.sell')}
            onClick={() => {
              handleToggleCheckout(TRADE_TYPES.SELL)
            }}>
          </TradeButton>
      }
      {
        isCrowdsale &&
          <TradeButton
            disabled={false}
            text={t('labels.buy')}
            onClick={() => {
              openForm()
              handleToggleCheckout(TRADE_TYPES.CROWDSALE)
            }}>
          </TradeButton>
      }
    </TradeButtonsFrame>
  )
}
