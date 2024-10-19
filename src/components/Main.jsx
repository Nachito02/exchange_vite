import React, { useEffect, useState, useCallback } from "react";
import Checkout from "./checkout/Checkout";
import { useAppContext } from "../context";
import { TradeButtons } from "./shared/TradeButtons";
import { BigNumber, ethers } from "ethers";
import { useTranslation } from "react-i18next";
import { useActiveAccount } from "thirdweb/react";
import { client } from "../config/thirdwebClient";
import { optimismSepolia } from "thirdweb/chains";
import {
  TOKEN_SYMBOLS, TOKEN_ADDRESSES, TRADE_TYPES, getExchangeRate, getCrowdsaleContract, calculateGasMargin, amountFormatter, getProviderOrSigner, getNetworkId,
} from "../utils";
import {
  validateBuyHelper, validateCrowdsaleHelper, validateSellHelper,
} from "../utils/checkout-utils";
import {
  useTokenContract, useExchangeContract, useCrowdsaleContract, useAddressBalance, useAddressAllowance, useExchangeReserves, useRouterAllowance, useTokenSupply, useTokenCap, usePairContract, useReserves, useRouterContract,
} from "../hooks";
import Farming from "./farming/Farming";
import { fetchPrice } from "../utils/fetchPrice";
import {
  CardWrapper, Container, CurrentPrice, Farm, Image, ImageContainer, InfoIcon, MarketData, Redeem, Title, TokenIcon, TokenIconContainer, TokenIconText,
} from "../styles";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { useParams } from "react-router-dom";
import { axiosClient } from "../config/axiosClient";
import Header from "./Header/Header";

export default function Main() {
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: optimismSepolia,

  });
  const signer = ethers5Adapter.signer.toEthers({
    client,
    chain: optimismSepolia,
    account: account
  })



  const account = useActiveAccount();
  const { wineryId, productId } = useParams();
  const [product, setProduct] = useState([]);
  const [state, setState] = useAppContext();

  const getProductList = async () => {

    console.log(state);


    const productsWineries = await axiosClient.get('/token', {
      params: { winerie_id: wineryId },
    });

    const filterProduct = productsWineries.data.filter((product) => product.id === productId);

    console.log(filterProduct, 'filter');

    console.log(toString(filterProduct[0].year), 'year');

    setState((prevState) => ({
      ...prevState,
      apiUrl: import.meta.env.VITE_APIURL,
      tokenName: filterProduct[0].token,
      crowdsaleAddress: filterProduct[0].crow_sale_address,
      networkId: filterProduct[0].networkId,
      tokenAddress: filterProduct[0].token_address,
      image: filterProduct[0].bottle_image,
      tokenYear: filterProduct[0].year.toString(),
      tokenName: filterProduct[0].id,
      tokenIcon: filterProduct[0].token_icon,
      title: "Token",
    }))


    // setProduct(productsWineries.data);
  };

  useEffect(() => {
    getProductList();

  }, []);

  const [showFarming, setShowFarming] = useState(false);

  // selected token
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(
    TOKEN_SYMBOLS.ETH
  );

  const routerContract = useRouterContract();
  const pairMTBwETH = usePairContract(state?.tokenAddress);
  // console.log("token", state?.tokenAddress);
  // console.log("pair", pairMTBwETH.address);

  // get exchange contracts
  const exchangeContractWINES = useExchangeContract(state?.tokenAddress);
  const exchangeContractSelectedToken = useExchangeContract(state?.tokenAddress);
  const exchangeContractDAI = useExchangeContract(TOKEN_ADDRESSES.DAI);

  // get token contracts
  const tokenContractWINES = useTokenContract(state?.tokenAddress);
  const tokenContractSelectedToken = useTokenContract(state?.tokenAddress);

  // crowdsale contract
  const crowdsaleContract = useCrowdsaleContract(state?.crowdsaleAddress);

  // get balances
  const balanceETH = useAddressBalance(account?.address, TOKEN_ADDRESSES.ETH);
  const balanceWINES = useAddressBalance(account?.address, state?.tokenAddress);
  const balanceSelectedToken = useAddressBalance(
    account?.address,
    TOKEN_ADDRESSES[selectedTokenSymbol]
  );

  // tokenSupply
  const tokenSupply = useTokenSupply(tokenContractWINES);

  // token cap
  const tokenCap = useTokenCap(tokenContractWINES);

  // get allowances
  const allowanceWINES = useAddressAllowance(
    account?.address,
    state?.tokenAddress,
    routerContract && routerContract.address
  );
  const allowanceSelectedToken = useRouterAllowance(
    account?.address,
    state?.tokenAddress
  );

  const reserveWINESETH = useReserves(pairMTBwETH)["0"];
  const reserveWINESToken = useReserves(pairMTBwETH)["1"];

  // const reserveWINESETH = useReserves(pairMTBwETH)["1"];
  // const reserveWINESToken = useReserves(pairMTBwETH)["0"];


  const {
    reserveETH: reserveSelectedTokenETH,
    reserveToken: reserveSelectedTokenToken,
  } = useExchangeReserves(TOKEN_ADDRESSES[selectedTokenSymbol]);

  const reserveDAIETH = useAddressBalance(
    exchangeContractDAI && exchangeContractDAI.address,
    TOKEN_ADDRESSES.ETH
  );
  const reserveDAIToken = useAddressBalance(
    exchangeContractDAI && exchangeContractDAI.address,
    TOKEN_ADDRESSES.DAI
  );

  const [USDExchangeRateETH, setUSDExchangeRateETH] = useState();
  const [USDExchangeRateSelectedToken, setUSDExchangeRateSelectedToken] =
    useState();



  useEffect(() => {
    const fetchPriceAndSetState = async () => {
      try {
        const usdPrice = await fetchPrice();
        const formatedUsdPrice = usdPrice.split('.')[0];
        const exchangeRateDAI = getExchangeRate(BigNumber.from(1), BigNumber.from(Number(formatedUsdPrice)));


        if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
          setUSDExchangeRateETH(exchangeRateDAI);
        } else {
          const exchangeRateSelectedToken = getExchangeRate(
            reserveSelectedTokenETH,
            reserveSelectedTokenToken
          );
          if (exchangeRateDAI && exchangeRateSelectedToken) {
            setUSDExchangeRateSelectedToken(
              exchangeRateDAI
                .mul(
                  BigNumber.from(10).pow(BigNumber.from(18))
                )
                .div(exchangeRateSelectedToken)
            );
          }
        }
      } catch (error) {
        console.log(error);
        setUSDExchangeRateETH();
        setUSDExchangeRateSelectedToken();
      }
    }

    fetchPriceAndSetState();
  }, [
    reserveDAIETH,
    reserveDAIToken,
    reserveSelectedTokenETH,
    reserveSelectedTokenToken,
    selectedTokenSymbol,
  ]);

  let [isCrowdsale, setCrowdsale] = useState();
  useEffect(() => {
    try {
      crowdsaleContract
        .isOpen()
        .then((open) => {
          setCrowdsale(open);
        })
        .catch((error) => {
          setCrowdsale(false);
        });
    } catch {
      setCrowdsale();
    }
  }, [crowdsaleContract]);

  const [crowdsaleExchangeRateETH, setCrowdsaleExchangeRateETH] = useState(0);
  const [crowdsaleExchangeRateUSD, setCrowdsaleExchangeRateUSD] = useState(0);

  //Crowdsale price
  useEffect(() => {
    try {
      crowdsaleContract
        .rate()
        .then((rate) => {
          const exchangeRateETH = rate.mul(
            BigNumber.from(10).pow(BigNumber.from(18))
          );
          setCrowdsaleExchangeRateETH(exchangeRateETH);

          const exchangeRateUSD = USDExchangeRateETH.mul(
            BigNumber.from(10).pow(BigNumber.from(18))
          ).div(exchangeRateETH);
          setCrowdsaleExchangeRateUSD(exchangeRateUSD);
        })
        .catch((error) => {
          setCrowdsaleExchangeRateETH();
          setCrowdsaleExchangeRateUSD();
        });
    } catch {
      setCrowdsaleExchangeRateETH();
      setCrowdsaleExchangeRateUSD();
    }
  }, [crowdsaleContract, USDExchangeRateETH]);

  const ready = !!(
    (isCrowdsale && tokenCap > tokenSupply + 6) ||
    (!isCrowdsale &&
      (account?.address === null || allowanceWINES) &&
      (selectedTokenSymbol === "ETH" ||
        account?.address === null ||
        allowanceSelectedToken) &&
      (account?.address === null || balanceETH) &&
      (account?.address === null || balanceWINES) &&
      (account?.address === null || balanceSelectedToken) &&
      reserveWINESETH &&
      reserveWINESToken &&
      (selectedTokenSymbol === "ETH" || reserveSelectedTokenETH) &&
      (selectedTokenSymbol === "ETH" || reserveSelectedTokenToken) &&
      selectedTokenSymbol &&
      (USDExchangeRateETH || USDExchangeRateSelectedToken))
  );

  function _dollarize(amount, exchangeRate) {
    if (exchangeRate) {
      return amount
        .mul(exchangeRate)
        .div(BigNumber.from(10).pow(BigNumber.from(18)));
    }

    return BigNumber.from(0);
  }

  function dollarize(amount) {
    return _dollarize(
      amount,
      selectedTokenSymbol === TOKEN_SYMBOLS.ETH
        ? USDExchangeRateETH
        : USDExchangeRateSelectedToken
    );
  }

  const [dollarPrice, setDollarPrice] = useState();

  //Pool price
  useEffect(() => {
    try {
      const WINESExchangeRateETH = getExchangeRate(
        reserveWINESToken,
        reserveWINESETH
      );
      setDollarPrice(
        WINESExchangeRateETH.mul(USDExchangeRateETH).div(
          BigNumber.from(10).pow(BigNumber.from(18))
        )
      );
    } catch {
      setDollarPrice();
    }
  }, [USDExchangeRateETH, reserveWINESETH, reserveWINESToken]);

  async function unlock(buyingWINES = true) {

    const contract = buyingWINES
      ? tokenContractSelectedToken
      : tokenContractWINES;
    const spenderAddress = buyingWINES
      ? exchangeContractSelectedToken.address
      : routerContract.address;

    console.log("Unlocking...", tokenContractSelectedToken, tokenContractWINES, contract);


    const estimatedGasLimit = await contract.estimateGas.approve(
      spenderAddress,
      ethers.constants.MaxUint256
    );


    const estimatedGasPrice = await library
      .getGasPrice()
      .then((gasPrice) =>
        gasPrice
          .mul(BigNumber.from(150))
          .div(BigNumber.from(100))
      );

    console.log(estimatedGasPrice);

    return contract.approve(spenderAddress, ethers.constants.MaxUint256, {
      gasLimit: calculateGasMargin(estimatedGasLimit),
      gasPrice: estimatedGasPrice,
    });
  }

  // buy functionality
  const validateBuy = useCallback(
    (numberOfWINES) => {
      return validateBuyHelper(
        numberOfWINES,
        allowanceSelectedToken,
        balanceETH,
        balanceSelectedToken,
        reserveWINESETH,
        reserveWINESToken,
        reserveSelectedTokenETH,
        reserveSelectedTokenToken,
        selectedTokenSymbol
      );
    },
    [
      allowanceSelectedToken,
      balanceETH,
      balanceSelectedToken,
      reserveWINESETH,
      reserveWINESToken,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken,
      selectedTokenSymbol,
    ]
  );



  // crowdsale functionality
  const validateCrowdsale = useCallback(
    (numberOfWINES) => {
      return validateCrowdsaleHelper(
        numberOfWINES,
        allowanceSelectedToken,
        balanceETH,
        balanceSelectedToken,
        crowdsaleExchangeRateETH,
        selectedTokenSymbol
      );
    },
    [
      allowanceSelectedToken,
      balanceETH,
      balanceSelectedToken,
      crowdsaleExchangeRateETH,
      selectedTokenSymbol,
    ]
  );



  // sell functionality
  const validateSell = useCallback(
    (numberOfWINES) => {
      return validateSellHelper(
        numberOfWINES,
        allowanceWINES,
        balanceETH,
        balanceWINES,
        reserveWINESETH,
        reserveWINESToken,
        reserveSelectedTokenETH,
        reserveSelectedTokenToken,
        selectedTokenSymbol
      );
    },
    [
      allowanceWINES,
      balanceETH,
      balanceWINES,
      reserveWINESETH,
      reserveWINESToken,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken,
      selectedTokenSymbol,
    ]
  );



  async function transferShippingCosts(amount) {
    let signer = getProviderOrSigner(library, account?.address);

    return signer.sendTransaction({
      to: ethers.utils.getAddress(state?.shippingAccount),
      // value: ethers.utils.parseEther("0.001")
      value: amount,
    });
  }

  async function burn(amount) {
    const parsedAmount = ethers.utils.parseUnits(amount, 18);

    const estimatedGasPrice = await library
      .getGasPrice()
      .then((gasPrice) =>
        gasPrice
          .mul(BigNumber.from(150))
          .div(BigNumber.from(100))
      );

    const estimatedGasLimit = await tokenContractWINES.estimate.burn(
      parsedAmount
    );

    return tokenContractWINES.burn(parsedAmount, {
      gasLimit: calculateGasMargin(estimatedGasLimit),
      gasPrice: estimatedGasPrice,
    });
  }

  function openFarm() {
    setShowFarming(true);
  }

  function handleRedeemClick() {
    setState((state) => ({
      ...state,
      visible: !state.visible,
      tradeType: TRADE_TYPES.REDEEM,
    }));
  }

  // --------------------------------------------------------------
  const [currentTransaction, _setCurrentTransaction] = useState({});
  const setCurrentTransaction = useCallback((hash, type, amount) => {
    _setCurrentTransaction({ hash, type, amount });
  }, []);
  const clearCurrentTransaction = useCallback(() => {
    _setCurrentTransaction({});
  }, []);

  const [showConnect, setShowConnect] = useState(false);
  const [showWorks, setShowWorks] = useState(false);

  const { t } = useTranslation();





  return (
   
      <Header> 
      <Container>
        <CardWrapper>
          <div>
            <Farm onClick={openFarm}> {t("labels.farm")} </Farm>
            <Redeem onClick={handleRedeemClick}> {t("labels.redeem")} </Redeem>
          </div>
          <ImageContainer>
            <Image src={state.image} />
          </ImageContainer>
          <MarketData>
            <Title>
              {state.title} ({state.tokenName}){" "}
              <InfoIcon
                onClick={(e) => {
                  e.preventDefault();
                  setState((state) => ({ ...state, visible: !state.visible }));
                  setShowWorks(true);
                }}
              ></InfoIcon>
            </Title>
            {isCrowdsale && (
              <CurrentPrice>
                {crowdsaleExchangeRateUSD
                  ? `$${amountFormatter(crowdsaleExchangeRateUSD, 18, 2)} USDC`
                  : "$0.00"}
              </CurrentPrice>
            )}
            {!isCrowdsale && (
              <CurrentPrice>
                {dollarPrice
                  ? `$${amountFormatter(dollarPrice, 18, 2)} USDC`
                  : "$0.00"}
              </CurrentPrice>
            )}
            <TokenIconContainer>
              <TokenIconText>{state?.tokenYear?.substring(2, 4)}</TokenIconText>
              <TokenIcon src={state.tokenIcon}></TokenIcon>
            </TokenIconContainer>
            <TradeButtons
              balanceWINES={balanceWINES}
              isCrowdsale={isCrowdsale}
            ></TradeButtons>
          </MarketData>
        </CardWrapper>

        <Checkout
          USDExchangeRateETH={USDExchangeRateETH}
          crowdsaleExchangeRateUSD={crowdsaleExchangeRateUSD}
          transferShippingCosts={transferShippingCosts}
          tokenSupply={tokenSupply}
          tokenCap={tokenCap}
          selectedTokenSymbol={selectedTokenSymbol}
          setSelectedTokenSymbol={setSelectedTokenSymbol}
          ready={ready}
          unlock={unlock}
          validateBuy={validateBuy}
          validateSell={validateSell}
          validateCrowdsale={validateCrowdsale}
          burn={burn}
          balanceWINES={balanceWINES}
          dollarPrice={dollarPrice}
          reserveWINESToken={reserveWINESToken}
          dollarize={dollarize}
          showConnect={showConnect}
          setShowConnect={setShowConnect}
          currentTransactionHash={currentTransaction.hash}
          currentTransactionType={currentTransaction.type}
          currentTransactionAmount={currentTransaction.amount}
          setCurrentTransaction={setCurrentTransaction}
          clearCurrentTransaction={clearCurrentTransaction}
          showWorks={showWorks}
          setShowWorks={setShowWorks}
        />
        {showFarming && (
          <Farming
            setShowFarming={setShowFarming}
            tokenAddress={state.tokenAddress}
          ></Farming>
        )}
      </Container>
      </Header>
  );
}
