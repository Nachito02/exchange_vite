import React, { useEffect } from "react";
import {
  createCustomElement,
  DOMModel,
  byAttrVal,
} from "@adobe/react-webcomponent";
import AppProvider from "../context";
import Main from "./Main";

import "../i18n";
import { ThirdwebProvider } from "thirdweb/react";

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
  winerie_id
}) {


  const redeemDate = new Date(redeemdate);

  useEffect(() => {
    localStorage.setItem("uniswap.network", networkid);
    localStorage.setItem("uniswap.token", tokenaddress);
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
    return <div></div>;
  }

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
      <Main></Main>
      
    </AppProvider>
    </ThirdwebProvider>

  );
}

export default createCustomElement(UniSwap, UniSwapModel, "container");
