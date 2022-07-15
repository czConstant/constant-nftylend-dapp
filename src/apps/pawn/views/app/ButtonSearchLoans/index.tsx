import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  const [isExpand, setIsExpand] = useState(false);
  const outerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (outerRef.current && !outerRef.current.contains(e.target)) {
        setIsExpand(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [outerRef]);

  const onSearch = () => {
    if (!isExpand) setIsExpand(true);
    else if (value) navigate(`${APP_URL.LIST_LOAN}?search=${value}`)
  }

  return (
    <div ref={outerRef} className={cx(styles.buttonSearchLoans, className)}>
      <motion.input
        value={value}
        animate={{ width: isExpand ? 300 : 0, marginLeft: isExpand ? 15 :0 }}
        placeholder='Search listing loans here...'
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