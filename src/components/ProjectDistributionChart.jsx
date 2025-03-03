import { Paper, Box, Typography, useTheme } from '@mui/material'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

function ProjectDistributionChart({ timeEntries }) {
  const theme = useTheme()

  // Group entries by project
  const projectGroups = timeEntries.reduce((groups, entry) => {
    const projectName = entry.projectName || 'No Project'
    if (!groups[projectName]) {
      groups[projectName] = {
        totalDuration: 0,
        color: entry.projectColor || '#666666'
      }
    }
    groups[projectName].totalDuration += entry.duration
    return groups
  }, {})

  // Prepare data for pie chart
  const projectNames = Object.keys(projectGroups)
  const projectData = projectNames.map(name => {
    const hours = (projectGroups[name].totalDuration / 3600000).toFixed(2)
    return parseFloat(hours)
  })
  const projectColors = projectNames.map(name => projectGroups[name].color)

  const data = {
    labels: projectNames,
    datasets: [{
      data: projectData,
      backgroundColor: projectColors,
      borderColor: projectColors.map(color => color + '80'),
      borderWidth: 2,
      hoverOffset: 15,
      hoverBorderWidth: 0
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: 500
          },
          color: theme.palette.text.primary,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets
            return chart.data.labels.map((label, i) => {
              const value = datasets[0].data[i]
              const percentage = ((value / projectData.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
              return {
                text: `${label} (${value}h - ${percentage}%)`,
                fillStyle: projectColors[i],
                strokeStyle: projectColors[i],
                lineWidth: 0,
                hidden: false,
                index: i
              }
            })
          }
        }
      },
      tooltip: {
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: (context) => {
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: ${value}h (${percentage}%)`
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
        height: '460px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        transition: 'transform 0.2s, box-shadow 0.2s',
        overflow: 'hidden',
        borderRadius: 2,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        },
        display: 'flex',
        flexDirection: 'column'
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
        Project Distribution
      </Typography>
      <Box sx={{
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        '& canvas': {
          maxWidth: '90% !important',
          maxHeight: '85% !important'
        }
      }}>
        <Pie
          data={data}
          options={{
            ...options,
            maintainAspectRatio: false,
            responsive: true
          }}
        />
      </Box>
    </Paper>
  )
}

export default ProjectDistributionChart
