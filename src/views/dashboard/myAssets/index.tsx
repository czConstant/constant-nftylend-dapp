import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import { Button, Center, Flex, Icon, Input, InputGroup, InputRightElement, Switch } from '@chakra-ui/react';
import { RiCloseCircleFill } from 'react-icons/ri';

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
import Pagination from 'src/common/components/pagination';

import styles from './styles.module.scss';
import { getNearWhitelistCollections } from 'src/modules/nftLend/api';
import { WhitelistCollectionData } from 'src/modules/nftLend/models/api';
import { NEAR_PARAS_CREATOR } from 'src/modules/near/utils';

const PAGE_SIZE = 12;

const MyAssets = () => {
  const dispatch = useAppDispatch();
  const needReload = useAppSelector(selectNftyLend).needReload;
  const { isConnected } = useCurrentWallet();
  const { getNftsByOwner } = useToken();

  const navigate = useNavigate();

  const [wlCollections, setWlCollections] = useState<Map<string, WhitelistCollectionData>>(new Map())
  const [loading, setLoading] = useState(true)
  const [assets, setAssets] = useState<Array<CardNftLoanProps>>([])
  const [filterAssets, setFilterAssets] = useState<Array<CardNftLoanProps>>([])
  const [displayAssets, setDisplayAssets] = useState<Array<CardNftLoanProps>>([])
  const [page, setPage] = useState(1)
  const [onlyWhitelist, setOnlyWhitelist] = useState(false)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    getNearWhitelistCollections().then(res => {
      let map = new Map()
      res.result.forEach((e: WhitelistCollectionData) => {
        if (e.creator === NEAR_PARAS_CREATOR && e.token_series_id) {
          map.set(e.token_series_id.split(':')[0], e)
          return
        }
        map.set(e.creator, e)
      })
      setWlCollections(map)
    })
  }, [])

  useEffect(() => {
    if (isConnected && wlCollections.size > 0) fetchNFTs();
  }, [isConnected, needReload, wlCollections]);

  useEffect(() => {
    const list = assets.filter(e => {
      if (onlyWhitelist && !isWhiltelist(e.asset)) return false
      if (!!searchText && !e.asset.name.toLowerCase().includes(searchText.toLowerCase())) return false
      return true
    })
    setFilterAssets(list)
    setPage(1)
  }, [assets, onlyWhitelist, searchText, wlCollections])

  useEffect(() => {
    setDisplayAssets(filterAssets.slice((page-1) * PAGE_SIZE, (page-1) * PAGE_SIZE + PAGE_SIZE))
  }, [page, filterAssets])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [displayAssets])

  const onMakeLoan = async (nftToken?: AssetNft) => {
    const close = () => dispatch(closeModal({ id: 'createLoanModal' }));
    dispatch(openModal({
      id: 'createLoanModal',
      modalProps: { size: 'xl' },
      render: () => <CreateLoan asset={nftToken} onClose={close} />,
      theme: 'dark',
      title: 'Create Loan'
    }));
  };

  const onClickShowDetail = (asset: AssetNft) => {
    const close = () => dispatch(closeModal({ id: 'detailLoanModal' }));
    return dispatch(openModal({
      id: 'detailLoanModal',
      modalProps: { size: 'xl' },
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
      const assets = await getNftsByOwner();
      assets.sort((a, b) => {
        if (!isWhiltelist(a) && isWhiltelist(b)) return 
        return -1
      })
      setAssets(assets.map(e => ({
        asset: e,
        onClickItem: onClickShowDetail,
        onMakeLoan: () => onMakeLoan(e),
      })));
    } finally {
      setLoading(false);
    }
  };

  const isWhiltelist = (asset: AssetNft) => {
    if (asset.contract_address === NEAR_PARAS_CREATOR) {
      const creator = asset.token_id.split(':')[0]
      return wlCollections.has(creator)
    } else return wlCollections.has(asset.contract_address)
  }

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
      <Flex alignItems='center' justifyContent='space-between' p={4} bgColor='black' className={styles.toolbar}>
        <Flex alignItems='center' gap={4}>
          <InputGroup w={300} borderColor='background.border' borderWidth={2} borderRadius={30}>
            <Input
              border='none'
              placeholder="Search for NFT's name"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            {!!searchText && <InputRightElement children={<Icon fontSize='lg' cursor='pointer' color='text.secondary' as={RiCloseCircleFill} onClick={() => setSearchText('')} />} />}
          </InputGroup>
          <Switch onChange={e => setOnlyWhitelist(e.target.checked)}>Show whitelisted only</Switch>
        </Flex>
        <Pagination total={filterAssets.length} page={page} pageSize={PAGE_SIZE} onChangePage={setPage} />
      </Flex>
      {displayAssets.length === 0 && <Center h={400}><EmptyList /></Center>}
      <div className={cx(isMobile && styles.wrapMobile, styles.list)}>
        {displayAssets.map(e => (
          <CardNftLoan
            key={e.asset.id + e.asset.token_id + e.asset.contract_address}
            asset={e.asset}
            loan={e.loan}
            isWhitelist={isWhiltelist(e.asset)}
            onClickItem={e.onClickItem}
            onCancelLoan={e.onCancelLoan}
            onViewLoan={e.onViewLoan}
          />
        ))}
      </div>
      {displayAssets.length > 0 && (
        <Flex justifyContent='flex-end'>
          <Pagination total={filterAssets.length} page={page} pageSize={PAGE_SIZE} onChangePage={setPage} />
        </Flex>
      )}
    </div>
  );
};

export default MyAssets;
