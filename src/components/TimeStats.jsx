import { Paper, Grid, Typography, Box, useTheme, IconButton, Tooltip } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import WorkIcon from '@mui/icons-material/Work'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import React, { useState } from 'react'

function StatCard({ title, value, icon, warning, status }) {
  const theme = useTheme()
  const [showCopy, setShowCopy] = useState(false)
  const [copied, setCopied] = useState(false)

  const getStatusColor = () => {
    switch (status) {
      case 'below':
        return theme.palette.error.main
      case 'above':
        return theme.palette.success.main
      default:
        return theme.palette.primary.main
    }
  }

  const getCardColor = () => {
    if (title === "Total Hours") return theme.palette.primary.main
    if (title === "Average Hours/Day") return theme.palette.info.main
    if (title === "Days Worked") return theme.palette.success.main
    if (title === "Projects") return theme.palette.warning.main
    if (title === "Earnings (USD)") return theme.palette.secondary.main
    if (title === "Earnings (DOP)") return theme.palette.secondary.main
    return theme.palette.primary.main
  }

  const cardColor = getCardColor()
  const statusColor = getStatusColor()

  const handleCopy = async () => {
    try {
      // Remove currency symbols for copying
      const numericValue = value.replace(/[^0-9.]/g, '')
      await navigator.clipboard.writeText(numericValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Check if this is an earnings card
  const isEarningsCard = title.startsWith('Earnings')

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${cardColor}15`,
        ...isEarningsCard ? {
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4]
          }
        } : {}
      }}
      onMouseEnter={() => isEarningsCard && setShowCopy(true)}
      onMouseLeave={() => isEarningsCard && setShowCopy(false)}
    >
      {isEarningsCard && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        >
          <Tooltip title={copied ? "Copied!" : "Copy numeric value"}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                color: theme.palette.text.secondary,
                padding: '4px',
                '&:hover': {
                  color: cardColor,
                  backgroundColor: `${cardColor}15`
                }
              }}
            >
              <ContentCopyIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Box
        sx={{
          backgroundColor: `${cardColor}15`,
          borderRadius: '8px',
          p: 1,
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '36px',
          minHeight: '36px'
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            fontSize: '1.4rem',
            color: cardColor
          }
        })}
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          mb: 0.75,
          fontSize: '1.4rem'
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          fontSize: '0.75rem',
          color: cardColor,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        {title}
      </Typography>
      {warning && (
        <Typography
          variant="caption"
          sx={{
            color: statusColor,
            mt: 1,
            fontSize: '0.7rem',
            maxWidth: '150px',
            backgroundColor: `${statusColor}15`,
            padding: '2px 6px',
            borderRadius: '4px'
          }}
        >
          {warning}
        </Typography>
      )}
    </Paper>
  )
}

function TimeStats({ timeEntries, expectedHours, profile }) {
  const theme = useTheme()

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

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3.5,
          fontWeight: 600,
          color: theme.palette.text.primary,
          letterSpacing: '-0.5px'
        }}
      >
        Summary Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={profile ? 2 : 3}>
          <StatCard
            title="Total Hours"
            value={stats.totalHours}
            icon={<AccessTimeIcon />}
            warning={hoursWarning}
            status={hoursStatus}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={profile ? 2 : 3}>
          <StatCard
            title="Average Hours/Day"
            value={stats.averageHoursPerDay}
            icon={<QueryStatsIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={profile ? 2 : 3}>
          <StatCard
            title="Days Worked"
            value={stats.totalDays}
            icon={<CalendarTodayIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={profile ? 2 : 3}>
          <StatCard
            title="Projects"
            value={stats.uniqueProjects}
            icon={<WorkIcon />}
          />
        </Grid>
        {profile && (
          <>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Earnings (USD)"
                value={`$${stats.earningsUSD}`}
                icon={<AttachMoneyIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Earnings (DOP)"
                value={`$${stats.earningsDOP}`}
                icon={<CurrencyExchangeIcon />}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default TimeStats
