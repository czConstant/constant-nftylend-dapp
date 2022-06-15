import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { motion } from 'framer-motion';
import { Flex, Image, Text } from '@chakra-ui/react';

import Loading from "src/common/components/loading";
import Avatar from 'src/common/components/avatar';
import { getImageThumb, convertIpfsToHttp } from 'src/modules/nftLend/utils';
import { getCollection } from 'src/modules/nftLend/api';
import SectionContainer from 'src/common/components/sectionContainer';
import { CollectionData } from 'src/modules/nftLend/models/api';
import { getLinkNearExplorer } from 'src/modules/near/utils';

import IcVerified from './img/icon-verified.svg';
import IconViewContract from './img/ic_view_contract.svg';
import IconDiscord from './img/ic_discord.svg';
import IconTwitter from './img/ic_twitter.svg';
import IconWebsite from './img/ic_website.svg';
import styles from "./styles.module.scss";

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
    {data.cover_url ? <Image objectFit='cover' className={styles.cover} alt='' src={getImageThumb({ url: convertIpfsToHttp(data.cover_url) || '', showOriginal: true })} /> : <div className={styles.cover} />}
    <SectionContainer className={styles.wrapper}>
      <div className={styles.collectionInfo}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={styles.viewContract} onClick={() => window.open(getLinkNearExplorer(data.new_loan?.asset?.contract_address), '_blank')}>
          <Flex>
            <Text mr={1}>View Contract</Text>
            <Image src={IconViewContract} />
          </Flex>
        </motion.button>
        <Avatar className={styles.image}
          img={getImageThumb({ url: data.new_loan?.asset?.token_url || '', width: 200, height: 200 })}
          name={data.new_loan?.asset?.name}
          size={isMobile ? 80 : 200}
        />
        {/* <RandomAvatar loans={dataLoan} size={isMobile ? 150 : 300} /> */}
        <Flex alignItems='center' mt={8}>
          <Text fontWeight='bold' fontSize='3xl'>{data?.name}</Text>
          {data.verified && <Image w={30} h={30} ml={4} src={IcVerified} />}
        </Flex>
        <div className={styles.author}>
          collection by <strong>{data.new_loan?.asset?.contract_address}</strong>
        </div>
        <div className={styles.description}>{data.description}</div>
        <div className={styles.socials}>
          {data.discord_url && <a href={data.discord_url} target='_blank'><img alt='' src={IconDiscord} /></a>}
          {data.twitter_id && <a href={`https://twitter.com/${data.twitter_id}`} target='_blank'><img alt='' src={IconTwitter} /></a>}
          {data.creator_url && <a href={data.creator_url} target='_blank'><img alt='' src={IconWebsite} /></a>}
        </div>
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
