import { useEffect, useState, useCallback, useMemo } from "react";
import { client } from "../config/thirdwebClient";
import { defineChain, optimismSepolia } from "thirdweb/chains";
import {  useActiveAccount } from "thirdweb/react";
import {
  isAddress,
  getTokenContract,
  getExchangeContract,
  getTokenExchangeAddressFromFactory,
  getEtherBalance,
  getTokenBalance,
  getTokenAllowance,
  TOKEN_ADDRESSES,
  ROUTER_ADDRESS,
  getCrowdsaleContract,
  getPairContract,
  getNetworkId,
  getRouterContract,
} from "../utils";
import { pack, keccak256 } from "@ethersproject/solidity";
import { getCreate2Address } from "@ethersproject/address";
import { ethers } from "ethers";
import { WETH, INIT_CODE_HASH, FACTORY_ADDRESS } from "@uniswap/sdk";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";

export function useCrowdsaleContract(
  crowdsaleAddress,
  withSignerIfPossible = true
) {
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: optimismSepolia,
  });

  const account = useActiveAccount();

  return useMemo(() => {
    try {
      return getCrowdsaleContract(
        crowdsaleAddress,
        library,
        withSignerIfPossible ? account?.address : undefined
      );
    } catch {
      return null;
    }
  }, [account?.address,  crowdsaleAddress, withSignerIfPossible]);
}

export function useTokenContract(tokenAddress, withSignerIfPossible = true) {
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: optimismSepolia,
  });

  const account = useActiveAccount();

  return useMemo(() => {
    try {
      return getTokenContract(
        tokenAddress,
        library,
        withSignerIfPossible ? account?.address : undefined
      );
    } catch {
      return null;
    }
  }, [account?.address]);
}

export function useRouterContract(withSignerIfPossible = true) {
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: optimismSepolia,
  });

  const account = useActiveAccount();

  return useMemo(() => {
    try {
      return getRouterContract(
        library,
        withSignerIfPossible ? account?.address : undefined
      );
    } catch (e) {
      return null;
    }
  }, [account?.address, library, withSignerIfPossible]);
}

export function useExchangeContract(tokenAddress, withSignerIfPossible = true) {
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: optimismSepolia,
  });

  const account = useActiveAccount();

  const [exchangeAddress, setExchangeAddress] = useState();
  // useEffect(() => {
  //   if (isAddress(tokenAddress)) {
  //     let stale = false;
  //     getTokenExchangeAddressFromFactory(tokenAddress, library).then(
  //       (exchangeAddress) => {
  //         if (!stale) {
  //           setExchangeAddress(exchangeAddress);
  //         }
  //       }
  //     );
  //     return () => {
  //       stale = true;
  //       setExchangeAddress();
  //     };
  //   }
  // }, [library, tokenAddress]);

  return useMemo(() => {
    try {
      return getExchangeContract(
        exchangeAddress,
        library,
        withSignerIfPossible ? account?.address : undefined
      );
    } catch (e) {
      return null;
    }
  }, [exchangeAddress, withSignerIfPossible, account?.address]);
}

export function usePairContract(tokenAddress, withSignerIfPossible = true) {
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: optimismSepolia,
  });

  const account = useActiveAccount();
  return useMemo(() => {
    try {
      const networkId = getNetworkId()
      if (networkId === 11155420) {
        const pair = "0xE10c54437A8638308d99418B8EC6B63bfBd00D0b"
        return getPairContract(
          pair,
          library,
          withSignerIfPossible ? account?.address : undefined
        );

      } else {
        const token1 = WETH[getNetworkId()].address;
        const token0 = tokenAddress;

        const pair = getCreate2Address(
          FACTORY_ADDRESS,
          keccak256(["bytes"], [pack(["address", "address"], [token0, token1])]),
          INIT_CODE_HASH
        );
        return getPairContract(
          pair,
          library,
          withSignerIfPossible ? account?.address : undefined
        );
      }
    } catch {
      return null;
    }
  }, [  tokenAddress, withSignerIfPossible]);
}

export function useReserves(pairContract) {
  const [reserves, setReserves] = useState();

  const updateReserves = useCallback(() => {
    if (!!pairContract) {

      pairContract
        .getReserves()
        .then((value) => {
          setReserves(value);
        })
        .catch((error) => {
          setReserves(null);
        });
      return () => {
        setReserves();
      };
    }
  }, [pairContract]);

  useEffect(() => {
    return updateReserves();
  }, [updateReserves]);

  if (reserves) {
    return reserves;
  } else {
    return {
      0: null,
      1: null,
    };
  }
}

export function useAddressBalance(address, tokenAddress) {
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: optimismSepolia,
  });

  const [balance, setBalance] = useState();

  const updateBalance = useCallback(() => {
    if (
      isAddress(address) &&
      (tokenAddress === "ETH" || isAddress(tokenAddress))
    ) {
      let stale = false;

      (tokenAddress === "ETH"
        ? getEtherBalance(address, library)
        : getTokenBalance(tokenAddress, address, library)
      )
        .then((value) => {
          if (!stale) {
            setBalance(value);
          }
        })
        .catch((error) => {
          if (!stale) {
            setBalance(null);
          }
        });
      return () => {
        stale = true;
        setBalance();
      };
    }
  }, [address,  tokenAddress]);

  useEffect(() => {
    return updateBalance();
  }, [updateBalance]);

  // useBlockEffect(updateBalance)

  return balance;
}

export function useTokenSupply(contract) {
  const [tokenSupply, setTokenSupply] = useState();

  const updateTokenSupply = useCallback(() => {
    if (!!contract) {
      let stale = false;

      contract
        .totalSupply()
        .then((value) => {
          if (!stale) {
            setTokenSupply(value);
          }
        })
        .catch(() => {
          if (!stale) {
            setTokenSupply(null);
          }
        });
      return () => {
        stale = true;
        setTokenSupply();
      };
    }
  }, [contract]);

  useEffect(() => {
    return updateTokenSupply();
  }, [updateTokenSupply]);

  // useBlockEffect(updateTokenSupply)

  return tokenSupply && Math.round(Number(ethers.utils.formatEther(tokenSupply)));
}

export function useTokenCap(contract) {
  const [tokenCap, setTokenCap] = useState();

  const updateTokenCap = useCallback(() => {
    if (!!contract) {
      let stale = false;

      contract
        .cap()
        .then((value) => {
          if (!stale) {
            setTokenCap(value);
          }
        })
        .catch(() => {
          if (!stale) {
            setTokenCap(null);
          }
        });
      return () => {
        stale = true;
        setTokenCap();
      };
    }
  }, [contract]);

  useEffect(() => {
    return updateTokenCap();
  }, [updateTokenCap]);

  // useBlockEffect(updateTokenCap)

  return tokenCap && Math.round(Number(ethers.utils.formatEther(tokenCap)));
}

export function useExchangeReserves(tokenAddress) {
  const exchangeContract = useExchangeContract(tokenAddress);

  const reserveETH = useAddressBalance(
    exchangeContract && exchangeContract.address,
    TOKEN_ADDRESSES.ETH
  );
  const reserveToken = useAddressBalance(
    exchangeContract && exchangeContract.address,
    tokenAddress
  );

  return { reserveETH, reserveToken };
}

export function useAddressAllowance(address, tokenAddress, spenderAddress) {
 

  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: optimismSepolia,
  });

  const [allowance, setAllowance] = useState();

  const updateAllowance = useCallback(() => {
    if (
      isAddress(address) &&
      isAddress(tokenAddress) &&
      isAddress(spenderAddress)
    ) {
      let stale = false;

      getTokenAllowance(address, tokenAddress, spenderAddress, library)
        .then((allowance) => {
          if (!stale) {
            setAllowance(allowance);
          }
        })
        .catch(() => {
          if (!stale) {
            setAllowance(null);
          }
        });

      return () => {
        stale = true;
        setAllowance();
      };
    }
  }, [address,  spenderAddress, tokenAddress]);

  useEffect(() => {
    return updateAllowance();
  }, [updateAllowance]);

  // useBlockEffect(updateAllowance)

  return allowance;
}

export function useExchangeAllowance(address, tokenAddress) {
  const exchangeContract = useExchangeContract(tokenAddress);

  return useAddressAllowance(
    address,
    tokenAddress,
    exchangeContract && exchangeContract.address
  );
}

export function useRouterAllowance(address, tokenAddress) {
  const routerContract = useRouterContract();

  return useAddressAllowance(
    address,
    tokenAddress,
    routerContract && routerContract.address
  );
}
