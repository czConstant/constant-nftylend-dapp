import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { motion } from 'framer-motion';

import Loading from "src/common/components/loading";
import Avatar from 'src/common/components/avatar';
import { formatCurrency } from 'src/common/utils/format';
import { getImageThumb } from 'src/modules/nftLend/utils';
import { getCollection } from 'src/modules/nftLend/api';

import IcVerified from './img/icon-verified.svg';
import IconViewContract from './img/ic_view_contract.svg';
import styles from "./styles.module.scss";
import SectionContainer from 'src/common/components/sectionContainer';
import { CollectionData } from 'src/modules/nftLend/models/api';

interface CollectionInfoProps {
  collection_seo: string;
}

const CollectionInfo = (props: CollectionInfoProps) => {
  const { collection_seo } = props;

  const [data, setData] = useState<CollectionData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection()
  }, [collection_seo])

  const fetchCollection = async () => {
    try {
      const res = await getCollection(collection_seo);
      setData(res?.result);
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className={styles.empty}><Loading /></div>;
  if (!data) return null;

  return (<>
    {data.cover_url ? <img className={styles.cover} alt='' src={data.cover_url} /> : <div className={styles.cover} />}
    <SectionContainer className={styles.wrapper}>
      <div className={styles.collectionInfo}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={styles.viewContract}>
          View Contract <img src={IconViewContract} />
        </motion.button>
        <Avatar className={styles.image}
          img={getImageThumb({ url: data.rand_asset?.token_url || '', width: 200, height: 200 })}
          name={data.rand_asset?.name}
          size={isMobile ? 80 : 200}
        />
        {/* <RandomAvatar loans={dataLoan} size={isMobile ? 150 : 300} /> */}
        <div className={styles.name}>{data?.name} {data.verified && <img src={IcVerified} />}</div>
        <div className={styles.author}>
          collection by <strong>{data.rand_asset?.contract_address}</strong>
        </div>
        <div className={styles.description}>{data.description}</div>
      </div>
      <hr />
      <div className={styles.collectionStats}>
        <div>
          <label>{data.total_listed}</label>
          <div>Listed Loans</div>
        </div>
        <div>
          <label>{data.total_listed}</label>
          <div>Floor Price</div>
        </div>
        <div>
          <label>${data.volume_usd}</label>
          <div>Loan Volume</div>
        </div>
        <div>
          <label>${data.total_listed}</label>
          <div>Average Loan</div>
        </div>
      </div>
    </SectionContainer>
  </>);
};

export default CollectionInfo;
