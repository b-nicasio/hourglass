import { Paper, Box, Typography, useTheme } from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { format } from 'date-fns'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function DailyHoursChart({ timeEntries }) {
  const theme = useTheme()

  // Group entries by date and calculate total hours
  const dailyHours = timeEntries.reduce((acc, entry) => {
    const date = format(new Date(entry.timeInterval.start), 'MMM d')
    if (!acc[date]) {
      acc[date] = {
        hours: 0,
        details: []
      }
    }
    const hours = entry.duration / 3600000
    acc[date].hours += hours
    acc[date].details.push({
      project: entry.projectName || 'No Project',
      description: entry.description || 'No Description',
      hours: hours.toFixed(2)
    })
    return acc
  }, {})

  // Sort dates and prepare data for the chart
  const sortedDates = Object.keys(dailyHours).sort((a, b) =>
    new Date(a) - new Date(b)
  )

  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Hours Worked',
        data: sortedDates.map(date => Number(dailyHours[date].hours.toFixed(2))),
        backgroundColor: theme.palette.primary.main + '80',
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: theme.palette.primary.dark + '90',
        hoverBorderColor: theme.palette.primary.dark,
        hoverBorderWidth: 2,
        barThickness: 'flex',
        maxBarThickness: 50
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            const date = tooltipItems[0].label
            const hours = tooltipItems[0].parsed.y
            return [`${date} - ${hours} hours`, '']
          },
          label: (context) => {
            const date = context.label
            const details = dailyHours[date].details
            return details.map(entry =>
              `${entry.project}: ${entry.hours}h - ${entry.description}`
            )
          },
          labelTextColor: () => theme.palette.text.secondary
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          padding: 8,
          font: {
            size: 14
          },
          callback: (value) => `${value}h`
        },
        title: {
          display: true,
          text: 'Hours',
          color: theme.palette.text.secondary,
          font: {
            size: 16,
            weight: 500
          },
          padding: { bottom: 12 }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          padding: 8,
          font: {
            size: 14
          }
        }
      }
    }
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        height: '450px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontSize: '1.25rem'
        }}
      >
        Daily Hours Distribution
      </Typography>
      <Box sx={{ height: 'calc(100% - 40px)' }}>
        <Bar data={data} options={options} />
      </Box>
    </Paper>
  )
}

export default DailyHoursChart
