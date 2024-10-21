import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import styled from 'styled-components'
import Select from 'react-select'
import { useAppContext } from '../../context'
import Button from '../shared/Button'
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers'
import { client } from "../../config/thirdwebClient";
import { defineChain, baseSepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import {
  amountFormatter,
  USDToEth
} from '../../utils'
import axios from 'axios';
import { fetchCountries } from '../../utils/fetchCountries'
import { ethers5Adapter } from 'thirdweb/adapters/ethers5'
import { BigNumber } from 'ethers'
import { signMessage } from 'thirdweb/utils'
const bot = 'beep-boop'
const name = 'name'
const line1 = 'line1'
const line2 = 'line2'
const city = 'city'
const state = 'state'
const zip = 'zip'
const country = 'country'
const email = 'email'
const address = 'address'
const timestamp = 'timestamp'
const numberBurned = 'number-burned'
const signature = 'signature'
const telegram = 'telegram'
const pickup = 'pickup';

const nameOrder = [name, line1, line2, city, state, zip, country, email, telegram]

const defaultState = {
  [bot]: '',
  [name]: '',
  [line1]: '',
  [line2]: '',
  [city]: '',
  [zip]: '',
  [state]: '',
  [country]: '',
  [email]: '',
  [telegram]: '',
  [pickup]: false,
}

/* // mapping from field to google maps return value
const addressMapping = [
  { [line1]: 'street_address' },
  { [city]: 'sublocality' },
  { [state]: 'administrative_area_level_1' },
  { [zip]: 'postal_code' },
  { [country]: 'country' }
]
 */
export default function RedeemForm({ USDExchangeRateETH, shippingCost, setShippingCost, setHasConfirmedAddress, setUserForm, numberBurned: actualNumberBurned }) {
  const { t } = useTranslation();
  const library = ethers5Adapter.provider.toEthers({
    client,
    chain: baseSepolia,
  });

  const account = useActiveAccount();
  const [autoAddress, setAutoAddress] = useState([])
  const [inputY, setInputY] = useState(0)
  const suggestEl = useRef()
  const [appState] = useAppContext()
  const [formState, setFormState] = useState(defaultState)
  const [shippingCostError, setShippingCostError] = useState(false)
  const [countrieSelector, setCountrieSelector] = useState('');
  const [countries, setCountries] = useState({})
  const [provinces, setProvinces] = useState({})

  useEffect(() => {
    async function getCountries() {
      try {
        let response = await fetchCountries()
        setCountries(response.data.countries)
        setProvinces(response.data.provinces)
      } catch (error) {
        console.log(error);
      }
    }
    getCountries();
  }, [])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormState(state => ({ ...state, [name]: type === 'checkbox' ? checked : value }))
  }



  async function getShippingCosts(country, state, amount) {
    try {
      let res = await axios.get(`${import.meta.env.VITE_DASHBOARD_URL}/api/routes/shippingCostsRoute?token=${appState.tokenName}&province_id=${state}&amount=${amount}`)
      if (res.data) {
        let dollarCost = BigNumber.from(res.data.cost * 100)
        setShippingCostError(false)
        setShippingCost(dollarCost)
      }
    } catch (e) {
      setShippingCostError(true)
    }
  }

  useEffect(() => {
    handleChange({ target: { name: [address], value: account } })
  }, [account, autoAddress, setUserForm])

  useLayoutEffect(() => {
    if (suggestEl.current) {
      setInputY(suggestEl.current.getBoundingClientRect().bottom)
    }
  }, [suggestEl])

  useEffect(() => {
    // Reset province when country changes
    if (countrieSelector) {
      const firstProvince = Object.keys(provinces).find(key => provinces[key].province_id.startsWith(countrieSelector + '-'));
      if (firstProvince) {
        setFormState(state => ({ ...state, state: provinces[firstProvince].province_id }));
        getShippingCosts(countrieSelector, provinces[firstProvince].province_id, actualNumberBurned);
      } else {
        setFormState(state => ({ ...state, state: '' }));
      }
    }
  }, [countrieSelector, provinces]);

  const canSign =
    formState[name] &&
    formState[line1] &&
    formState[city] &&
    formState[state] &&
    formState[zip] &&
    formState[country] &&
    formState[email]

  const selectStyles = {
    container: provided => ({
      ...provided,
      width: '100%',
      margin: '6px 0',
    }),
    control: provided => ({
      ...provided,
      'background-color': 'rgba(255, 255, 255, 0.05)',
      border: 'none',
      'font-size': '16px',
      'box-shadow': 'inset 0 0 0 1px rgba(213, 132, 27, 0.5)'
    }),
    singleValue: provided => ({
      ...provided,
      color: 'white',
      'font-size': '16px'
    }),
    menu: provided => ({
      ...provided,
      color: '#141414'
    }),
  };

  const countryOptions = Object.keys(countries).map(key => {
    const name = countries[key].place_description;
    return {
      value: countries[key].country_id,
      label: name
    }
  })

  const stateOptions = Object.keys(provinces)
    .filter(key => provinces[key].province_id.startsWith(countrieSelector + '-'))
    .map(key => {
      const name = provinces[key].place_description;
      return {
        value: provinces[key].province_id,
        label: name
      };
    });

  return (
    <FormFrame autocomplete="off">
      <input hidden type="text" name="beep-boop" value={formState[bot]} onChange={handleChange} />
      <input
        required
        type="text"
        name={name}
        value={formState[name]}
        onChange={handleChange}
        placeholder={t('redeem.name')}
        autoComplete="name"
      />
      <Compressed>
        <input
          required
          type="text"
          name={line1}
          value={formState[line1]}
          onChange={handleChange}
          placeholder={t('redeem.line1')}
          autoComplete="off"
        />
        <input
          type="text"
          name={line2}
          value={formState[line2]}
          onChange={handleChange}
          placeholder={t('redeem.line2')}
          autoComplete="off"
        />
      </Compressed>
      <input
        required
        type="text"
        name={city}
        value={formState[city]}
        onChange={handleChange}
        placeholder={t('redeem.city')}
        autoComplete="address-level2"
      />
      <input
        required
        type="text"
        name={zip}
        value={formState[zip]}
        onChange={handleChange}
        placeholder={t('redeem.zip')}
        autoComplete="postal-code"
      />
      <Select
        placeholder={t('redeem.country')}
        styles={selectStyles}
        options={countryOptions}
        components={{ IndicatorSeparator: () => null }}
        onChange={event => {
          setFormState(state => ({ ...state, country: event.value, state: '' }))
          setCountrieSelector(event.value)
        }}
      />
      <Select
        placeholder={t('redeem.state')}
        styles={selectStyles}
        options={stateOptions}
        components={{ IndicatorSeparator: () => null }}
        value={stateOptions.find(option => option.value === formState[state])}
        onChange={event => {
          setFormState(state => ({ ...state, state: event.value }))
          getShippingCosts(formState[country], event.value, actualNumberBurned)
        }}
      />
      <input
        required
        type="email"
        name={email}
        value={formState[email]}
        onChange={handleChange}
        placeholder={t('redeem.email')}
        autoComplete="email"
      />
      <input
        type="text"
        name={telegram}
        value={formState[telegram]}
        onChange={handleChange}
        placeholder={t('redeem.telegram')}
        autoComplete="off"
      />
      <input
        type="checkbox"
        name={pickup}
        checked={formState[pickup]}
        onChange={handleChange}
        autoComplete="off"
      />
      <span style={{ textAlign: 'center', width: "100%" }}>{t("redeem.pickup")}</span>
      {(!shippingCostError && shippingCost && formState[pickup] === false) ? (
        <div style={{ fontWeight: 'normal', fontSize: '14px', padding: '16px 0', textAlign: "center" }}>
          {t('redeem.shipping-cost')}: ${amountFormatter(shippingCost, 2, 2)} USD ({amountFormatter(USDToEth(USDExchangeRateETH, shippingCost), 18, 5)} ETH)
        </div>
      ) : shippingCostError ? <div style={{ fontWeight: 'normal', fontSize: '14px', padding: '16px 0' }}>
        {t('redeem.shipping-cost-not-found')}
      </div> : <></>}
      <ButtonFrame
        className="button"
        disabled={!canSign || shippingCostError}
        text={t('redeem.next')}
        type={'submit'}
        onClick={async (event) => {
          const signer = await ethers5Adapter.signer.toEthers({
            client,
            chain: baseSepolia,
            account
          });

          

          const timestampToSign = Math.round(Date.now() / 1000)
          const formDataMessage = nameOrder.map(o => `${t(`${o}`)}: ${formState[o]}`).join('\n')
          const autoMessage = `${t('redeem.address')}: ${account?.address}\n${t('redeem.timestamp')}: ${timestampToSign}\n${t('redeem.numberBurned')}: ${actualNumberBurned}`


          // signer.signMessage(`${formDataMessage}\n${autoMessage}`).then(returnedSignature => {
          //   formState.signature = returnedSignature
          //   setUserForm(formState)
          //   setHasConfirmedAddress(true)
          // })

          await signMessage({
            message: autoMessage,
            account,
          })

          setUserForm(formState)
          setHasConfirmedAddress(true)

          event.preventDefault()
        }}
      />
      <br />
    </FormFrame>
  )
}

const FormFrame = styled.form`
  width: calc(100% - 32px);
  color: #fff;
  font-weight: 600;
  padding: 16px;
  /* margin-bottom: 0px; */
  font-size: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  input {
    font-family: Futura, Helvetica, sans-serif;
    border: none;
    background-image: none;
    background-color: transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    color: white;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 12px 8px;
    margin: 6px 0;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
  }
  input:required {
    box-shadow: inset 0 0 0 1px rgba(213, 132, 27, 0.5);
  }
  input:valid {
    border: nne;
    box-shadow: none;
  }
  input::-webkit-input-placeholder {
    color: #8a8a8a;
  }
`

const Compressed = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

const ButtonFrame = styled(Button)`
  height: 48px;
  padding: 16px;
  margin: 16px;
  width: calc(100% - 32px);
  border-color: #d5841b;
  background: #d5841b;
`
