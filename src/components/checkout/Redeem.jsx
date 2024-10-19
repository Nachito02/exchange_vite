import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { client } from "../../config/thirdwebClient";
import { defineChain, optimismSepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import axios from 'axios';
import { useAppContext } from '../../context';
import { useTranslation } from 'react-i18next';
import Button from '../shared/Button'
import { amountFormatter, closestIntegerDivisibleBy, USDToEth } from '../../utils'
import IncrementToken from '../shared/IncrementToken'
import { Close } from '@styled-icons/material/Close';
import Confetti from 'react-dom-confetti'
import CheckImage from '../shared/CheckImage'
import RedeemForm from '../redeem/RedeemForm';
import { Circle, CheckCircle, Award } from '@styled-icons/boxicons-regular';
import { fetchRedeems, updateRedeem } from '../../utils/fetchRedeems';
import { BigNumber, ethers } from 'ethers';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';

const config = {
  angle: 90,
  spread: 76,
  startVelocity: 51,
  elementCount: 154,
  dragFriction: 0.1,
  duration: 7000,
  stagger: 0,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
}

export function Controls({ closeCheckout, theme, type }) {
  const { t } = useTranslation();
  return (
    <FrameControls>
      <Unicorn theme={theme}>
        {t('labels.redeem')}
      </Unicorn>

      <CloseFrame onClick={() => closeCheckout()} alt="close"></CloseFrame>
    </FrameControls>
  )
}

export default function Redeem({
  USDExchangeRateETH,
  burn,
  transferShippingCosts,
  balanceWINES,
  setShowConnect,
  closeCheckout
}) {
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: optimismSepolia,
  });

  const account = useActiveAccount();
  const [state] = useAppContext()

  const [numberBurned, setNumberBurned] = useState()
  const [hasPickedAmount, setHasPickedAmount] = useState(false)
  const [hasConfirmedAddress, setHasConfirmedAddress] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [burnTxHash, setBurnTxHash] = useState('')
  const [lastTransactionHash, setLastTransactionHash] = useState('')

  const [hasBurnt, setHasBurnt] = useState(false)
  const [hasPaidShipping, setHasPaidShipping] = useState(false)
  const [userForm, setUserForm] = useState()
  const [shippingCost, setShippingCost] = useState();
  const [steps, setSteps] = useState(0);

  const pending = !!transactionHash


  const [loading, setLoading] = useState(false)

  const { t } = useTranslation();

  useEffect(() => {
    if (transactionHash) {
      library.waitForTransaction(transactionHash).then(() => {
        setLastTransactionHash(transactionHash)
        setTransactionHash('')

        if (!hasBurnt) {
          setHasBurnt(true)
        } else if (!hasPaidShipping) {
          setHasPaidShipping(true)
        }
      })
    }
  })


  const sendEmailMessage = async (email, type) => {
    let body = {
      email: email,
      secret_key: process.env.REACT_APP_SECRET_KEY,
      subject: '',
      message: ''
    }
    if (type === 'sucess') {
      body.subject = 'You have successfully redemeed your token for wine!'
      body.message = ` <div style="background-color: #850c4b; padding: 20px; display: flex; align-items: center; justify-content: center; flex-direction: column;"> 
     <img style="width: 400px;" src="https://openvino.exchange/assets/images/openvino-logo.png" alt="">
       <p style="margin-top: 50px; color: white; font-weight: bold; font-size: 20px; font-family: sans-serif; text-align: center; line-height: 40px;">You have successfully redemeed your ${state.tokenName} token for wine! If you have any questions, please send a message to
        </p>
        <a style="background-color: #D5841B; padding: 20px 10px; color: white; font-family: sans-serif;" href="mailto:info@costaflores.com" target="_blank">info@costaflores.com</a>
        </div>`
    }

    if (type === 'error') {
      body.subject = 'You’ve successfully redeemed your token! The payment of your shipping is not completed'
      body.message = `<div style="background-color: #850c4b; padding: 20px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
     <img style="width: 400px;" src="https://openvino.exchange/assets/images/openvino-logo.png" alt="">
      <p style="margin-top: 50px; color: white; font-weight: bold; font-size: 20px; font-family: sans-serif; text-align: center; line-height: 40px;">You’ve successfully redeemed your token! The payment of your shipping is not completed, you can resume from this step at any time.
      Any questions please send an email </p>  
       <a style="background-color: #D5841B; padding: 20px 10px; color: white; font-family: sans-serif;" href="mailto:info@costaflores.com" target="_blank">info@costaflores.com</a>
      </div>`
    }

    const message = await axios.post(`${import.meta.env.VITE_DASHBOARD_URL}/api/routes/emailRoute`, body);
    return message;

  }

  const handlePaidShipping = async (redeemToUpdate) => {

    setLoading(true)
    try {
      let res = await axios.get(`${import.meta.env.VITE_DASHBOARD_URL}/api/routes/shippingCostsRoute?token=${state.tokenName}&province_id=${redeemToUpdate.province_id}&amount=${redeemToUpdate.amount}`)
      console.log(USDExchangeRateETH.toString());

      let dollarCost;
      if (res.data) {
        dollarCost = BigNumber.from(res.data.cost * 100)
        setShippingCost(dollarCost)
        console.log(shippingCost)
      }

      const response = await transferShippingCosts(USDToEth(USDExchangeRateETH, dollarCost))
      await response.wait()
      const updatedRedeem = await updateRedeem(`${state.apiUrl}/redeem/update`, { ...redeemToUpdate, shipping_tx_hash: response.hash })
      const filteredRedeems = redeem.filter((reed) => reed.burn_tx_hash !== redeemToUpdate.burn_tx_hash)
      setRedeem(filteredRedeems)

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }

  }
  const [redeem, setRedeem] = useState(0)
  useEffect(() => {
    const getRedeems = async () => {
      fetchRedeems(`${state.apiUrl}/redeem`)
      const redeems = await fetchRedeems(`${state.apiUrl}/redeem`)
      const filteredRedeems = redeems?.data.filter(redeem => redeem.customer_id === account?.address && redeem.shipping_paid_status === "false" && redeem.pickup !== "true")
      setRedeem(filteredRedeems)
    }


    getRedeems()
  }, [])


  useEffect(() => {
    if (userForm?.pickup === false) {
      setSteps(2)
    } else {
      setSteps(1)
    }
  }, [userForm])

  function link(hash) {
    switch (parseInt(state.networkId)) {
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

  function renderContent() {

    if (redeem.length >= 1) {
      return <> <div>
        <h2 style={{ padding: '10px', textAlign: "center" }}>{t('redeem.paidRedeem')}</h2>

        {redeem.map((item) => {
          return (
            <>
              <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "1rem" }}>
                <p style={{ padding: '10px', textAlign: "center" }}>{`${t('redeem.token')} : ${item.year}`} </p>
                <p style={{ padding: '10px', textAlign: "center" }}>{`${t('redeem.amount')} : ${item.amount}`} </p>
                <button onClick={() => handlePaidShipping(item)} style={{ backgroundColor: "#D5841B", padding: "10px", borderRadius: "10px", border: "none", color: "white", cursor: "pointer" }}>Pagar ahora</button>
              </div>
            </>
          )
        })}


      </div>

        <ButtonFrame
          style={{ backgroundColor: "#D5841B", border: "none" }}
          onClick={() => setRedeem(0)}
          className="button"
          disabled={loading}
          pending={loading}
          text={loading ?
            t('wallet.waiting-confirmation') :
            `${t('redeem.omit')}`

          } />
      </>
    }

    else if (state.redeemDate > new Date()) {
      return (
        <ConfirmContainer>
          <TopConfirmedFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} type="shipping" />
          </TopConfirmedFrame>
          <ConfirmContent>
            <RedeemConfirmFrame hasPickedAmount={hasPickedAmount}>
              <ImgConfirmStyle src={state.image} alt="Logo" hasPickedAmount={hasPickedAmount} />
              <Divider></Divider>
              <Owned>
                <p style={{ fontWeight: '500', fontSize: '2rem' }}>{state.title}</p>
                <p style={{ fontSize: '14px', fontWeight: '500', marginTop: '16px', color: '#ffffff', opacity: 0.7 }}>{state.count}x Edition {state.tokenName}</p>
              </Owned>
            </RedeemConfirmFrame>
            <CheckoutConfirmPrompt>{t('wallet.redeem-message', { token: state.tokenName, date: state.redeemDate })}</CheckoutConfirmPrompt>
          </ConfirmContent>

        </ConfirmContainer>
      )
    } else if (account?.address === null) {
      return (
        <ButtonFrame
          className="button"
          disabled={false}
          text={account?.address === null ? t('wallet.connect') : t('wallet.redeem-token', { token: state.tokenName })}
          type={'cta'}
          onClick={() => {
            setConnector('Injected', { suppressAndThrowErrors: true }).catch(() => {
              setShowConnect(true)
            })
          }}
        />
      )
    } else if (!hasPickedAmount) {
    
      return (
        
        <>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} />
            <ImgStyle src={state.image} alt="Logo" hasPickedAmount={hasPickedAmount} />
            <InfoFrame pending={pending}>
              <Owned>
                <WineCount> {t('wallet.you-own', { amount: balanceWINES && amountFormatter(balanceWINES, 18, 0) })}</WineCount>
                <p>{t('wallet.redeem-token', { token: state.tokenName })}</p>
              </Owned>
              <IncrementToken
                // initialValue={closestIntegerDivisibleBy(Number(amountFormatter(balanceWINES, 18, 0)), 6)}
                initialValue={1}
                max={closestIntegerDivisibleBy(Number(amountFormatter(balanceWINES, 18, 0)), 1)}
                step={1}
              />
            </InfoFrame>
            <ButtonFrame
              className="button"
              disabled={balanceWINES < 6}
              text={t('redeem.next')}
              type={'cta'}
              onClick={() => {
                setNumberBurned(state.count)
                setHasPickedAmount(true)
              }}
            />
          </TopFrame>
        </>
      )
    } else if (!hasConfirmedAddress) {
      return (
        <>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} />
            <RedeemConfirmFrame hasPickedAmount={hasPickedAmount}>
              <ImgConfirmStyle src={state.image} alt="Logo" hasPickedAmount={hasPickedAmount} />
              <Divider></Divider>
              <Owned>
                <p style={{ fontWeight: '500', fontSize: '2rem' }}>{state.title}</p>
                <p style={{ fontSize: '14px', fontWeight: '500', marginTop: '16px', color: '#ffffff', opacity: 0.7 }}>{state.count}x Edition {state.tokenName}</p>
              </Owned>
            </RedeemConfirmFrame>
            <RedeemForm USDExchangeRateETH={USDExchangeRateETH} shippingCost={shippingCost} setShippingCost={setShippingCost} setUserForm={setUserForm} setHasConfirmedAddress={setHasConfirmedAddress} numberBurned={numberBurned}></RedeemForm>
          </TopFrame>
        </>
      )
    } else if (!hasBurnt || !hasPaidShipping) {
      return (
        <>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} type="confirm" />
            <RedeemConfirmFrame hasPickedAmount={hasPickedAmount}>
              <ImgConfirmStyle src={state.image} alt="Logo" hasPickedAmount={hasPickedAmount} />
              <Divider></Divider>
              <Owned>
                <p style={{ fontWeight: '500', fontSize: '2rem' }}>{state.title}</p>
                <p style={{ fontSize: '14px', fontWeight: '500', marginTop: '16px', color: '#ffffff', opacity: 0.7 }}>{state.count}x Edition {state.tokenName}</p>
              </Owned>
            </RedeemConfirmFrame>
            <RedeemSteps>
              <RedeemStepText>{t('redeem.noClose')}</RedeemStepText>
              <RedeemStep>

                {hasBurnt ? <CheckCircleIcon></CheckCircleIcon> : <CircleIcon></CircleIcon>}
                <RedeemStepText style={{ width: "30px" }}>{`1/${steps}`}</RedeemStepText>
                <RedeemStepText>{t('redeem.burn')} {state.count}x {state.tokenName}</RedeemStepText>
              </RedeemStep>

              {!userForm?.pickup ? <RedeemStep>
                {hasPaidShipping ? <CheckCircleIcon></CheckCircleIcon> : <CircleIcon></CircleIcon>}
                <RedeemStepText style={{ width: "30px" }}>{`${steps}/${steps}`}</RedeemStepText>
                <RedeemStepText>{t('redeem.transfer-shipping-costs')}: ${amountFormatter(shippingCost, 2, 2)} USD ({amountFormatter(USDToEth(USDExchangeRateETH, shippingCost), 18, 5)} ETH)</RedeemStepText>
              </RedeemStep> : <></>}

            </RedeemSteps>
            <ButtonFrame
              className="button"
              disabled={loading}
              pending={loading}
              text={loading ?
                t('wallet.waiting-confirmation') :
                `${t('redeem.burn')} ${state.tokenName}`

              }
              type={'cta'}
              onClick={() => {
                setLoading(true)

                if (!hasBurnt) {
                  burn(numberBurned.toString())
                    .then(res => {
                      setTransactionHash(res.hash)
                      res.wait().then(() => {
                        setBurnTxHash(res.hash)
                        let body = {
                          "public_key": account?.address,
                          "name": userForm.name,
                          "email": userForm.email,
                          "amount": numberBurned,
                          "year": state.tokenName,
                          "street": userForm.line1,
                          "number": userForm.line2,
                          "country_id": userForm.country,
                          "province_id": userForm.state,
                          "zip": userForm.zip,
                          "telegram_id": userForm.telegram,
                          "signature": userForm.signature,
                          "burn_tx_hash": res.hash,
                          "winerie_id": state.winerie_id,
                          "shipping_paid_status": "false",
                          "pickup": userForm.pickup.toString(),
                          "city": userForm.city
                        };

                        axios.post(`${state.apiUrl}/redeem`, body)
                          .then()
                          .catch(error => {
                            //guardar log del redeem
                            let body = {
                              "public_key": account?.address,
                              "name": userForm.name,
                              "email": userForm.email,
                              "amount": numberBurned,
                              "year": state.tokenName,
                              "street": userForm.line1,
                              "number": userForm.line2,
                              "country_id": userForm.country,
                              "province_id": userForm.state,
                              "zip": userForm.zip,
                              "telegram_id": userForm.telegram,
                              "signature": userForm.signature,
                              "burn_tx_hash": res.hash,
                              "winerie_id": state.winerie_id,
                              "shipping_paid_status": "false",
                              "error_message": error.message,
                              "pickup": userForm.pickup.toString(),
                              "city": userForm.city
                            };
                            axios.post(`${state.apiUrl}/redeem/createLog`, body)
                              .then(response => {
                                console.log(response);
                              })
                          })
                        //transfer shipping costs en el paso 1
                        if (userForm.pickup === false) {
                          transferShippingCosts(USDToEth(USDExchangeRateETH, shippingCost)).then((resTransferShippingCosts) => {
                            resTransferShippingCosts.wait().then(() => {
                              setTransactionHash(resTransferShippingCosts.hash)
                              let body = {
                                "burn_tx_hash": res.hash,
                                "shipping_tx_hash": resTransferShippingCosts.hash,
                                "shipping_paid_status": "true"
                              };

                              axios.post(`${state.apiUrl}/redeem/update`, body)
                                .then(response => {
                                  sendEmailMessage(userForm.email, 'sucess')
                                }).catch(error => {
                                  let body = {
                                    "public_key": account?.address,
                                    "name": userForm.name,
                                    "email": userForm.email,
                                    "amount": numberBurned,
                                    "year": state.tokenName,
                                    "street": userForm.line1,
                                    "number": userForm.line2,
                                    "country_id": userForm.country,
                                    "province_id": userForm.state,
                                    "zip": userForm.zip,
                                    "telegram_id": userForm.telegram,
                                    "signature": userForm.signature,
                                    "burn_tx_hash": burnTxHash,
                                    "winerie_id": state.winerie_id,
                                    "shipping_paid_status": "false",
                                    "error_message": error.message,
                                    "pickup": userForm.pickup.toString(),
                                    "city": userForm.city
                                  };
                                  axios.post(`${state.apiUrl}/redeem/createLog`, body)
                                    .then(response => {
                                      sendEmailMessage(userForm.email, 'error')
                                    })
                                })
                            })
                          })
                        } else {
                          setHasPaidShipping(true)
                        }
                      })

                    })
                    .catch(error => {
                      let body = {
                        "public_key": account?.address,
                        "name": userForm.name,
                        "email": userForm.email,
                        "amount": numberBurned,
                        "year": state.tokenName,
                        "street": userForm.line1,
                        "number": userForm.line2,
                        "country_id": userForm.country,
                        "province_id": userForm.state,
                        "zip": userForm.zip,
                        "telegram_id": userForm.telegram,
                        "signature": userForm.signature,
                        "burn_tx_hash": burnTxHash,
                        "winerie_id": state.winerie_id,
                        "shipping_paid_status": "false",
                        "error_message": error.message,
                        "pickup": userForm.pickup.toString(),
                        "city": userForm.city
                      };

                      axios.post(`${state.apiUrl}/redeem/createLog`, body)
                        .then(response => {
                          console.log(response);
                        })
                    })
                }

              }}
            />
            <Back disabled={!!pending}>
              {pending ? (
                <EtherscanLink href={link(transactionHash)} target="_blank" rel="noopener noreferrer">
                  {t('wallet.view-etherscan')}
                </EtherscanLink>
              ) : (
                <span
                  onClick={() => {
                    setHasConfirmedAddress(false)
                  }}
                >
                  back
                </span>
              )}
            </Back>
          </TopFrame>
        </>
      )
    } else {
      return (
        <>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} />
            <CheckImage></CheckImage>
            <InfoFrame>
              <Owned>
                <p style={{ fontSize: '18px' }}>{t('redeem.you-got-wine')}</p>
              </Owned>
            </InfoFrame>
          </TopFrame>
          <CheckoutPrompt>
            {t('redeem.estimated-time')}
          </CheckoutPrompt>
          <div style={{ margin: '16px 0 16px 16px' }}>
            <EtherscanLink href={link(lastTransactionHash)} target="_blank" rel="noopener noreferrer">
              {t('wallet.view-etherscan')}
            </EtherscanLink>
          </div>
        </>
      )
    }
  }

  return (
    <>
      {renderContent()}
      {hasBurnt && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Confetti active={hasBurnt} config={config} />
      </div>}
    </>
  )
}

const TopFrame = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #141414;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
`

const TopConfirmedFrame = styled.div`
  width: 100%;
  background: #141414;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
`

const ConfirmContainer = styled.div`
  height: 100%;
  flex: 1;

  display: flex;
  flex-direction: column;
`

const ConfirmContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1rem;
`

const FrameControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

const Unicorn = styled.p`
  color: ${props => (props.theme === 'dark' ? '#000' : '#fff')};
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
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

const InfoFrame = styled.div`
  opacity: ${props => (props.pending ? 0.6 : 1)};
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: ${props => (props.hasPickedAmount ? 'space-around' : 'space-between')};
  align-items: center;
  padding: 1rem;

  border-radius: 6px;

  background-color: #1e1f21;
  box-sizing: border-box;
`

const RedeemConfirmFrame = styled.div`
  opacity: ${props => (props.pending ? 0.6 : 1)};
  width: 100%;
  height: 160px;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding: 1rem;

  border-radius: 6px;

  background-color: #1e1f21;
  box-sizing: border-box;
`

const Owned = styled.div`
  font-weight: 700;
  color: #efe7e4;
  font-size: 24px;
  margin-bottom: 12px;
  margin: 0px;
  white-space: pre-wrap;
`

const Bonus = styled.div`
  font-weight: 500;
  font-size: 12px;
  padding: 4px;
  background-color: var(--uniswap-primary):
  border-radius: 4px;
  position: absolute;
  top: 200px;
  left: 32px;
`

const ImgStyle = styled.img`
  max-width: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '300px' : '120px') : '300px')};
  height: auto;
  max-height: calc(100vh - 250px);
  padding: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '0px' : '0 1rem 0 0') : '2rem 0 2rem 0')};
  box-sizing: border-box;
`

const ImgConfirmStyle = styled.img`
  height: 100%;
  box-sizing: border-box;
`

const WineCount = styled.span`
  color: #aeaeae;
  font-weight: 400;
  font-size: 14px;
  width: 100%;
  margin-bottom: 0.5rem;
  color: var(--uniswap-primary):
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`

const Back = styled.div`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  margin: -4px 0 16px 0px !important;
  font-size: 14px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* color: var(--uniswap-primary): */
  text-align: center;
  span {
    cursor: pointer;
  }
  span:hover {
    text-decoration: underline;
  }
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  padding: 16px 0;
  text-align: left;
  color: '#000';
  font-style: italic;
  width: 100%;
`

const ButtonFrame = styled(Button)`
  height: 48px;
  padding: 16px;
  margin: 16px;
  width: calc(100% - 32px);
`

const EtherscanLink = styled.a`
  text-decoration: none;
  color: var(--uniswap-primary):
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`
const Divider = styled.div`
  width: 1px;
  height: 80%;
  background-color: #979797;
  margin: 0 2rem;
`
const CheckoutConfirmPrompt = styled.div`
  color: white;
  line-height: 1.73;
  letter-spacing: 1.46px;
  font-size: 1rem;
  font-weight: 300;
  padding: 16px;
`
const RedeemSteps = styled.div`
  padding: 16px 16px 16px 0;
  flex: 1;
`
const RedeemStep = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px 0;
`
const RedeemStepText = styled.p`
  margin: 0px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 5px;
`
const CircleIcon = styled(Circle)`
  height: 28px;
  width: 28px;
`
const CheckCircleIcon = styled(CheckCircle)`
  height: 28px;
  width: 28px;
`