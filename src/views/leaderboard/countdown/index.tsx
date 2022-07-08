import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import moment from 'moment-timezone'

import CountdownFlipCard from 'src/common/components/countdownFlipCard'

const Countdown = () => {
  const [second, setSecond] = useState<number>(0)
  const [minute, setMinute] = useState<number>(0)
  const [hour, setHour] = useState<number>(0)
  const [day, setDay] = useState<number>(0)
  const interval = useRef<any>()

  useEffect(() => {
    interval.current = setInterval(() => extractDuration(), 1000)
    return () => {
      clearInterval(interval.current)
      interval.current = null
    }
  }, [])

  const extractDuration = () => {
    let duration = moment().endOf('M').diff(moment(), 's')
    setDay(Math.floor(duration / 86400))
    duration = duration % 86400
    setHour(Math.floor(duration / 3600))
    duration = duration % 3600
    setMinute(Math.floor(duration / 60))
    duration = duration % 60
    setSecond(duration)
  }

  return (
    <Box bgColor='background.darker' p={4} borderRadius={16}>
      <Flex alignItems='center' gap={2}>
        <Flex h='100%' fontSize='3xl' gap={1}>
          <CountdownFlipCard digit={String(day).padStart(2, '0')[0]} width={32} height={40} />
          <CountdownFlipCard digit={String(day).padStart(2, '0')[1]} width={32} height={40} />
        </Flex>
        <Text fontSize='xl' fontWeight='medium' mr={4}>days</Text>
        <Flex h='100%' fontSize='3xl' gap={1}>
          <CountdownFlipCard digit={String(hour).padStart(2, '0')[0]} width={32} height={40} />
          <CountdownFlipCard digit={String(hour).padStart(2, '0')[1]} width={32} height={40} />
        </Flex>
        <Text fontSize='xl' fontWeight='medium'>:</Text>
        <Flex h='100%' fontSize='3xl' gap={1}>
          <CountdownFlipCard digit={String(minute).padStart(2, '0')[0]} width={32} height={40} />
          <CountdownFlipCard digit={String(minute).padStart(2, '0')[1]} width={32} height={40} />
        </Flex>
        <Text fontSize='xl' fontWeight='medium'>:</Text>
        <Flex h='100%' fontSize='3xl' gap={1}>
          <CountdownFlipCard digit={String(second).padStart(2, '0')[0]} width={32} height={40} />
          <CountdownFlipCard digit={String(second).padStart(2, '0')[1]} width={32} height={40} />
        </Flex>
      </Flex>
    </Box>
  )
}

export default Countdown