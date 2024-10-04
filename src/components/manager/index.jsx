import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next';
import { getNetworkId } from '../../utils';
import opicon from '../../assets/op_icon.svg';
import ethicon from '../../assets/eth_icon.svg';

export default function Web3ReactManager({ children }) {
  // const { setConnector, error, active } = useWeb3Context()
  const { t } = useTranslation();

  // initialization management
  useEffect(() => {
    if (!active) {
      if (window.ethereum) {
        try {
          const library = new ethers.providers.Web3Provider(window.ethereum)
          library.listAccounts().then(accounts => {
            if (accounts.length >= 1) {
              setConnector('Injected')
            } else {
              setConnector('Network')
            }
          })
        } catch {
          setConnector('Network')
        }
      } else {
        setConnector('Network')
      }
    }
  }, [active, setConnector])

  const [, setShowLoader] = useState(false)
  useEffect(() => {
 
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 750)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  async function changeNetwork(networkName) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  
    const networks = {
      mainnet: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io']
      },
      optimism: {
        chainId: '0xa',
        chainName: 'Optimism',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://optimism-mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://optimistic.etherscan.io']
      },
      sepolia: {
        chainId: '0xaa37dc',
        chainName: 'Sepolia OP',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://optimism-sepolia.infura.io/v3'],
        blockExplorerUrls: ['https://optimistic.etherscan.io']
      },
    };
  
    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: networks[networkName].chainId }]);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.send("wallet_addEthereumChain", [networks[networkName]]);
        } catch (addError) {
          console.error('Error al agregar la red:', addError);
        }
      }
    }
  }
  let bodyContent;

  if(getNetworkId() === 11155420) {
     bodyContent = (<CardWrapper>
     <Text>{t('wallet.invalid-network')} </Text>
      <Text>{t('wallet.select-sepolia-op')}</Text>
      <ButtonFrame onClick={() => changeNetwork('sepolia')}>{t('wallet.select-button')}<img width={30} src='https://costaflores.openvino.exchange/static/costaflores/assets/op_icon.svg' /></ButtonFrame>
    </CardWrapper>)
   }

   if (getNetworkId() === 10) {
    bodyContent = (<CardWrapper>
     <Text>{t('wallet.invalid-network')} </Text>
      <Text>{t('wallet.select-op')}</Text>
      <ButtonFrame onClick={() => changeNetwork('optimism')}>{t('wallet.select-button')} <img width={30} src='https://costaflores.openvino.exchange/static/costaflores/assets/op_icon.svg' /></ButtonFrame>
    </CardWrapper>)
   }

   if (getNetworkId() === 1) {
    bodyContent = (<CardWrapper>
       <Text>{t('wallet.invalid-network')} </Text>
      <Text>{t('wallet.select-eth')}</Text>
      <ButtonFrame onClick={() => changeNetwork('mainnet')}>{t('wallet.select-button')}<img width={20} src='https://costaflores.openvino.exchange/static/costaflores/assets/eth_icon.svg' /></ButtonFrame>
    </CardWrapper>)
   }

  if (error && error.message.startsWith("Unsupported Network")) {
    console.log(error.message);
    return (
      <Container>
        {bodyContent}
      </Container>
    )
  }

  if (error || !active) {
    return (<div></div>);
  } else {
    return children
  }
}

const Container = styled.div`
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 64px;

  @media only screen and (max-width: 480px) {
    margin: 32px;
  }
`

const CardWrapper = styled.div`
  max-width: 750px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: #f1ede2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: default;
  padding: 32px 32px 16px 32px;
  z-index: 1;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
  box-sizing: border-box;

  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    // flex-direction: column;
  }
`

const ButtonFrame = styled.button`
  gap:10px;
  font-family: Futura, Helvetica, sans-serif;
  padding: 0;
  text-align: center;
  border-radius: 8px;
  box-sizing: border-box;
  height: 44px;
  width: 50%;
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
  justify-content: center;
  :hover {
    transform: scale(1.02);
  }
`

const Text = styled.p`
  text-align: center;}
  maring: 0px;
`
