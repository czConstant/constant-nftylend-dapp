import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Pagination } from 'react-bootstrap';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';

import EmptyList from 'src/common/components/emptyList';
import { closeModal, openModal } from 'src/store/modal';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import AssetDetailModal from 'src/views/myAssets/assetDetailModal';
import { selectNftyLend } from 'src/store/nftyLend';
import CardNftLoan, { CardNftLoanProps } from 'src/views/apps/CardNftLoan';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { useToken } from 'src/modules/nftLend/hooks/useToken';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import CreateLoan from 'src/views/myAssets/createLoan';
import LoadingList from 'src/views/apps/loadingList';

import styles from './styles.module.scss';

const PAGE_SIZE = 12;

const ListAsset = () => {
  const dispatch = useAppDispatch();
  const needReload = useAppSelector(selectNftyLend).needReload;
  const { currentWallet, isConnected } = useCurrentWallet();
  const { getNftsByOwner } = useToken();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Array<CardNftLoanProps>>([]);
  const [displayAssets, setDisplayAssets] = useState<Array<CardNftLoanProps>>([]);
  const [page, setPage] = useState(0);
  const [listPage, setListPage] = useState<Array<number>>([]);

  useEffect(() => {
    if (isConnected) fetchNFTs();
  }, [currentWallet, needReload]);

  useEffect(() => {
    const totalPage = Math.ceil(assets.length / PAGE_SIZE)
    setListPage([...Array(totalPage).keys()])
  }, [assets, page]);

  useEffect(() => {
    setDisplayAssets(assets.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE))
    window.scrollTo(0, 0);
  }, [listPage, page])

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
  if (loading) return <div className={styles.listAssets}><LoadingList /></div>

  if (assets.length === 0) return (
    <div className={styles.noAssets}>
      <div>We can not detect your assets, but you can still manually create a loan</div>
      <Button className={styles.createButton} onClick={() => onMakeLoan(undefined)}>Create loan</Button>
    </div>
  );

  return (
    <div className={cx(isMobile && styles.listAssetsMobile, styles.wrapper)}>
      <div className={cx(isMobile && styles.wrapMobile, styles.list)}>
        {displayAssets.map(e => (
          <CardNftLoan
            key={e.asset.id + e.asset.token_id + e.asset.contract_address}
            asset={e.asset}
            loan={e.loan}
            onClickItem={e.onClickItem}
            onCancelLoan={e.onCancelLoan}
            onViewLoan={e.onViewLoan}
          />
        ))}
      </div>
      {listPage.length > 1 && (
        <div className={styles.pagination}>
          <Pagination>
            {listPage.map(p => (
              <Pagination.Item
                key={p}
                className={cx(p === page && styles.active)}
                onClick={() => setPage(p)}
              >
                {p+1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ListAsset;