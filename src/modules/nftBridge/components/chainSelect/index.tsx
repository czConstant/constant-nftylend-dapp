import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';

import { ChainInfo } from '../../utils/constant';
import styles from './chainSelect.module.scss';

interface ChainSelectProps {
  chains: ChainInfo[];
  onChange: (e: ChainInfo) => any;
  value?: ChainInfo;
  className?: string;
  disabled?: boolean;
}

export default function ChainSelect(props: ChainSelectProps) {
  const { chains, value, className, disabled, onChange } = props;

  const renderChain = (chain: ChainInfo) => {
    return (
      <div className={styles.chain}>
        <img alt={chain.name} src={chain.logo} />
        <div>{chain.name}</div>  
      </div>
    );
  };

  return (
    <Dropdown className={cx(styles.chainSelect, className)} onSelect={onChange}>
      <Dropdown.Toggle className={styles.toggle} disabled={disabled}>
        <span>{value ? renderChain(value) : 'Select source chain'}</span>
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
