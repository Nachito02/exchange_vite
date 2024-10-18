import  { useEffect, useState } from "react";

import { currenciesNames } from "../../utils";
import { fetchPrice } from "../../utils/fetchPrice";
import {
  DropControl,
  DropdownContainer,
  NoHeight,
  Option,
  SelectContainer,
  SelectItem,
  SelectMenu,
  SelectWrapper,
} from "../../styles";

export default function SelectToken({
  prefix, //eth value
}) {
  const [selectedCurrency, seSelectedCurrency] = useState(currenciesNames[0]);
  const [changeRate, setChangeRate] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const renderOptions = (selectedCurrency, i) => {
    let renderPrefix = prefix * changeRate;
    return (
      <p key={i} value={selectedCurrency}>
    
        {selectedCurrency === "ETH" ?   (renderPrefix.toFixed(6)+ " " + selectedCurrency) : 
        renderPrefix.toFixed(2)+ " " + selectedCurrency
        }

     
      </p>
    );
  };

  const handleSelectMenuClick = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchExchangeRate = async () => {
      let toCurrency;
      if (selectedCurrency === "USD") {
        toCurrency = "DAI";
      } else {
        toCurrency = selectedCurrency;
      }
      const changeRate = await fetchPrice("ETH", toCurrency);
      setChangeRate(changeRate);
    };
    fetchExchangeRate();
  }, [selectedCurrency]);

  const handleOpenCurreciesChanger = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option) => {
    seSelectedCurrency(option);
    setIsOpen(false);
  };

  return (
    <SelectContainer>
      <SelectWrapper>
        <SelectMenu
      
          onClick={handleSelectMenuClick}
          className="dropdown"
        >
          {
            renderOptions(selectedCurrency,  prefix)
          }
        </SelectMenu>

        <NoHeight
          onClick={handleOpenCurreciesChanger}
          style={{ cursor: "pointer" }}
        >
          <DropControl alt="dropdown-arrow" />
        </NoHeight>
      </SelectWrapper>

      <DropdownContainer isOpen={isOpen}>
        {currenciesNames.map((option, index) => (
          <Option key={index} onClick={() => handleSelectOption(option)}>
            {option}
          </Option>
        ))}
      </DropdownContainer>
    </SelectContainer>
  );
}
