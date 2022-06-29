import { useContext } from 'react'
import { MyWalletContext } from 'src/modules/nftLend/context/myWalletContext'

export const useCurrentWallet = () => useContext(MyWalletContext)
