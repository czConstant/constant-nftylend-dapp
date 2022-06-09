import { useState, useEffect } from "react";
import cx from "classnames";
import { isMobile } from "react-device-detect";
import { Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { FaCaretDown } from 'react-icons/fa';

import { selectNftyLend } from "src/store/nftyLend";
import { useAppSelector } from "src/store/hooks";
import EmptyList from "src/common/components/emptyList";
import Loading from "src/common/components/loading";
import { getLoansByOwner } from "src/modules/nftLend/api";
import { LoanNft } from 'src/modules/nftLend/models/loan';
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet';
import { LOAN_STATUS } from 'src/modules/nftLend/constant';

import Item from "./item";
import styles from "./styles.module.scss";

const ListLoan = () => {
  const needReload = useAppSelector(selectNftyLend).needReload;
  const { currentWallet, isConnected } = useCurrentWallet();

  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<Array<LoanNft>>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (isConnected) fetchNFTs();
  }, [isConnected, status, needReload]);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const res = await getLoansByOwner({
        owner: currentWallet.address.toString(),
        network: currentWallet.chain.toString(),
        status,
      });
      setLoans(res.result.map(LoanNft.parseFromApi));
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected)
    return (
      <EmptyList dark labelText="Connect crypto wallet to view your assets" />
    );

  return (
    <div className={cx(isMobile && styles.mobileWrap, styles.wrapper)}>
      <Menu>
        <MenuButton mt={4} className={styles.menuButton}>
          <Flex alignItems='center' justifyContent='space-between' pl={4} pr={2}>
            <Text>{status.toUpperCase() || 'ALL'}</Text>
            <Icon fontSize='xl' as={FaCaretDown} />
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setStatus('')}>All</MenuItem>
          {Object.values(LOAN_STATUS).map(v => (
            <MenuItem key={v.id} onClick={() => setStatus(v.id)}>{v.name}</MenuItem>
          ))}
        </MenuList>
      </Menu>
      <div className={styles.table}>
        <div className={cx(styles.header, styles.row)}>
          <div>AssetName</div>
          <div>Amount</div>
          <div>Duration / Interest</div>
          {/* <div>Interest</div> */}
          <div>Status</div>
          {/* <div>TxHash</div> */}
          <div>Created At</div>
          <div>Action</div>
        </div>
        {!loading && loans?.length === 0 && (
          <EmptyList dark labelText="There is no loan" />
        )}
        {!loading && loans.map((e: LoanNft) => <Item key={e.id} loan={e} />)}
      </div>
      {loading && <Loading className={styles.loading} />}
    </div>
  );
};

export default ListLoan;
