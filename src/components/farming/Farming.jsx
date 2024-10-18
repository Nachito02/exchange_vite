import { useState, useEffect, useRef, useLayoutEffect } from "react";
import styled from "styled-components";

export default function Farming({ tokenAddress, setShowFarming }) {
  return (
    <>
      <Wrapper onClick={() => setShowFarming(false)}>
        <iframe
          src={`https://app.uniswap.org/#/add/v2/ETH/${tokenAddress}?theme=dark`}
          height="100%"
          width="100%"
          style={{
            position: "absolute",
            right: 0,
            border: 0,
            margin: "0 auto",
            display: "block",
            maxWidth: "450px",
            width: "90%",
          }}
          id="myId"
        />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 32px;
  box-sizing: border-box;
  overflow-y: scroll;
  z-index: 999;
`;
