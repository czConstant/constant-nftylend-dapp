import { useEffect, useMemo, useState } from 'react'
import moment from 'moment-timezone'
import ReactApexChart from 'react-apexcharts'
import { Box, Button, Flex } from '@chakra-ui/react'

import { getAffiliateVolumes } from 'src/modules/nftLend/api'
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet'

const VolumeChart = () => {
  const { currentWallet } = useCurrentWallet()

  const [volume, setVolume] = useState<Array<any>>([])
  const [filter, setFilter] = useState<string>('week')

  useEffect(() => {
    getAffiliateVolumes({
      address: currentWallet.address,
      network: currentWallet.chain,
      limit: 12,
      rpt_by: filter,
    }).then(res => {
      setVolume(res.result.reverse())
    })
  }, [currentWallet, filter])

  const series = useMemo(() => [{
    name: 'NEAR Volume',
    data: volume.map(e => Number(e.total_commissions)),
  }], [volume])

  const options = useMemo(() => ({
    chart: {
      toolbar: { show: false },
    },
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 12,
      colors: ['transparent']
    },
    xaxis: {
      categories: volume.map(e => moment(e.rpt_date).format(filter === 'week' ? 'DD-MM' : 'MM-YYYY')),
      labels: {
        style: {
          colors: '#FCFCFD'
        }
      }
    },
    colors: ['#6a1cfd'],
    yaxis: {
      labels: {
        style: {
          colors: '#FCFCFD'
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return `${val} NEAR`
        }
      }
    }
  }), [volume]);

  return (
    <Box id='chart'>
      <Flex gap={4} justifyContent='flex-end'>
        <Button fontSize='sm' opacity={filter === 'week' ? 1 : 0.5} variant='link' color='text.primary' onClick={() => setFilter('week')}>WEEK</Button>
        <Button fontSize='sm' opacity={filter === 'month' ? 1 : 0.5} variant='link' color='text.primary' onClick={() => setFilter('month')}>MONTH</Button>
      </Flex>
      <ReactApexChart options={options} series={series} type='bar' height={400} />
    </Box>
  )
}

export default VolumeChart