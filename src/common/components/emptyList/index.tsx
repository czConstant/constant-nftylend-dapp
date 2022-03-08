import React from 'react';
import cx from 'classnames';

import noRecord from './img_list_empty.svg';
import noRecordDark from './img_list_empty_dark.svg';

import styles from './styles.module.scss';

interface EmptyListProps {
  className?: string;
  link?: string;
  label?: string;
  labelText?: React.ReactNode;
  type?: string;
  dark?: boolean;
};

const EmptyList = (props: EmptyListProps) => {
  const { className, labelText = 'There is no data', dark = false } = props;

  return (
    <div className={cx(className, styles.emptyList)}>
      <img alt="" src={dark ? noRecordDark : noRecord} />
      {labelText}
    </div>
  );
};

export default EmptyList;
