import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

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
import { useCurrentWallet } from '../../hooks/useCurrentWallet';

const ListAsset = () => {
  const dispatch = useAppDispatch();
  const needReload = useAppSelector(selectNftyLend).needReload;
  const { currentWallet, isConnected } = useCurrentWallet();
  const { getNftsByOwner } = useToken();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([] as Array<ItemNftProps>);

  useEffect(() => {
    if (isConnected) fetchNFTs();
  }, [currentWallet, needReload]);

  const onMakeLoan = async (nftToken?: AssetNft) => {
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
    try {
      const assets = await getNftsByOwner(currentWallet.address, currentWallet.chain);
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

  if (!isConnected) return <EmptyList dark labelText="Connect crypto wallet to view your assets" />;
  if (assets.length === 0) return (
    <div className={styles.noAssets}>
      <div>We can not detect your assets, but you can still manually create a loan</div>
      <Button className={styles.createButton} onClick={() => onMakeLoan(undefined)}>Create loan</Button>
    </div>
  );

  return (
    <div className={styles.listAssets}>
      <ListNft data={assets} />
    </div>
  );
};

export default ListAsset;
