import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
const EstimateGas = () => {

  const {t} = useTranslation()
  return (
    <div>
      {/* <p>{t('wallet.estimate')} </p> */}
      <Text >{t('wallet.estimate')} </Text>

    </div>
  )
}


const Text = styled.p`
  text-align: center;
  font-weight: bold;
  color:#e1e1e1;
`

export default EstimateGas