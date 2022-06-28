import { useContext } from 'react'
import { MyWalletContext } from '../context/myWalletContext'

export const useCurrentWallet = () => useContext(MyWalletContext)
