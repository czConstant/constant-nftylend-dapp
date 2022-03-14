import { memo } from 'react';
import cx from 'classnames';
import styles from './styles.module.scss';

interface CryptoDropdownItemProps {
  icon?: string,
  name: string,
  symbol: string,
  network?: string,
  balance?: number,
  className?: string,
}

const CryptoDropdownItem = (props: CryptoDropdownItemProps) => {
  const { name, symbol, balance, network, icon, className } = props;

  return (
    <div className={cx(styles.wrapper, !!balance && styles.haveBalance, className)}>
      <div>
        <img alt="" src={icon} className={styles.icon} />
        {name ? <>{name} <span className={styles.symbol}>{symbol}</span></> : symbol}
        {/* <span className={styles.network}>{network}</span> */}
      </div>
      {!!balance && (
        <div className={styles.balance}>{balance}</div>
      )}
    </div>
  );
};

export default memo(CryptoDropdownItem);