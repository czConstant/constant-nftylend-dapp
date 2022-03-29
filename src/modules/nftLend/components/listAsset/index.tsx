import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { useNavigate } from 'react-router-dom';

import EmptyList from 'src/common/components/emptyList';
import { closeModal, openModal } from 'src/store/modal';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

import ListNft from '../listNft';
import styles from './styles.module.scss';
import AssetDetailModal from 'src/modules/nftLend/components/assetDetailModal';
import CreateLoan from '../createLoan';
import { selectNftyLend } from 'src/store/nftyLend';
import { ItemNftProps } from '../itemNft';
import { AssetNft } from '../../models/nft';
import { useToken } from '../../hooks/useToken';

const ListAsset = () => {
  const dispatch = useAppDispatch();
  const needReload = useAppSelector(selectNftyLend).needReload;
  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;
    const { getNftsByOwner } = useToken();

  const { connection } = useConnection();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([] as Array<ItemNftProps>);

  useEffect(() => {
    if (walletAddress) fetchNFTs();
  }, [walletAddress, needReload]);

  const onMakeLoan = async (nftToken: AssetNft) => {
    const close = () => dispatch(closeModal({ id: 'createLoanModal' }));
    dispatch(openModal({
      id: 'createLoanModal',
      modalProps: { centered: true, backdrop: 'static' },
      render: () => <CreateLoan asset={nftToken} onClose={close} />,
      theme: 'dark',
      title: 'Create Loan'
    }));
  };

  const onClickShowDetail = (asset: AssetNft) => {
    const close = () => dispatch(closeModal({ id: 'detailLoanModal' }));
    return dispatch(openModal({
      id: 'detailLoanModal',
      modalProps: { centered: true, size: 'lg' },
      render: () => (
        <AssetDetailModal
          onClose={close}
          asset={asset}
          navigate={navigate}
          onMakeLoan={() => onMakeLoan(asset)}
        />
      ),
      theme: 'dark'
    }));
  };

  const fetchNFTs = async () => {
    if (!walletAddress) return;
    try {
      const assets = await getNftsByOwner('0x088D8A4a03266870EDcbbbADdA3F475f404dB9B2', walletChain);
      setAssets(assets.map(e => ({
        asset: e,
        onClickItem: onClickShowDetail,
        onMakeLoan: () => onMakeLoan(e),
      })));

    } catch (e) {
      console.log('🚀 ~ file: index.js ~ line 32 ~ fetchNFTs ~ e', e);
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;

  return (
    <div className={styles.listAssets}>
      <ListNft data={assets} />
    </div>
  );
};

export default ListAsset;
