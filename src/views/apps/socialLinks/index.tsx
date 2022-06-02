import cx from 'classnames';

import IconTelegram from './img/ic_telegram.svg';
import IconDiscord from './img/ic_discord.svg';
import IconTwitter from './img/ic_twitter.svg';
import styles from './styles.module.scss';
import { DISCORD_URL, GITBOOK_URL, TWITTER_URL } from 'src/common/constants/url';

interface SocialLinksProps {
  layout?: 'vertical' | 'horizontal',
  iconSize?: number,
}

const links = [
  { id: 'discord', url: DISCORD_URL, icon: IconDiscord },
  { id: 'twitter', url: TWITTER_URL, icon: IconTwitter },
  { id: 'gitbook', url: GITBOOK_URL, icon: IconTelegram },
]

const SocialLinks = (props: SocialLinksProps) => {
  const { iconSize = 30, layout = 'horizontal' } = props;

  return (
    <div className={cx(styles.socialLinks, styles[layout])}>
      {links.map(e => (
        <a key={e.id} className={styles.item} target="_blank" href={e.url} >
          <img alt={e.id} src={e.icon} style={{ width: iconSize, height: iconSize, borderRadius: iconSize/2 }} />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;