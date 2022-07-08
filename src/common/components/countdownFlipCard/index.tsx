import React, { useRef } from 'react'
import cx from 'classnames'

import styles from './styles.module.scss'

const AnimatedCard = ({ animation, digit }) => {
  return (
    <div className={cx(styles.flipCard, animation)}>
      <span>{digit}</span>
    </div>
  )
}

const StaticCard = ({ position, digit }) => {
  return (
    <div className={position}>
      <span>{digit}</span>
    </div>
  )
}

interface CountdownFlipCardInterface {
  digit: string
  width?: number
  height?: number
}

const CountdownFlipCard = (props: CountdownFlipCardInterface) => {
  const { digit, width = 40, height = 50 } = props
  const lastDigitRef = useRef('0')
  const shuffleRef = useRef(false)
  
  if (digit !== lastDigitRef.current) {
    lastDigitRef.current = digit
    shuffleRef.current = !shuffleRef.current
  }

  const shuffle = shuffleRef.current
  let currentDigit = digit
  let previousDigit = digit === '9' ? 0 : Number(digit) + 1

  // shuffle digits
  const digit1 = shuffle ? previousDigit : currentDigit
  const digit2 = !shuffle ? previousDigit : currentDigit
  // shuffle animations
  const animation1 = shuffle ? styles.fold : styles.unfold
  const animation2 = !shuffle ? styles.fold : styles.unfold

  return (
    <div className={styles.flipContainer} style={{ width, height }}>
      <StaticCard position={styles.upperCard} digit={currentDigit} />
      <StaticCard position={styles.lowerCard} digit={previousDigit} />
      <AnimatedCard digit={digit1} animation={animation1} />
      <AnimatedCard digit={digit2} animation={animation2} />
    </div>
  )
}

export default CountdownFlipCard
