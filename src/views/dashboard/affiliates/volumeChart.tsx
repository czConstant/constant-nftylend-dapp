import { Box } from '@chakra-ui/react'
import moment from 'moment-timezone'
import { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

import { getAffiliateVolumes } from 'src/modules/nftLend/api'
import { useCurrentWallet } from 'src/modules/nftLend/hooks/useCurrentWallet'

const VolumeChart = () => {
  const { currentWallet } = useCurrentWallet()

  const [volume, setVolume] = useState<Array<any>>([])

  useEffect(() => {
    getAffiliateVolumes({
      address: 'hieuq.testnet',
      network: currentWallet.chain,
      limit: 12,
      rpt_by: 'week',
    }).then(res => {
      setVolume(res.result.reverse())
    })
  }, [currentWallet])

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
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: volume.map(e => moment(e.rpt_date).format('DD-MM')),
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
      <ReactApexChart options={options} series={series} type='bar' height={400} />
    </Box>
  )
}

export default VolumeChart