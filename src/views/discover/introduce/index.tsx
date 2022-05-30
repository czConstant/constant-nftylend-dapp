import BodyContainer from 'src/common/components/bodyContainer';

import styles from './introduce.module.scss';

const examples = [
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/d5c12b4eb46e676d72569a2084345c94/6ef0628f',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/dcs_pfp_1650520191170.png',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://i.imgur.com/fO3tI1t.png',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/smokeheads_pfp_1652898735936.png',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/puppies_pfp_1653869027436.png',
  'https://img-cdn.magiceden.dev/rs:fill:320:320:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/483970a827af847e0b031c7d90d70baf/6cc644f1',
]

const Introduce = props => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.introduce}>
        <div className={styles.left}>
          <h1>
            Create, Explore<br/>
            & Collect Digital<br/>
            Art NFTs
          </h1>
          <p>Buy and sell NETs from the world's artists. More than 1000 premium digital artworks are aviable to be your's</p>
          <button>Start Collecting</button>
        </div>
        <div className={styles.right}>
          <div className={styles.imageRow}>
            {examples.slice(0, 3).map(e => <img alt="" src={e} />)}
          </div>
          <div className={styles.imageRow}>
            {examples.slice(3, 6).map(e => <img alt="" src={e} />)}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Introduce;