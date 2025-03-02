import React, { useMemo } from 'react'
import {
  Paper,
  Typography,
  Box,
  Divider
} from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PaidIcon from '@mui/icons-material/Paid'

function EarningsStats({ timeEntries, profile }) {
  const earnings = useMemo(() => {
    const totalHours = timeEntries.reduce((total, entry) => {
      return total + (entry.duration / 3600000) // Convert milliseconds to hours
    }, 0)

    const usdEarnings = totalHours * profile.hourlyRate
    const dopEarnings = usdEarnings * profile.usdToDopRate

    return {
      hours: totalHours.toFixed(2),
      usd: usdEarnings.toFixed(2),
      dop: dopEarnings.toFixed(2)
    }
  }, [timeEntries, profile.hourlyRate, profile.usdToDopRate])

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AttachMoneyIcon color="primary" />
        Earnings Summary
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">Total Hours</Typography>
          <Typography variant="h5">{earnings.hours}h</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">USD Earnings</Typography>
          <Typography variant="h5">${earnings.usd}</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">DOP Earnings</Typography>
          <Typography variant="h5">${earnings.dop}</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PaidIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          Based on rate: ${profile.hourlyRate}/hour • USD/DOP: ${profile.usdToDopRate}
        </Typography>
      </Box>
    </Paper>
  )
}

export default EarningsStats
