import React from 'react'
import { Paper, Grid, Typography, Box, IconButton, Tooltip } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import WorkIcon from '@mui/icons-material/Work'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

function StatCard({ title, value, icon, warning, status, onCopy }) {
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
        borderLeft: status ? `4px solid ${
          status === 'above' ? '#2e7d32' :
          status === 'below' ? '#d32f2f' :
          'transparent'
        }` : 'none'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            mr: 1.5,
            display: 'flex',
            alignItems: 'center',
            color: '#1976d2'
          }}>
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        {onCopy && (
          <Tooltip title={`Copy value`}>
            <IconButton
              size="small"
              onClick={onCopy}
              sx={{ ml: 1 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Typography variant="h5" component="div" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>

      {warning && (
        <Typography
          variant="caption"
          sx={{
            color: status === 'above' ? '#2e7d32' : '#d32f2f',
            mt: 0.5
          }}
        >
          {warning}
        </Typography>
      )}
    </Paper>
  )
}

function TimeStats({ timeEntries, expectedHours, profile }) {
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
        overflow: 'hidden'
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Time Stats
      </Typography>

      <Grid container spacing={2}>
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
