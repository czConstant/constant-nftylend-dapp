import { isEVMChain } from '../../utils/wormhole_esm';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useIsWalletReady from '../../hooks/useIsWalletReady';
import { incrementStep, setSourceChain } from '../../store/nftSlice';
import {
  selectNFTIsSourceComplete,
  selectNFTShouldLockFields,
  selectNFTSourceBalanceString,
  selectNFTSourceChain,
  selectNFTSourceError,
} from '../../store/selectors';
import { ChainInfo, CHAINS_WITH_NFT_SUPPORT } from '../../utils/constant';
import ChainSelect from '../chainSelect';
import KeyAndBalance from '../KeyAndBalance';
import { TokenSelector } from '../nftSelector';

import styles from './stepSource.module.scss';
import { Button } from 'react-bootstrap';

function Source() {
  const dispatch = useDispatch();
  const sourceChain = useSelector(selectNFTSourceChain);
  const uiAmountString = useSelector(selectNFTSourceBalanceString);
  const error = useSelector(selectNFTSourceError);
  const isSourceComplete = useSelector(selectNFTIsSourceComplete);
  const shouldLockFields = useSelector(selectNFTShouldLockFields);
  const { isReady, statusMessage } = useIsWalletReady(sourceChain);
  const handleSourceChange = useCallback(
    (chain: ChainInfo) => {
      dispatch(setSourceChain(chain.id));
    },
    [dispatch]
  );
  const handleNextClick = useCallback(() => {
    dispatch(incrementStep());
  }, [dispatch]);
  return (
    <>
      <div className={styles.title}>
        <div>Select an NFT to send through the Wormhole NFT Bridge.</div>
          {/* <Button
            component={Link}
            to='/nft-origin-verifier'
            size='small'
            variant='outlined'
            startIcon={<VerifiedUser />}
          >
            NFT Origin Verifier
          </Button> */}
      </div>
      <ChainSelect
        value={sourceChain}
        onChange={handleSourceChange}
        disabled={shouldLockFields}
        chains={CHAINS_WITH_NFT_SUPPORT}
      />
      <div className={styles.onlySupport}>
        {isEVMChain(sourceChain)
          ? 'Only NFTs which implement ERC-721 are supported.'
          : 'Only NFTs with a supply of 1 are supported.'
        }
      </div>
      <KeyAndBalance chainId={sourceChain} />
      {isReady || uiAmountString ? (
        <div className={styles.transferField}>
          <TokenSelector disabled={shouldLockFields} nft={true} />
        </div>
      ) : null}
      {error && <div>{error}</div>}
      <Button disabled={!isSourceComplete} onClick={handleNextClick}>
        Next
      </Button>
    </>
  );
}

export default Source;
