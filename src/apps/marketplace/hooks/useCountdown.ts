import { padStart } from "lodash";
import React, { useEffect, useRef, useState } from "react";

const useCountDownTimer = (date: string) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [expired, setExpired] = useState(false);
  const [countDownDate, setCountDownDate] = useState(0);
  const timer = useRef();

  useEffect(() => {
    if (date) {
      setCountDownDate(new Date(date).getTime());
    }
  }, [date]);

  useEffect(() => {
    if (countDownDate >= 0) {
      timer.current = setInterval(getTimer, 1000);
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [countDownDate]);

  const getTimer = () => {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    setDays(padStart(days, 2, "0"));
    setHours(padStart(hours, 2, "0"));
    setMinutes(padStart(minutes, 2, "0"));
    setSeconds(padStart(seconds, 2, "0"));
    if (distance <= 0) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setExpired(true);
      clearInterval(timer.current);
    }
  };
  return [days, hours, minutes, seconds, expired];
};

export default useCountDownTimer;
