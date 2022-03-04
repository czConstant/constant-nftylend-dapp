import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';

import { useAppSelector } from 'src/store/hooks';
import { selectNftBridge } from 'src/store/nftBridge';
import { ChainInfo } from '../../constant';
import styles from './chainSelect.module.scss';

interface ChainSelectProps {
  chains: ChainInfo[];
  className?: string;
  onSelectChain: Function;
}

export default function ChainSelect(props: ChainSelectProps) {
  const { chains, className, onSelectChain } = props;
  const sourceChain = useAppSelector(selectNftBridge).sourceChain;

  const renderChain = (chain: ChainInfo) => {
    return (
      <div className={styles.chain}>
        <img alt={chain.name} src={chain.logo} />
        <div>{chain.name}</div>  
      </div>
    );
  };

  return (
    <Dropdown className={cx(styles.chainSelect, className)} onSelect={onSelectChain}>
      <Dropdown.Toggle className={styles.toggle}>
        <span>{sourceChain ? renderChain(sourceChain) : 'Select source chain'}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className={styles.dropdownMenu}>
        {chains.map(chain => {
          return (
            <Dropdown.Item key={chain.id} eventKey={chain.id} className={styles.item}>
              {renderChain(chain)}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
