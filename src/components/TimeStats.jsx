import React from 'react'
import { Paper, Grid, Typography, Box, IconButton, Tooltip, useTheme } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import WorkIcon from '@mui/icons-material/Work'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AssessmentIcon from '@mui/icons-material/Assessment'

function StatCard({ title, value, icon, warning, status, onCopy }) {
  const theme = useTheme();

  // Determine status colors with gradients
  const statusGradient = status ?
    status === 'above' ? 'linear-gradient(90deg, #2e7d32 0%, #4caf50 100%)' :
    status === 'below' ? 'linear-gradient(90deg, #d32f2f 0%, #f44336 100%)' :
    'none' : 'none';

  const statusColor = status ?
    status === 'above' ? '#2e7d32' :
    status === 'below' ? '#d32f2f' :
    'transparent' : 'transparent';

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderLeft: status ? `4px solid ${statusColor}` : 'none',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[3],
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          opacity: 0.05,
          background: 'radial-gradient(circle, rgba(25,118,210,0.4) 0%, rgba(25,118,210,0) 70%)',
          zIndex: 0,
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            mr: 1.5,
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.primary.main
          }}>
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
        {onCopy && (
          <Tooltip title="Copy value">
            <IconButton
              size="small"
              onClick={onCopy}
              sx={{
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                }
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Typography
        variant="h5"
        component="div"
        sx={{
          fontWeight: 600,
          position: 'relative',
          zIndex: 1,
          color: status ? statusColor : theme.palette.text.primary
        }}
      >
        {value}
      </Typography>

      {warning && (
        <Typography
          variant="caption"
          sx={{
            color: statusColor,
            mt: 0.5,
            fontWeight: 500,
            position: 'relative',
            zIndex: 1
          }}
        >
          {warning}
        </Typography>
      )}
    </Paper>
  )
}

function TimeStats({ timeEntries, expectedHours, profile }) {
  const theme = useTheme();

  const calculateStats = () => {
    if (!timeEntries.length) return {
      totalHours: 0,
      averageHoursPerDay: 0,
      totalDays: 0,
      uniqueProjects: 0,
      earningsUSD: 0,
      earningsDOP: 0
    }

    const totalMilliseconds = timeEntries.reduce((total, entry) => {
      return total + entry.duration
    }, 0)

    const totalHours = totalMilliseconds / 3600000

    // Get unique dates
    const uniqueDates = new Set(
      timeEntries.map(entry =>
        new Date(entry.timeInterval.start).toISOString().split('T')[0]
      )
    )

    // Get unique projects
    const uniqueProjects = new Set(
      timeEntries.map(entry => entry.projectName).filter(Boolean)
    )

    // Calculate earnings if profile exists
    const earningsUSD = profile?.hourlyRate ? totalHours * profile.hourlyRate : 0
    const earningsDOP = profile?.usdToDopRate ? earningsUSD * profile.usdToDopRate : 0

    return {
      totalHours: totalHours.toFixed(2),
      averageHoursPerDay: (totalHours / uniqueDates.size).toFixed(2),
      totalDays: uniqueDates.size,
      uniqueProjects: uniqueProjects.size,
      earningsUSD: earningsUSD.toFixed(2),
      earningsDOP: earningsDOP.toFixed(2)
    }
  }

  const stats = calculateStats()
  const totalHours = parseFloat(stats.totalHours)

  let hoursStatus = null
  let hoursWarning = null

  if (expectedHours) {
    if (totalHours < expectedHours) {
      hoursStatus = 'below'
      hoursWarning = `${(expectedHours - totalHours).toFixed(2)}h below target`
    } else if (totalHours > expectedHours) {
      hoursStatus = 'above'
      hoursWarning = `${(totalHours - expectedHours).toFixed(2)}h above target`
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(25,118,210,0.05) 0%, rgba(25,118,210,0) 70%)',
          zIndex: 0,
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2.5,
          position: 'relative',
          zIndex: 1
        }}
      >
        <AssessmentIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: '1.25rem' }} />
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          Time Statistics
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} sm={6} md={profile?.hourlyRate ? 2 : 3}>
          <StatCard
            title="Total Hours"
            value={stats.totalHours}
            icon={<AccessTimeIcon />}
            warning={hoursWarning}
            status={hoursStatus}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={profile?.hourlyRate ? 2 : 3}>
          <StatCard
            title="Average Hours/Day"
            value={stats.averageHoursPerDay}
            icon={<QueryStatsIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={profile?.hourlyRate ? 2 : 3}>
          <StatCard
            title="Days Worked"
            value={stats.totalDays}
            icon={<CalendarTodayIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={profile?.hourlyRate ? 2 : 3}>
          <StatCard
            title="Projects"
            value={stats.uniqueProjects}
            icon={<WorkIcon />}
          />
        </Grid>

        {profile?.hourlyRate && (
          <>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="USD Earnings"
                value={`$${stats.earningsUSD}`}
                icon={<AttachMoneyIcon />}
                onCopy={() => copyToClipboard(stats.earningsUSD)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="DOP Earnings"
                value={`$${stats.earningsDOP}`}
                icon={<CurrencyExchangeIcon />}
                onCopy={() => copyToClipboard(stats.earningsDOP)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  )
}

export default TimeStats
