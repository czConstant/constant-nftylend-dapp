import { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';

interface CountdownText {
  to: string | Date;
  label?: string;
  endText?: string;
  hideWhenEnd?: boolean;
}

const CountdownText = (props: CountdownText) => {
  const { label, endText, hideWhenEnd, to } = props;
  const [text, setText] = useState<string>('');
  const [isEnd, setIsEnd] = useState(false);
  const interval = useRef<any>(null);

  useEffect(() => {
    if (!moment(to).isValid()) return;
    interval.current = setInterval(() => {
      let second = moment(to).diff(moment(), 's');
      if (second < 0) {
        clearInterval(interval.current);
        setIsEnd(true);
        setText(endText || 'Ended');
        return null;
      }
      const day = Math.floor(second / 86400);
      second = second % 86400;
      const hour = Math.floor(second / 3600);
      second = second % 3600;
      const minute = Math.floor(second / 60);
      second = second % 60;
      setText(`${day}d ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`);
    }, 1000);
    return () => {
      clearInterval(interval.current);
      interval.current = null;
    }
  }, []);

  if (isEnd) {
    if (hideWhenEnd) return null;
    return <span>{endText || 'Ended'}</span> 
  }

  return !text ? null : (
    <span>{label} <strong>{text}</strong></span>
  );
}

export default CountdownText;