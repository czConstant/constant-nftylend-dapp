import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import { MdMoreVert } from 'react-icons/md';
import { Box, Button, Flex, Grid, GridItem, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';

import CardNftMedia from 'src/views/apps/CardNftMedia';
import { APP_URL } from 'src/common/constants/url';
import Loading from 'src/common/components/loading';
import { getAssetInfo, verifyAsset } from 'src/modules/nftLend/api';
import { AssetNft } from 'src/modules/nftLend/models/nft';
import { LoanNft } from 'src/modules/nftLend/models/loan';
import styles from './styles.module.scss';

interface AssetDetailModalProps {
  asset: AssetNft;
  onClose: Function;
  navigate: Function;
  onMakeLoan?: Function;
};

const AssetDetailModal = (props: AssetDetailModalProps) => {
  const { asset, onClose, onMakeLoan } = props;

  const navigate = useNavigate();
  const [extraData, setExtraData] = useState(asset.detail || {});
  const [listingDetail, setListingDetail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loan, setLoan] = useState<LoanNft>();
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    if (asset.needFetchDetail()) getExtraData();
    // verifiedCollection();
    checkLoanInfo();
  }, [asset]);

  const verifiedCollection = async () => {
    try {
      setVerifying(true);
      const response = await verifyAsset({
        network: asset.chain,
        contract_address: asset.contract_address,
        token_id: asset.token_id
      });
      setListingDetail(response.result);
    } catch (error) {
    } finally {
      setVerifying(false);
    }
  };

  const checkLoanInfo = async () => {
    try {
      setVerifying(true);
      const res = await getAssetInfo(asset.contract_address, asset.token_id);
      const loan = LoanNft.parseFromApiDetail(res.result);
      setLoan(loan);
      setCollectionName(res.result.collection?.name);
    } catch (error) {
    } finally {
      setVerifying(false);
    }
  };

  const getExtraData = async () => {
    setLoading(true);
    try {
      const res = await asset.fetchDetail();
      setExtraData(res);
    } finally {
      setLoading(false);
    }
  };

  const onClickMakeLoan = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    if (onMakeLoan) onMakeLoan();
  }

  const onGoToLoan = () => {
    onClose();
    navigate(`${APP_URL.DETAIL_LOAN}/${loan?.seo_url}`);
  };

  const renderButton = () => {
    if (verifying) return <Loading />;
    if (loan?.isListing()) return (
      <Button onClick={onGoToLoan} colorScheme='brand.warning'>
        Go to loan
      </Button>
    );
    if (listingDetail) return (
      <Button w='100%' onClick={onClickMakeLoan}>
        Make a Loan
      </Button>
    );
    return (
      <Box className={styles.notVerified}>
        <Text variant='warning' fontSize='sm'>This NFT Collection is currently unavailable. We are working with the NFT community to whitelist quality projects to protect our investors.</Text>
      </Box>
    );
  };

  return (
    <Flex w={800}>
      <Box w='50%' maxW={400} mr={8}>
        <CardNftMedia
          name={asset.name}
          className={cx(extraData?.attributes?.length > 6 && styles.largeImage)}
          detail={extraData}
          loading={loading}
        />
      </Box>
      <Box flex={1}>
        <Text fontWeight='bold' fontSize='2xl'>{asset.name}</Text>
        <Text fontSize='sm'>{collectionName}</Text>
        {asset.creator && (
          <div>
            <a
              className={styles.infoCreator}
              target="_blank"
              href={asset.getLinkExplorer(asset.creator)}
            >
              Creators
            </a>{' '}
            ·{' '}
            <a
              target="_blank"
              href={asset.getLinkExplorer(asset.owner)}
            >
              Authority
            </a>
          </div>
        )}
        <Flex my={4}>
          <Box flex={1}>{renderButton()}</Box>
          <Menu autoSelect={false} placement='bottom-end'>
            <MenuButton border='none' bg='none' ml={4} w={8} h={8}>
              <Icon fontSize='4xl' as={MdMoreVert} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => window.open(asset.getLinkExplorer(), '_blank')}>
                View in explorer
              </MenuItem>
              <MenuItem onClick={() => window.open(asset.detail_uri, '_blank')}>
                View raw JSON
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Text fontSize='sm'>{extraData?.description}</Text>
        {extraData?.attributes?.length > 0 && (
          <Grid templateColumns='repeat(3, 1fr)' gap={2}>
            {extraData?.attributes?.map((att: any) => (
              <GridItem bgColor='background.darker' p={4} borderRadius={8} key={att?.trait_type}>
                <Text variant='attrLabel' fontSize='10px'>{att?.trait_type}</Text>
                <Text fontSize='xs'>{att?.value}</Text>
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </Flex>
  );
};

export default React.memo(AssetDetailModal);
