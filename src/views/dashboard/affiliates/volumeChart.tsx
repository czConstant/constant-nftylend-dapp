import { Box } from '@chakra-ui/react'
import ReactApexChart from 'react-apexcharts'

const VolumeChart = () => {
  const series = [{
    name: 'Net Profit',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
  }, {
    name: 'Revenue',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
  }, {
    name: 'Free Cash Flow',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
  }]

  const options = {
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
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      labels: {
        style: {
          colors: '#FCFCFD'
        }
      }
    },
    yaxis: {
      title: {
        text: '$ (thousands)'
      },
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
          return "$ " + val + " thousands"
        }
      }
    }
  }

  return (
    <Box id='chart'>
      <ReactApexChart options={options} series={series} type='bar' height={400} />
    </Box>
  )
}

export default VolumeChart