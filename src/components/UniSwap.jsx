import React,{ useEffect } from "react";
import {
  createCustomElement,
  DOMModel,
  byAttrVal,
} from "@adobe/react-webcomponent";
import AppProvider from "../context";
import Main from "./Main";

import "../i18n";
import { ThirdwebProvider } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";

class UniSwapModel extends DOMModel {
  @byAttrVal() title;
  @byAttrVal() apiurl;
  @byAttrVal() providerurl;
  @byAttrVal() networkid;
  @byAttrVal() crowdsaleaddress;
  @byAttrVal() tokenaddress;
  @byAttrVal() redeemdate;
  @byAttrVal() tokenyear;
  @byAttrVal() tokenname;
  @byAttrVal() image;
  @byAttrVal() tokenicon;
  @byAttrVal() mapsapikey;
  @byAttrVal() shippingaccount;
  @byAttrVal() winerie_id;
}

function UniSwap({
  networkid,
  providerurl,
  apiurl,
  title,
  tokenaddress,
  crowdsaleaddress,
  redeemdate,
  tokenyear,
  tokenname,
  image,
  tokenicon,
  mapsapikey,
  shippingaccount,
  winerie_id,
}) {
  const redeemDate = new Date(redeemdate);

  useEffect(() => {
    if (networkid && tokenaddress) {
      localStorage.setItem("uniswap.network", networkid);
      localStorage.setItem("uniswap.token", tokenaddress);
    }
  }, [networkid, tokenaddress]);

  if (
    !providerurl ||
    !networkid ||
    !tokenname ||
    !tokenaddress ||
    !redeemdate ||
    isNaN(redeemDate) ||
    !tokenyear ||
    !tokenicon ||
    !apiurl ||
    !mapsapikey ||
    !shippingaccount
  ) {
    return <div>Required data is missing. Please check the configuration.</div>;
  }

  const connectionManager = {
    defineChains: (chains) => {
      chains.push(baseSepolia);
    },
  };

  return (
    <ThirdwebProvider>
      <AppProvider
        title={title}
        networkId={networkid}
        tokenAddress={tokenaddress}
        crowdsaleAddress={crowdsaleaddress}
        redeemDate={redeemDate}
        tokenYear={tokenyear}
        tokenName={tokenname}
        image={image}
        tokenIcon={tokenicon}
        apiUrl={apiurl}
        mapsApiKey={mapsapikey}
        shippingAccount={shippingaccount}
        winerie_id={winerie_id}
      >
        <Main />
      </AppProvider>
    </ThirdwebProvider>
  );
}

export default createCustomElement(UniSwap, UniSwapModel, "container");
