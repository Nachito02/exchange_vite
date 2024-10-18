import React from 'react'

import styled from "styled-components";

import { Close } from "@styled-icons/material/Close";

import { Trans, useTranslation } from "react-i18next";

import { useAppContext } from "../../context";

const WorksFrame = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 16px 32px;
  box-sizing: border-box;
  font-size: 24px;
  font-weight: 600;
  max-height: 80vh;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;
`;
const Title = styled.p`
  margin-top: 1rem !important;

  font-weight: 600;
  font-size: 16px;
`;

const Desc = styled.p`
  line-height: 150%;
  font-size: 14px;
  margin-top: 1rem !important;
  font-weight: 500;
`;

export const EtherscanLink = styled.a`
  text-decoration: none;
  color: var(--uniswap-primary):
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`;

export default function Works({ tokenSupply, closeCheckout }) {
  const [state] = useAppContext();

  const { t } = useTranslation();

  return (
    <WorksFrame>
      <CloseFrame onClick={() => closeCheckout()} alt="close"></CloseFrame>

      <Title>{t("info.1")}</Title>
      <Desc>
        <Trans
          i18nKey="info.2"
          values={{
            token: state.tokenName,
            year: state.tokenYear,
          }}
          components={[
            <a
              href="https://costaflores.com/"
              style={{ color: "white", "text-decoration": "underline" }}
            >
              costaflores
            </a>,
          ]}
        />
      </Desc>
      <Desc>
        <Trans
          i18nKey="info.3"
          components={[
            <a
              href="https://www.youtube.com/watch?v=7ZYISUzJBMo&feature=youtu.be"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", "text-decoration": "underline" }}
            >
              {" "}
              here{" "}
            </a>,
            <a
              href="https://www.youtube.com/watch?v=GvhYdOVTmlM&feature=youtu.be"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", "text-decoration": "underline" }}
            >
              {" "}
              Openvino{" "}
            </a>,
          ]}
        />
      </Desc>
      <Desc>
        <Trans
          i18nKey="info.4"
          values={{
            date: state.redeemDate,
            token: state.tokenName,
          }}
        />
      </Desc>
      <Title>{t("info.5")}</Title>
      <Desc>
        <Trans
          i18nKey="info.6"
          components={[
            <a
              href="https://www.youtube.com/watch?v=PeXzm1L_Jyc&list=PLC67Nqxq04sy5cMoySL26NB91kH__DT8W&index=6&t=5s"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", "text-decoration": "underline" }}
            >
              {" "}
              like a fine wine!
            </a>,
          ]}
        />
      </Desc>
      <Desc>
        <a
          href="https://docs.uniswap.io/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", "text-decoration": "underline" }}
        >
          {t("info.7")}
        </a>
      </Desc>
      <Desc>
        <a
          href="http://wiki.costaflores.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", "text-decoration": "underline" }}
        >
          {t("info.8")}
        </a>
      </Desc>
      <Desc>
        <a
          href="https://t.me/joinchat/G5ohPEYvPAIvt48N1yrCRQ"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", "text-decoration": "underline" }}
        >
          {t("info.9")}
        </a>
      </Desc>
      <Desc>
        <a
          href="mailto:info@costaflores.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white", "text-decoration": "underline" }}
        >
          {t("info.10")}
        </a>
      </Desc>
    </WorksFrame>
  );
}

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
  align-self: flex-end;
  position: absolute;
`;
