import { ChainId } from '@certusone/wormhole-sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useAppDispatch } from 'src/store/hooks';
import { closeModal, openModal } from 'src/store/modal';
import { NFTParsedTokenAccount } from '../../store/nftSlice';
import { AVAILABLE_MARKETS_URL } from '../../utils/constant';
import { shortenAddress } from '../../utils/solana';
import NftViewer from '../nftViewer';
import styles from './tokenPicker.module.scss';

export const balancePretty = (uiString: string) => {
  const numberString = uiString.split('.')[0];
  const bignum = BigNumber.from(numberString);
  if (bignum.gte(1000000)) {
    return numberString.substring(0, numberString.length - 6) + ' M';
  } else if (uiString.length > 8) {
    return uiString.substr(0, 8);
  } else {
    return uiString;
  }
};

export const BasicAccountRender = (
  account: MarketParsedTokenAccount,
) => {
  const mintPrettyString = shortenAddress(account.mintKey);
  const uri = account.image_256;
  const symbol = account.symbol || 'Unknown';
  const name = account.name || 'Unknown';
  const tokenId = account.tokenId;

  return (
    <div className={styles.nftPreview}>
      <div className={styles.imgWrapper}>
        {uri && <img alt='' src={uri} />}
      </div>
      <div>
        <div>{symbol}</div>
        <div>{name}</div>
      </div>
      <div>
        <div>{mintPrettyString}</div>
        <div style={{ wordBreak: 'break-all' }}>{tokenId}</div>
      </div>
    </div>
  );
};

interface MarketParsedTokenAccount extends NFTParsedTokenAccount {
  markets?: string[];
}

interface TokenPickerProps {
  value: NFTParsedTokenAccount | null;
  options: NFTParsedTokenAccount[];
  RenderOption: ({
    account,
  }: {
    account: NFTParsedTokenAccount;
  }) => JSX.Element;
  onChange: (newValue: NFTParsedTokenAccount | null) => Promise<void>;
  isValidAddress?: (address: string) => boolean;
  getAddress?: (
    address: string,
    tokenId?: string
  ) => Promise<NFTParsedTokenAccount>;
  disabled: boolean;
  resetAccounts: (() => void) | undefined;
  chainId: ChainId;
  error?: string;
  showLoader?: boolean;
  useTokenId?: boolean;
}

export default function TokenPicker(props: TokenPickerProps) {
  const {
    value,
    options,
    RenderOption,
    onChange,
    isValidAddress,
    getAddress,
    disabled,
    resetAccounts,
    chainId,
    error,
    showLoader,
    useTokenId,
  } = props;

  const dispatch = useAppDispatch();
  
  const [holderString, setHolderString] = useState('');
  const [tokenIdHolderString, setTokenIdHolderString] = useState('');
  const [loadingError, setLoadingError] = useState('');
  const [isLocalLoading, setLocalLoading] = useState(false);
  const [selectionError, setSelectionError] = useState('');

  const openDialog = useCallback(() => {
    setHolderString('');
    setSelectionError('');
    dispatch(openModal({ id: 'NftPicker', component: dialog }))
  }, []);

  const closeDialog = useCallback(() => {
    dispatch(closeModal({ id: 'NftPicker' }))
  }, []);

  const handleSelectOption = useCallback(
    async (option: NFTParsedTokenAccount) => {
      setSelectionError('');
      let newOption = null;
      try {
        //Covalent balances tend to be stale, so we make an attempt to correct it at selection time.
        if (getAddress && !option.isNativeAsset) {
          newOption = await getAddress(option.mintKey, option.tokenId);
          newOption = {
            ...option,
            ...newOption,
            // keep logo and uri from covalent / market list / etc (otherwise would be overwritten by undefined)
            logo: option.logo || newOption.logo,
            uri: option.uri || newOption.uri,
          } as NFTParsedTokenAccount;
        } else {
          newOption = option;
        }
        await onChange(newOption);
        closeDialog();
      } catch (e: any) {
        if (e.message?.includes('v1')) {
          setSelectionError(e.message);
        } else {
          setSelectionError(
            'Unable to retrieve required information about this token. Ensure your wallet is connected, then refresh the list.'
          );
        }
      }
    },
    [getAddress, onChange, closeDialog]
  );

  const resetAccountsWrapper = useCallback(() => {
    setHolderString('');
    setTokenIdHolderString('');
    setSelectionError('');
    resetAccounts && resetAccounts();
  }, [resetAccounts]);

  const searchFilter = useCallback(
    (option: NFTParsedTokenAccount) => {
      if (!holderString) {
        return true;
      }
      const optionString = (
        (option.publicKey || '') +
        ' ' +
        (option.mintKey || '') +
        ' ' +
        (option.symbol || '') +
        ' ' +
        (option.name || ' ')
      ).toLowerCase();
      const searchString = holderString.toLowerCase();
      return optionString.includes(searchString);
    },
    [holderString]
  );

  const nonFeaturedOptions = useMemo(() => {
    return options.filter(searchFilter);
  }, [options, searchFilter]);

  const localFind = useCallback(
    (address: string, tokenIdHolderString: string) => {
      return options.find(
        (x) =>
          x.mintKey === address &&
          (!tokenIdHolderString || x.tokenId === tokenIdHolderString)
      );
    },
    [options]
  );

  //This is the effect which allows pasting an address in directly
  useEffect(() => {
    if (!isValidAddress || !getAddress) {
      return;
    }
    if (useTokenId && !tokenIdHolderString) {
      return;
    }
    setLoadingError('');
    let cancelled = false;
    if (isValidAddress(holderString)) {
      const option = localFind(holderString, tokenIdHolderString);
      if (option) {
        handleSelectOption(option);
        return () => {
          cancelled = true;
        };
      }
      setLocalLoading(true);
      setLoadingError('');
      getAddress(
        holderString,
        useTokenId ? tokenIdHolderString : undefined
      ).then(
        (result) => {
          if (!cancelled) {
            setLocalLoading(false);
            if (result) {
              handleSelectOption(result);
            }
          }
        },
        (error) => {
          if (!cancelled) {
            setLocalLoading(false);
            setLoadingError('Could not find the specified address.');
          }
        }
      );
    }
    return () => (cancelled = true);
  }, [
    holderString,
    isValidAddress,
    getAddress,
    handleSelectOption,
    localFind,
    tokenIdHolderString,
    useTokenId,
  ]);

  //TODO reset button
  //TODO debounce & save hotloaded options as an option before automatically selecting
  //TODO sigfigs function on the balance strings

  const localLoader = (
    <div>
      {showLoader ? 'Loading available tokens' : 'Searching for results'}
    </div>
  );

  const displayLocalError = (
    <div>
      <div className={styles.error}>
        {loadingError || selectionError}
      </div>
    </div>
  );

  const dialog = (
    <div className={styles.nftPicker}>
      <div className={styles.header}>
        <div>Select a token</div>
        <Button onClick={resetAccountsWrapper}>Reload NFTs</Button>
      </div>
      <div className={styles.body}>
        <div className={styles.alert}>
          You should always check for markets and liquidity before sending
          tokens.{' '}
          <a
            href={AVAILABLE_MARKETS_URL}
            target='_blank'
            rel='noopener noreferrer'
          >
            Click here to see available markets for wrapped tokens.
          </a>
        </div>
        <input
          className={styles.inputBox}
          placeholder='Search name or paste address'
          value={holderString}
          onChange={(event) => setHolderString(event.target.value)}
        />
        {useTokenId ? (
          <input
            className={styles.inputBox}
            placeholder='Token Id'
            value={tokenIdHolderString}
            onChange={(event) => setTokenIdHolderString(event.target.value)}
          />
        ) : null}
        {isLocalLoading || showLoader ? (
          localLoader
        ) : loadingError || selectionError ? (
          displayLocalError
        ) : (
          <div className={styles.list}>
            {nonFeaturedOptions.map((option) => {
              return (
                <div
                  onClick={() => handleSelectOption(option)}
                  key={option.publicKey + option.mintKey + (option.tokenId || '')}
                >
                  <RenderOption account={option} />
                </div>
              );
            })}
            {nonFeaturedOptions.length ? null : (
              <div className={styles.alignCenter}>
                <div>No results found</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const selectionChip = (
    <Button
      onClick={openDialog}
      disabled={disabled}
      className={styles.buttonSelect}
    >
      {value ? <RenderOption account={value} /> : 'Select a token'}
    </Button>
  );

  return (
    <>
      {dialog}
      {value && <NftViewer value={value} chainId={chainId} />}
      {selectionChip}
    </>
  );
}
