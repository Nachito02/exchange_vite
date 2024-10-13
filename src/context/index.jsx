import React, { useState, useContext } from 'react'

import { TRADE_TYPES } from '../utils'

export const AppContext = React.createContext([{}, () => {}])

const initialState = {
  apiUrl: '',
  visible: false,
  count: 1,
  valid: false,
  networkId: 1,
  tradeType: TRADE_TYPES.BUY,
  title: '',
  tokenName: '',
  crowdsaleAddress: '',
  tokenYear: '',
  tokenAddress: '',
  image: '',
  tokenIcon: '',
  email: '',
  emailValid: false,
  name:''
}



export default function AppProvider({ children, ...setupState }) {
  const [state, setState] = useState({
    ...initialState,
    ...setupState
  })

  return <AppContext.Provider value={[state, setState]}>{children}</AppContext.Provider>
}

export function useAppContext() {
  return useContext(AppContext)
}
