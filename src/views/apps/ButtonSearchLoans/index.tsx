import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';

import IconSearch from './img/ic_search.svg';
import styles from './styles.module.scss';
import { APP_URL } from 'src/common/constants/url';

interface ButtonSearchLoansProps {
  className?: string;
}

const ButtonSearchLoans = (props: ButtonSearchLoansProps) => {
  const { className } = props;
  const navigate = useNavigate();

  const [value, setValue] = useState('');

  const onSearch = () => {
    navigate(`${APP_URL.LIST_LOAN}?search=${value}`)
  }

  return (
    <div className={cx(styles.buttonSearchLoans, className)}>
      <input
        value={value}
        placeholder='Search here...'
        onChange={e => setValue(e.target.value)}
        onKeyDown={(e) => e.keyCode === 13 && onSearch()}
      />
      <div onClick={onSearch}>
        <img alt="" src={IconSearch} />
      </div>
    </div>
  );
};

export default ButtonSearchLoans;