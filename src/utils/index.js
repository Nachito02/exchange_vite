import { BigNumber, ethers } from "ethers";

import ERC20_ABI from "../contracts/erc20.json";
import EXCHANGE_ABI from "../contracts/exchange.json";
import FACTORY_ABI from "../contracts/factory.json";
import CROWDSALE_ABI from "../contracts/crowdsale.json";
import ROUTER_ABI from "../contracts/router.json";
import PAIR_ABI from "../contracts/pair.json";

import UncheckedJsonRpcSigner from "./signer";

function getDAIAddress() {
  switch (localStorage.getItem("uniswap.network")) {
    case "11155420":
      return "0x2E54D912361f6A4b1e57E239138Ff4C1344940Ae";
    case "10":
      return "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
    default:
      return "0x6b175474e89094c44da98b954eedeac495271d0f";
  }
}

export function getNetworkId() {
  return parseInt(localStorage.getItem("uniswap.network"));
}

function getFactoryAddress() {
  switch (localStorage.getItem("uniswap.network")) {
    case "3":
      return "0x9c83dce8ca20e9aaf9d3efc003b2ea62abc08351";
    case "4":
      return "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36";
    case "11155420":
      return "0xd43124F8C87a1FaA25Bd83cEcaEc02E567A5657e";
    default:
      return "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95";
  }
}

const FACTORY_ADDRESS = getFactoryAddress();
// export const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
// export const ROUTER_ADDRESS = "0xFFeD3BecF54F233dBE134dECAae2b099c04EB8bc"

//BASE SEPOLIA
export const ROUTER_ADDRESS = import.meta.env.VITE_ROUTER_ADDRESS;


// denominated in bips
const ALLOWED_SLIPPAGE = BigNumber.from(200);

// denominated in bips
const GAS_MARGIN = BigNumber.from(1000);

export const TOKEN_ADDRESSES = {
  ETH: "ETH",
  MTB: localStorage.getItem("uniswap.token"),
  DAI: getDAIAddress(),
};

export const TOKEN_SYMBOLS = Object.keys(TOKEN_ADDRESSES).reduce((o, k) => {
  o[k] = k;
  return o;
}, {});

export const currenciesNames = ["ETH", "USDC", "ARS", "EURS", "BRL", "CLP", "COP"];

export const ERROR_CODES = [
  "INVALID_AMOUNT",
  "INVALID_TRADE",
  "INSUFFICIENT_ETH_GAS",
  "INSUFFICIENT_SELECTED_TOKEN_BALANCE",
  "INSUFFICIENT_ALLOWANCE",
].reduce((o, k, i) => {
  o[k] = i;
  return o;
}, {});

export const TRADE_TYPES = [
  "BUY",
  "SELL",
  "UNLOCK",
  "REDEEM",
  "CROWDSALE",
].reduce((o, k, i) => {
  o[k] = i;
  return o;
}, {});

export function isAddress(value) {
  try {
    ethers.utils.getAddress(value);
    return true;
  } catch {
    return false;
  }
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account
    ? new UncheckedJsonRpcSigner(library.getSigner(account))
    : library;
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new ethers.Contract(
    address,
    ABI,
    getProviderOrSigner(library, account)
  );
}

export function getTokenContract(tokenAddress, library, account) {
  return getContract(tokenAddress, ERC20_ABI, library, account);
}

export function getPairContract(pairAddress, library, account) {
  return getContract(pairAddress, PAIR_ABI, library, account);
}

export function getCrowdsaleContract(crowdsaleAddress, library, account) {
  return getContract(crowdsaleAddress, CROWDSALE_ABI, library, account);
}

export function getIsCrowdsaleOpen(crowdsaleAddress, library, account) {

  return getCrowdsaleContract(
    crowdsaleAddress,
    CROWDSALE_ABI,
    library,
    account
  ).isOpen();
}

export function getRouterContract(library, account) {
  return getContract(ROUTER_ADDRESS, ROUTER_ABI, library, account);
}

export function getExchangeContract(exchangeAddress, library, account) {
  return getContract(exchangeAddress, EXCHANGE_ABI, library, account);
}

export async function getTokenExchangeAddressFromFactory(
  tokenAddress,
  library,
  account
) {
  return getContract(
    FACTORY_ADDRESS,
    FACTORY_ABI,
    library,
    account
  ).getExchange(tokenAddress);
}

// get the ether balance of an address
export async function getEtherBalance(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'`);
  }

  return library.getBalance(address);
}

// get the token balance of an address
export async function getTokenBalance(tokenAddress, address, library) {
  if (!isAddress(tokenAddress) || !isAddress(address)) {
    throw Error(
      `Invalid 'tokenAddress' or 'address' parameter '${tokenAddress}' or '${address}'.`
    );
  }

  return getContract(tokenAddress, ERC20_ABI, library).balanceOf(address);
}

export async function getTokenAllowance(
  address,
  tokenAddress,
  spenderAddress,
  library
) {
  if (
    !isAddress(address) ||
    !isAddress(tokenAddress) ||
    !isAddress(spenderAddress)
  ) {
    throw Error(
      "Invalid 'address' or 'tokenAddress' or 'spenderAddress' parameter" +
      `'${address}' or '${tokenAddress}' or '${spenderAddress}'.`
    );
  }

  return getContract(tokenAddress, ERC20_ABI, library).allowance(
    address,
    spenderAddress
  );
}

export function amountFormatter(
  amount,
  baseDecimals = 18,
  displayDecimals = 3,
  useLessThan = true
) {

  if (
    baseDecimals > 18 ||
    displayDecimals > 18 ||
    displayDecimals > baseDecimals
  ) {
    throw Error(
      `Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`
    );
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined;
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return "0";
  }
  // amount > 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = BigNumber.from(10)
      .pow(BigNumber.from(baseDecimals));

    const minimumDisplayAmount = baseAmount.div(
      BigNumber.from(10)
        .pow(BigNumber.from(displayDecimals))
    );

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`;
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals);

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount;
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split(".");
        const roundUpAmount = minimumDisplayAmount.div(ethers.constants.Two);
        const roundedDecimalComponent = BigNumber.from(decimalComponent.padEnd(baseDecimals, "0"))
          .add(roundUpAmount)
          .toString()
          .padStart(baseDecimals, "0")
          .substring(0, displayDecimals);

        // decimals are too small to show
        if (roundedDecimalComponent === "0".repeat(displayDecimals)) {
          return wholeComponent;
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent
            .toString()
            .replace(/0*$/, "")}`;
        }
      }
    }
  }
}

export function calculateSlippageBounds(value) {
  const offset = value
    .mul(ALLOWED_SLIPPAGE)
    .div(BigNumber.from(10000));
  const minimum = value.sub(offset);
  const maximum = value.add(offset);
  return {
    minimum: minimum.lt(ethers.constants.Zero)
      ? ethers.constants.Zero
      : minimum,
    maximum: maximum.gt(ethers.constants.MaxUint256)
      ? ethers.constants.MaxUint256
      : maximum,
  };
}

// this mocks the getInputPrice function, and calculates the required output
export function calculateEtherTokenOutputFromInput(
  inputAmount,
  inputReserve,
  outputReserve
) {
  const inputAmountWithFee = inputAmount.mul(BigNumber.from(997));
  const numerator = inputAmountWithFee.mul(outputReserve);
  const denominator = inputReserve
    .mul(BigNumber.from(1000))
    .add(inputAmountWithFee);
  return numerator.div(denominator);
}

// this mocks the getOutputPrice function, and calculates the required input
export function calculateEtherTokenInputFromOutput(
  outputAmount,
  inputReserve,
  outputReserve
) {
  const numerator = inputReserve
    .mul(outputAmount)
    .mul(BigNumber.from(1000));
  const denominator = outputReserve
    .sub(outputAmount)
    .mul(BigNumber.from(997));
  return numerator.div(denominator).add(ethers.constants.One);
}

// get exchange rate for a token/ETH pair
export function getExchangeRate(inputValue, outputValue, invert = false) {
  const inputDecimals = 18;
  const outputDecimals = 18;

  if (inputValue && inputDecimals && outputValue && outputDecimals) {
    const factor = BigNumber.from(10)
      .pow(BigNumber.from(18));

    if (invert) {
      return inputValue
        .mul(factor)
        .div(outputValue)
        .mul(
          BigNumber.from(10)
            .pow(BigNumber.from(outputDecimals))
        )
        .div(
          BigNumber.from(10)
            .pow(BigNumber.from(inputDecimals))
        );
    } else {
      return outputValue
        .mul(factor)
        .div(inputValue)
        .mul(
          BigNumber.from(10)
            .pow(BigNumber.from(inputDecimals))
        )
        .div(
          BigNumber.from(10)
            .pow(BigNumber.from(outputDecimals))
        );
    }
  }
}

export function calculateGasMargin(value) {
  const offset = value.mul(GAS_MARGIN).div(BigNumber.from(10000));
  return value.add(offset);
}

export function calculateCrowdsaleAmount(WINESAmount, crowdsaleRateETH) {
  return WINESAmount.mul(
    BigNumber.from(10).pow(BigNumber.from(18))
  )
    .div(crowdsaleRateETH)
    .add(BigNumber.from(1));
}

export function calculateAmount(
  inputTokenSymbol,
  outputTokenSymbol,
  WINESAmount,
  reserveWINESETH,
  reserveWINESToken,
  reserveSelectedTokenETH,
  reserveSelectedTokenToken
) {
  // eth to token - buy
  if (
    inputTokenSymbol === TOKEN_SYMBOLS.ETH &&
    outputTokenSymbol === TOKEN_SYMBOLS.MTB
  ) {
    const amount = calculateEtherTokenInputFromOutput(
      WINESAmount,
      reserveWINESETH,
      reserveWINESToken
    );
    if (
      amount.lte(ethers.constants.Zero) ||
      amount.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    return amount;
  }

  // token to eth - sell
  if (
    inputTokenSymbol === TOKEN_SYMBOLS.MTB &&
    outputTokenSymbol === TOKEN_SYMBOLS.ETH
  ) {
    const amount = calculateEtherTokenOutputFromInput(
      WINESAmount,
      reserveWINESToken,
      reserveWINESETH
    );
    if (
      amount.lte(ethers.constants.Zero) ||
      amount.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }

    return amount;
  }

  // token to token - buy or sell
  const buyingWINES = outputTokenSymbol === TOKEN_SYMBOLS.MTB;

  if (buyingWINES) {
    // eth needed to buy x wine
    const intermediateValue = calculateEtherTokenInputFromOutput(
      WINESAmount,
      reserveWINESETH,
      reserveWINESToken
    );
    // calculateEtherTokenOutputFromInput
    if (
      intermediateValue.lte(ethers.constants.Zero) ||
      intermediateValue.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    // tokens needed to buy x eth
    const amount = calculateEtherTokenInputFromOutput(
      intermediateValue,
      reserveSelectedTokenToken,
      reserveSelectedTokenETH
    );
    if (
      amount.lte(ethers.constants.Zero) ||
      amount.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    return amount;
  } else {
    // eth gained from selling x wine
    const intermediateValue = calculateEtherTokenOutputFromInput(
      WINESAmount,
      reserveWINESToken,
      reserveWINESETH
    );
    if (
      intermediateValue.lte(ethers.constants.Zero) ||
      intermediateValue.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    // tokens yielded from selling x eth
    const amount = calculateEtherTokenOutputFromInput(
      intermediateValue,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken
    );
    if (
      amount.lte(ethers.constants.Zero) ||
      amount.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    return amount;
  }
}

export function closestIntegerDivisibleBy(x, y) {
  return x - (x % y);
}

export function USDToEth(USDExchangeRateETH, amount) {
  if (USDExchangeRateETH) {
    return amount
      .mul(BigNumber.from(10).pow(BigNumber.from(18)))
      .mul(BigNumber.from(10).pow(BigNumber.from(18)))
      .div(BigNumber.from(10).pow(BigNumber.from(2)))
      .div(USDExchangeRateETH);
  }
}

export function generateRandom() {
  // Generar un número base aleatorio
  var randomNumber = Math.random() * 1000000; // Escala el número aleatorio para que sea más grande

  // Añadir la marca de tiempo actual
  var uniqueNumber = Math.floor(randomNumber + Date.now());

  return uniqueNumber;
}
