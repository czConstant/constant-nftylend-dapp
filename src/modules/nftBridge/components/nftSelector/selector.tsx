import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';

import { useAppSelector } from 'src/store/hooks';
import { selectNftBridge } from 'src/store/nftBridge';
import styles from './nftSelect.module.scss';


export interface NftItem {
  id: string;
  name: string;
}

export type OnSelectNft = (e: NftItem) => any;

interface SelectorProps {
  assets: Array<NftItem>;
  className?: string;
  onSelectNft: OnSelectNft;
}

export default function Selector(props: SelectorProps) {
  const { assets, className, onSelectNft } = props;
  const sourceNft = useAppSelector(selectNftBridge).sourceNft;

  const renderItem = (nft: NftItem) => {
    return (
      <div className={styles.chain}>
        <div>{nft.name} - {nft.id}</div>  
      </div>
    );
  };

  const onChange = (id: string | null) => {
    const item = assets.find(e => e.id === id);
    if (item) onSelectNft(item);
  }

  return (
    <div className={styles.nftSelect}>
      <Dropdown className={cx(styles.nftSelect, className)} onSelect={onChange}>
        <Dropdown.Toggle className={styles.toggle}>
          <span>{sourceNft ? renderItem(sourceNft) : 'Select NFT'}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles.dropdownMenu}>
          {assets.map(item => {
            return (
              <Dropdown.Item key={item.id} eventKey={item.id} className={styles.item}>
                {renderItem(item)}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
