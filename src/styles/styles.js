import styled from "styled-components";
import { Close } from "@styled-icons/material/Close";
import { Info, KeyboardArrowDown } from "@styled-icons/material";
import Button from "../components/shared/Button";
export const Container = styled.div`
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 64px;

  @media only screen and (max-width: 480px) {
    margin: 32px;
  }
`;

export const CardWrapper = styled.div`
  max-width: 750px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: #f1ede2;
  display: flex;
  flex-direction: row;
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
`;

export const Farm = styled.div`
  position: absolute;
  top: 16px;
  right: 86px;
  font-weight: 300;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

export const Redeem = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  font-weight: 300;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

export const Title = styled.p`
  font-weight: 500;
  font-size: 24px;
  line-height: 126.7%;
  margin: 0;

  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    font-size: 22px;
  }
`;

export const CurrentPrice = styled.p`
  font-size: 18px;
  margin: 0px;
  margin-bottom: 0.5rem;
  font-feature-settings: "tnum" on, "onum" on;

  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    margin-top: 8px;
    font-size: 14px;
  }
`;

export const MarketData = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const ImageContainer = styled.div`
  width: 43%;

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

export const Image = styled.img`
  max-width: 66%;
  height: auto;
  max-height: 90vh;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -50px;
`;

export const InfoIcon = styled(Info)`
  color: white;
  height: 25px;
  width: 25px;
  cursor: pointer;
  padding: 0 8px;
  padding-bottom: 4px;
  box-sizing: content-box;
`;
export const TokenIconContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px 0;
`;

export const TokenIconText = styled.div`
  font-size: 79.5px;
  font-weight: 500;
  line-height: 0.9;
  padding-right: 8px;

  @media only screen and (max-width: 600px) {
    font-size: 60px;
  }
`;

export const TokenIcon = styled.img`
  width: 42px;
  height: 42px;

  @media only screen and (max-width: 600px) {
    width: 36px;
    height: 36px;
  }
`;

export const CheckoutFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  color: #fff;
  background-color: #141414;
  max-width: 450px;
  visibility: ${(props) => !props.isVisible && "hidden"};

  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;

  z-index: 2;

  p {
    margin: 0px;
  }
`;

export const CheckoutBackground = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  opacity: ${(props) => (props.isVisible ? ".7" : "0")};
  width: 100vw;
  height: 100vh;
  z-index: ${(props) => (props.isVisible ? "1" : "-1")};
  pointer-events: ${(props) => (props.isVisible ? "all" : "none")};
  background-color: #000;
  transition: opacity 0.3s;
  pointer-events: ${(props) => (props.isVisible ? "all" : "none")};
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 32px;
  box-sizing: border-box;
  overflow-y: scroll;
`;

export const Header = styled.div`
  width: 100%;
  color: #fff;
  font-weight: 500;
  margin: 0px;
  font-size: 1rem;
  letter-spacing: 1.33px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const TopFrame = styled.div`
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 16px;
`;

export const Description = styled.div`
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 1.33px;
  padding-bottom: 8px;
`;

export const CloseIcon = styled(Close)`
  cursor: pointer;
  height: 24px;
  width: 24px;
`;

export const InfoFrame = styled.div`
  opacity: ${(props) => (props.pending ? 0.6 : 1)};
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ImgStyle = styled.img`
  width: 33%;
  padding: 2rem 0 2rem 0;
  box-sizing: border-box;
`;
export const WineCount = styled.span`
  font-weight: normal;
  margin: 0px;
  margin-top: 8px;
  font-size: 0.9rem;
  letter-spacing: 1.06px;
`;

export const WineTitle = styled.div`
  font-size: 2rem;
  font-weight: 500;
`;

export const USDPrice = styled.div`
  font-size: 1rem;
  letter-spacing: 1.46px;
  font-weight: 500;
  padding-bottom: 16px;
`;

export const CurrentPriceBuySell = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin: 0px;
  font-feature-settings: "tnum" on, "onum" on;
`;

export const CheckoutControls = styled.span`
  width: 100%;
  padding: 16px 0px 32px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

export const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0;
  text-align: left;
  width: 100%;
`;

export const ButtonFrame = styled(Button)`
  height: 48px;
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
`;

export const EtherscanLink = styled.a`
  text-decoration: underline;
  color: white;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  margin-top: 8px;
`;
export const Connect = styled.div`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid white;
  cursor: ${(props) => (props.balanceWINES ? "auto" : "pointer")};

  transform: scale(1);
  transition: transform 0.3s ease;

  :hover {
    transform: ${(props) => (props.balanceWINES ? "scale(1)" : "scale(1.02)")};
  }
`;

export const Status = styled.div`
  display: ${(props) => (props.balanceWINES ? "initial" : "none")};
  width: 12px;
  height: 12px;
  border-radius: 100%;
  margin-left: 12px;
  margin-top: 2px;
  float: right;
  background-color: ${(props) =>
    props.account === null ? "#CF2C0A" : props.ready ? "#66BB66" : "#CF2C0A"};
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  font-size: 0.8em;
  margin: 8px 0;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  background-color: transparent;
  color: white;
  outline: none;
`;

export const SelectMenu = styled.div`
  display: block;
  font-size: 1rem;
  margin: 1rem;
  width: 100%;
  height: 48px;
  max-width: 100%;
  box-sizing: border-box;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0;
  margin-top: 1rem;
  appearance: none;
  background-color: transparent;
  color: #fff;
  display: flex;
  flex-direction: row;
  padding-left: 1rem;
`;

export const SelectContainer = styled.div`
  position: relative;
`;

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const DropdownContainer = styled.div`
  position: absolute;
  bottom: calc(100% - 3rem);
  left: calc(100% + 1rem);
  background-color: black;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

export const Option = styled.div`
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin: 0 -1rem;
  &:hover {
    background-color: #840c4a;
  }
`;

export const SelectItem = styled.option`
  border: none;
  width: 100%;
  border-radius: 24px;
  background-color: #9a999e;
  padding: 0px 0.5rem 0px 0.5rem;
`;

export const NoHeight = styled.div`
  height: 0px;
  position: relative;
  top: -50px;
  left: 144px;
`;

export const DropControl = styled(KeyboardArrowDown)`
  height: 18px;
  width: 18px;
`;
