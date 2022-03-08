import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';

import EmptyList from 'src/common/components/emptyList';
import { closeModal, openModal } from 'src/store/modal';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

import ListNft from '../listNft';
import styles from './styles.module.scss';
import AssetDetailModal from 'src/modules/nftLend/components/assetDetailModal';
import CreateLoan from '../createLoan';
import { selectNftLend } from 'src/store/nftLend';

const ListAsset = () => {
  const dispatch = useAppDispatch();
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const needReload = useAppSelector(selectNftLend).needReload;

  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (publicKey) fetchNFTs();
  }, [publicKey, needReload]);

  const onMakeLoan = async (nftToken: any) => {
    const close = () => dispatch(closeModal({ id: 'createLoanModal' }));
    dispatch(openModal({
      id: 'createLoanModal',
      modalProps: { centered: true, backdrop: 'static', padding: 0 },
      render: () => <CreateLoan connection={connection} wallet={wallet} nftMint={nftToken.mint} onClose={close} />,
    }));
  };

  const onClickShowDetail = (item: any) => {
    const close = () => dispatch(closeModal({ id: 'detailLoanModal' }));
    return dispatch(openModal({
      id: 'detailLoanModal',
      modalProps: { centered: true, size: 'lg' },
      render: () => <AssetDetailModal onClose={close} item={item} />,
    }));
  };

  const fetchNFTs = async () => {
    if (!publicKey) return;
    try {
      const nfts = await getParsedNftAccountsByOwner({ publicAddress: publicKey.toString(), connection });
      const _nfts = nfts.map((nft) => ({
        id: nft.mint,
        onClickItem: onClickShowDetail,
        onMakeLoan: () => onMakeLoan(nft),
        asset: {
          token_url: nft.data.uri,
          name: nft.data.name,
          is_fetch_url: true,
          authority: nft.updateAuthority,
          mint: nft.mint
        }
      }));
      setAssets(_nfts);
    } catch (e) {
      console.log('🚀 ~ file: index.js ~ line 32 ~ fetchNFTs ~ e', e);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;

  return (
    <div className={styles.listAssets}>
      <ListNft data={assets} />
    </div>
  );
};

export default ListAsset;
