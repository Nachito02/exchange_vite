import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next';
import { defineChain, baseSepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import Button from '../shared/Button'
import { Controls } from './Redeem'
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';

export default function Connect({ setShowConnect, closeCheckout }) {
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: baseSepolia,
  });

  const account = useActiveAccount();

  // connector error
  const [connectorError, setConnectorError] = useState()

  function activateInjected() {
    setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
      setConnectorError(error)
    })
  }

  function activateWalletConnect() {
    setConnector('WalletConnect', { suppressAndThrowErrors: true }).catch(error => {
      setConnectorError(error)
    })
  }

  function getTutorialLink() {
    let language = localStorage.getItem('i18nextLng');

    let link = 'http://wiki.costaflores.com/display/OP/Installing+and+configuring+an+ERC20-compliant+wallet';
    
    if (language.startsWith('es')) {
      link = 'http://wiki.costaflores.com/display/OP/Instalando+y+configurando+un+monedero+ERC20'
    }

    return link;
  }

  const walletconnectUri = connector && connector.walletConnector && connector.walletConnector.uri

  // unset the error on connector change
  useEffect(() => {
    setConnectorError()
  }, [connector])

  // once an account is connected, don't show this screen
  useEffect(() => {
    if (account !== null) {
      setShowConnect(false)
    }
  })

  const { t } = useTranslation();

  return (
    <WalletFrame>
      <Controls closeCheckout={closeCheckout} theme={'dark'} />
      <Shim />
      <Button
        type={'cta'}
        text={t('wallet.browser-wallet')}
        onClick={() => {
          activateInjected()
        }}
      />
      <Shim />
      {/* <Button
        type={'cta'}
        text={t('wallet.wallet-connect')}
        onClick={() => {
          activateWalletConnect()
        }}
      /> */}
      {/* <QRCodeWrapper showQR={walletconnectUri && account === null && !connectorError}>
        {walletconnectUri && account === null && !connectorError ? (
          <>
            <QRCode value={walletconnectUri} renderAs={'svg'} includeMargin={true}/>
            <p> {t('wallet.scan-to-connect')}</p>
          </>
        ) : null}
      </QRCodeWrapper> */}
      {connectorError ? (
        <p style={{ width: '100%', textAlign: 'center', marginTop: '12px' }}>
          {t('wallet.connection-error')}
          <a href="https://wiki.costaflores.com/plugins/servlet/mobile?contentId=11994564#content/view/11994564">{t('wallet.learn-more')}</a>
        </p>
      ) : (
        <p style={{ width: '100%', textAlign: 'center', marginTop: '12px' }}>
          {t('wallet.dont-have-one')}{' '}
          <a href={getTutorialLink()} style={{color: 'white'}}>{t('wallet.learn-more')}</a>
        </p>
      )}
    </WalletFrame>
  )
}

const WalletFrame = styled.div`
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
`

const Shim = styled.div`
  width: 100%;
  height: 1rem;
`

const QRCodeWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: ${props => (props.showQR ? '1rem' : 0)};
`
