import React, { useState, useEffect } from "react";
import { client } from "../../config/thirdwebClient";
import { defineChain, baseSepolia } from "thirdweb/chains";
import { ConnectButton, ConnectEmbed, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { useTranslation } from "react-i18next";
import Form from "./Form";
import SelectToken from "../shared/SelectToken";
import IncrementToken from "../shared/IncrementToken";
import { useAppContext } from "../../context";
import { ERROR_CODES, amountFormatter, TRADE_TYPES, getNetworkId } from "../../utils";
import {
  ButtonFrame,
  CheckoutControls,
  CheckoutPrompt,
  CloseIcon,
  Connect,
  ContentWrapper,
  CurrentPriceBuySell,
  Description,
  EtherscanLink,
  Header,
  ImgStyle,
  InfoFrame,
  Status,
  TopFrame,
  USDPrice,
  WineCount,
  WineTitle,
  Wrapper,
} from "../../styles";
import EstimateGas from "../estimateGas/EstimateGas";
import { getContract, prepareContractCall, toWei } from "thirdweb";
import contractABI from '../../contracts/router.json';
import crowdsaleABI from '../../contracts/crowdsale.json';
import ERC20ABI from '../../contracts/erc20.json';


import { ethers } from "ethers";
import { notifyBuyer } from "../../utils/checkout-utils";
import { useExchangeContract, useRouterContract } from "../../hooks";

export function Account({ ready, balanceWINES, setShowConnect }) {
  const account = useActiveAccount();
  const [state] = useAppContext();
  const { t } = useTranslation();
  return (
    <>
      {account ? (
        balanceWINES > 0 ? (
          <WineCount>
            {balanceWINES && `${amountFormatter(balanceWINES, 18, 0)}`}{" "}
            {state.tokenName}
          </WineCount>
        ) : (
          <WineCount>{account?.address.slice(0, 6)}...</WineCount>
        )
      ) : (
        <WineCount>{t("wallet.connect")}</WineCount>
      )}

      <Status balanceWINES={balanceWINES} ready={ready} account={account} />
    </>
  );
}

export function useCount() {
  const [state, setState] = useAppContext();

  function increment() {
    setState((state) => ({ ...state, count: state.count + 1 }));
  }

  function decrement() {
    if (state.count >= 1) {
      setState((state) => ({ ...state, count: state.count - 1 }));
    }
  }

  function setCount(val) {
    let int = val.toInt();
    setState((state) => ({ ...state, count: int }));
  }
  return [state.count, increment, decrement, setCount];
}

function getValidationErrorMessage(validationError) {
  if (!validationError) {
    return null;
  } else {
    switch (validationError.code) {
      case ERROR_CODES.INVALID_AMOUNT: {
        return "invalid-amount";
      }
      case ERROR_CODES.INVALID_TRADE: {
        return "invalid-trade";
      }
      case ERROR_CODES.INSUFFICIENT_ALLOWANCE: {
        return "no-allowance";
      }
      case ERROR_CODES.INSUFFICIENT_ETH_GAS: {
        return "no-eth";
      }
      case ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE: {
        return "no-tokens";
      }
      default: {
        return "unknown-error";
      }
    }
  }
}

export default function BuyAndSell({
  crowdsaleExchangeRateUSD,
  closeCheckout,
  tokenSupply,
  tokenCap,
  balanceWINES,
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  validateSell,
  validateCrowdsale,
  crowdsale,
  dollarPrice,
  pending,
  reserveWINESToken,
  dollarize,
  setCurrentTransaction,
  currentTransactionHash,
  setShowConnect,
  setRefreshTrigger
}) {
  const [state] = useAppContext();
  // const { account, setConnector } = useWeb3Context();
  const account = useActiveAccount();

  const { t } = useTranslation();

  const buying = state.tradeType === TRADE_TYPES.BUY;
  const selling = state.tradeType === TRADE_TYPES.SELL;
  const crowdsaling = state.tradeType === TRADE_TYPES.CROWDSALE;

  const [buyValidationState, setBuyValidationState] = useState({}); // { maximumInputValue, inputValue, outputValue }
  const [sellValidationState, setSellValidationState] = useState({}); // { inputValue, outputValue, minimumOutputValue }
  const [crowdsaleValidationState, setCrowdsaleValidationState] = useState({}); // { inputValue, outputValue, minimumOutputValue }
  const [validationError, setValidationError] = useState();



  function getText(account, errorMessage, ready, pending, hash) {
    if (account === null) {
      return t("wallet.connect");
    } else if (ready && !errorMessage) {
      if (buying) {
        if (pending && hash) {
          return t("wallet.waiting-confirmation");
        } else {
          return t("wallet.buy-wine");
        }
      } else if (selling) {
        if (pending && hash) {
          return t("wallet.waiting-confirmation");
        } else {
          return t("wallet.sell-wine");
        }
      } else if (crowdsaling) {
        if (pending && hash) {
          return t("wallet.waiting-confirmation");
        } else {
          return t("wallet.buy-wine");
        }
      }
    } else {
      return errorMessage ? t(errorMessage) : t("wallet.loading");
    }
  }

  function link(hash) {
    switch (parseInt(state.networkId)) {
      case 3:
        return `https://ropsten.etherscan.io/tx/${hash}`;
      case 4:
        return `https://rinkeby.etherscan.io/tx/${hash}`;
      case 10:
        return `https://optimistic.etherscan.io/tx/${hash}`;
      case 11155420:
        return `https://optimistic.etherscan.io/tx/${hash}`;
      default:
        return `https://etherscan.io/tx/${hash}`;
    }
  }

  // buy state validation
  useEffect(() => {
    if (ready && buying) {
      try {
        const { error: validationError, ...validationState } = validateBuy(
          String(state.count)
        );
        setBuyValidationState(validationState);
        setValidationError(validationError || null);

        return () => {
          setBuyValidationState({});
          setValidationError();
        };
      } catch (error) {
        setBuyValidationState({});
        setValidationError(error);
      }
    }
  }, [ready, buying, validateBuy, state.count]);

  // sell state validation
  useEffect(() => {
    if (ready && selling) {
      try {
        const { error: validationError, ...validationState } = validateSell(
          String(state.count)
        );
        
        setSellValidationState(validationState);
        setValidationError(validationError || null);

        return () => {
          setSellValidationState({});
          setValidationError();
        };
      } catch (error) {
        setSellValidationState({});
        setValidationError(error);
      }
    }
  }, [ready, selling, validateSell, state.count]);

  // crowdsale state validation
  useEffect(() => {
    if (ready && crowdsaling) {
      try {
        const { error: validationError, ...validationState } =
          validateCrowdsale(String(state.count));
        setCrowdsaleValidationState(validationState);
        setValidationError(validationError || null);

        return () => {
          setCrowdsaleValidationState({});
          setValidationError();
        };
      } catch (error) {
        setCrowdsaleValidationState({});
        setValidationError(error);
      }
    }
  }, [ready, crowdsaling, validateCrowdsale, state.count]);


  let shouldRenderUnlock =
  validationError &&
  validationError.code === ERROR_CODES.INSUFFICIENT_ALLOWANCE;

  // const [shouldRenderUnlock, setShouldRenderUnlock] = useState(shouldRenderUnlockBool)

 

  const errorMessage = getValidationErrorMessage(validationError);

  function renderFormData() {
    let conditionalRender;
    if (buying && buyValidationState.inputValue) {
      conditionalRender = (
        <>
          <p>
            $
            {ready &&
              amountFormatter(dollarize(buyValidationState.inputValue), 18, 2)}
          </p>
        </>
      );
    } else if (selling && sellValidationState.outputValue) {
      conditionalRender = (
        <>
          <p>
            $
            {ready &&
              amountFormatter(
                dollarize(sellValidationState.outputValue),
                18,
                2
              )}
          </p>
        </>
      );
    } else if (crowdsaling && crowdsaleValidationState.inputValue) {
      conditionalRender = (
        <p>
          ${ready && amountFormatter(dollarize(crowdsaleValidationState.inputValue), 18, 2)}
        </p>
      );
    } else {
      conditionalRender = <p>$0.00</p>;
    }

    return <>{conditionalRender}</>;
  }

  function TokenVal() {
    if (buying && buyValidationState.inputValue) {
      return amountFormatter(buyValidationState.inputValue, 18, 4);
    } else if (selling && sellValidationState.outputValue) {
      return amountFormatter(sellValidationState.outputValue, 18, 4);
    } else if (crowdsaling && crowdsaleValidationState.inputValue) {
      return amountFormatter(crowdsaleValidationState.inputValue, 18, 4);
    } else {
      return "0";
    }
  }

  function renderSupplyData() {
    if (buying) {
      return (
        reserveWINESToken &&
        `${amountFormatter(reserveWINESToken, 18, 0)}/${tokenSupply}`
      );
    } else if (selling) {
      return (
        reserveWINESToken &&
        `${amountFormatter(reserveWINESToken, 18, 0)}/${tokenSupply}`
      );
    } else if (crowdsaling && tokenSupply && tokenCap) {
      if (tokenCap - tokenSupply < 0) {
        return tokenSupply && tokenCap && `0/${tokenCap}`;
      } else {
        return (
          tokenSupply && tokenCap && `${tokenCap - tokenSupply}/${tokenCap}`
        );
      }
    }
    return t("wallet.not-available");
  }


  const routerContract = useRouterContract();
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: '0x78e8874809e12ba3C23e33E2C071D41f78601324',
    abi: contractABI
  });


  const crowdsaleContract = getContract({
    client: client,
    chain: baseSepolia,
    address: state.crowdsaleAddress,
    abi: crowdsaleABI
  });

  const tokenContractWINES = getContract({
    client: client,
    chain: baseSepolia,
    address: state.tokenAddress,
    abi: ERC20ABI

  });


  //base sepolia
  let wethAddress = "0x4200000000000000000000000000000000000006";

  if (!account?.address) {
    return (
      <>
        <Wrapper>
          <ContentWrapper>
            <ConnectButton client={client} chain={defineChain(baseSepolia)}
              connectButton={{
                label: 'Conectar Wallet',
                style: {
                  marginTop: 20,
                  background: "#d5841b",
                  color: "white",
                  fontSize: 20,
                  boxShadow:
                    "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                },
              }} />
          </ContentWrapper>
        </Wrapper>
      </>
    )
  }

  return (
    <Wrapper>
      <Header>
        <ConnectButton client={client} chain={defineChain(baseSepolia)} />
        <Account
          ready={ready}
          dollarPrice={dollarPrice}
          balanceWINES={balanceWINES}
          setShowConnect={setShowConnect}
        />
        <CloseIcon onClick={() => closeCheckout()} />
      </Header>

      <ContentWrapper>
        <TopFrame>
          <ImgStyle src={state.image} alt="Viniswap" />
          <InfoFrame pending={pending}>
            <CurrentPriceBuySell>
              <Description>
                {buying
                  ? t("wallet.pay")
                  : selling
                    ? t("wallet.sell")
                    : t("wallet.crowdsale")}
              </Description>
              <WineTitle>
                {state.title} <b>{state.tokenName}</b>
              </WineTitle>
              <USDPrice>{renderFormData()}</USDPrice>
              <WineCount>
                <b>{t("wallet.available")}</b> {renderSupplyData()}
              </WineCount>
            </CurrentPriceBuySell>
          </InfoFrame>

          {(!pending || !currentTransactionHash) && (
            <IncrementToken initialValue={selling ? 1 : 1} step={1} />
          )}
        </TopFrame>

        {pending && currentTransactionHash ? (
          <CheckoutControls buying={buying}>
            <CheckoutPrompt>
              <i>{t("wallet.pending-transaction")}</i>
            </CheckoutPrompt>
            <CheckoutPrompt>
              <EtherscanLink
                href={link(currentTransactionHash)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("wallet.view-etherscan")}
              </EtherscanLink>
            </CheckoutPrompt>
          </CheckoutControls>
        ) : (
          <>
            <EstimateGas />
            <CheckoutControls buying={buying}>
              <Form />
              <SelectToken
                isBuying={buying}
                isSelling={selling}
                selectedTokenSymbol={selectedTokenSymbol}
                setSelectedTokenSymbol={setSelectedTokenSymbol}
                prefix={TokenVal()}
              />
            </CheckoutControls>
          </>
        )}



        {shouldRenderUnlock ? (
          <TransactionButton
            onTransactionConfirmed={async (response) => {
              if (response.status === "success") {
                setCurrentTransaction(response.transactionHash, TRADE_TYPES.UNLOCK, undefined);
                setRefreshTrigger((prev) => prev + 1);
             
                
              }
            }}
            transaction={() =>
              prepareContractCall({
                contract: tokenContractWINES,
                method: 'approve',
                params: [
                  routerContract.address,
                  BigInt(ethers.constants.MaxUint256),
                ],

              })
            }

            onError={(e) => console.error(e)}

          > {`${t("wallet.unlock")} ${buying ? selectedTokenSymbol : state.tokenName
            }`}</TransactionButton>
        ) : buying ? (
          <TransactionButton
            disabled={pending || !state.emailValid}
            transaction={() =>
              prepareContractCall({
                contract,
                method: 'swapETHForExactTokens',
                params: [
                  buyValidationState.outputValue,
                  [wethAddress, state.tokenAddress],
                  account?.address,
                  Math.floor(Date.now() / 1000) + 60 * 15,
                ],
                value: BigInt(
                  ethers.utils.parseEther(
                    ethers.utils.formatEther(buyValidationState?.maximumInputValue?.toString())
                  )
                ),
              })
            }
            onError={(e) => console.error(e)}
            onTransactionConfirmed={async (response) => {
              if (response.status === "success") {
                setCurrentTransaction(
                  response.transactionHash,
                  state.tradeType,
                  buyValidationState.outputValue
                );

                await notifyBuyer(state.apiUrl, state.count, account, state.email, state.winerie_id, state.name)
              }
            }}
          >
            {getText(account, errorMessage, ready, pending, currentTransactionHash)}
          </TransactionButton>
        ) : selling ? (
          <TransactionButton
            disabled={pending || !state.emailValid}
            transaction={() =>
              prepareContractCall({
                contract,
                method: 'swapExactTokensForETH',
                params: [
                  sellValidationState.inputValue,
                  sellValidationState.minimumOutputValue,
                  [state.tokenAddress, wethAddress],
                  account?.address,
                  Math.floor(Date.now() / 1000) + 60 * 15,
                ],
              })
            }
            onError={(e) => console.log(e)}
            onTransactionConfirmed={async (response) => {
              if (response.status === "success") {
                setCurrentTransaction(
                  response.transactionHash,
                  state.tradeType,
                  sellValidationState.inputValue
                );
                await notifyBuyer(state.apiUrl, state.count, account, state.email, state.winerie_id, state.name
                );
              }


            }}
          >
            {getText(account, errorMessage, ready, pending, currentTransactionHash)}
          </TransactionButton>
        ) : crowdsale ? (
          <TransactionButton
            disabled={pending || !state.emailValid}
            transaction={() =>
              prepareContractCall({
                crowdsaleContract,
                method: 'buyTokens',
                params: [account?.address],
                value: BigInt(
                  ethers.utils.parseEther(
                    ethers.utils.formatEther(crowdsaleValidationState.maximumInputValue)
                  )
                ),
              })
            }
            onError={(e) => console.error(e)}
          >
            {getText(account, errorMessage, ready, pending, currentTransactionHash)}
          </TransactionButton>
        ) : (
          <></>
        )}
      </ContentWrapper>
    </Wrapper>

  );
}
