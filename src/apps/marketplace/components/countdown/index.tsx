import React from "react";

import useCountDownTimer from "../../hooks/useCountdown";
import icFire from "../../assets/images/ic_fire.svg";
import styles from "./styles.module.scss";

interface CountdownTimmerProps {
  date: string;
}

const CountdownTimmer: React.FC<CountdownTimmerProps> = ({ date }) => {
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(date);
  return (
    <div className={styles.container}>
      <img src={icFire} />
      <div>{`${days} : ${hours} : ${minutes} : ${seconds}`}</div>
    </div>
  );
};

export default CountdownTimmer;
