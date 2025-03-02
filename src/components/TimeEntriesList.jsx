import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Typography,
  Collapse,
  IconButton,
  useTheme,
  Button,
  Snackbar,
  Stack,
  Grid
} from '@mui/material'
import { format } from 'date-fns'
import { useState, useMemo } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { BILLING_YEAR } from '../config/billingPeriods'
import DailyHoursChart from './DailyHoursChart'
import ProjectDistributionChart from './ProjectDistributionChart'

function formatMillisecondsToTime(ms) {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function ProjectRow({ project, entries }) {
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const totalMilliseconds = useMemo(() => {
    return entries.reduce((total, entry) => total + entry.duration, 0)
  }, [entries])

  const formattedTime = formatMillisecondsToTime(totalMilliseconds)

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          backgroundColor: project.color + '10',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: project.color + '20',
          },
          cursor: 'pointer'
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell padding="checkbox" sx={{ width: '48px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(!open)
            }}
            sx={{
              transition: 'transform 0.2s',
              transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            minWidth: '200px',
            maxWidth: '300px'
          }}
        >
          <Typography
            sx={{
              color: project.color,
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            {project.name}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ width: '100px' }}>{entries.length}</TableCell>
        <TableCell align="right" sx={{ width: '150px' }}>{formattedTime}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 0,
                backgroundColor: theme.palette.grey[50],
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableCell sx={{ width: '120px', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ minWidth: '300px', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ width: '100px', fontWeight: 'bold' }}>Start Time</TableCell>
                    <TableCell sx={{ width: '100px', fontWeight: 'bold' }}>End Time</TableCell>
                    <TableCell sx={{ width: '120px', fontWeight: 'bold' }} align="right">Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.grey[100]
                        },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>{format(new Date(entry.timeInterval.start), 'yyyy-MM-dd')}</TableCell>
                      <TableCell sx={{
                        maxWidth: '400px',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}>
                        {entry.description || 'No Description'}
                      </TableCell>
                      <TableCell>{format(new Date(entry.timeInterval.start), 'HH:mm')}</TableCell>
                      <TableCell>{format(new Date(entry.timeInterval.end), 'HH:mm')}</TableCell>
                      <TableCell align="right">
                        {formatMillisecondsToTime(entry.duration)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

function TimeEntriesList({ timeEntries, loading, dateRange, onDownloadReport, selectedMonth }) {
  const theme = useTheme()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [showGraphs, setShowGraphs] = useState(true)

  const groupedEntries = useMemo(() => {
    const groups = timeEntries.reduce((acc, entry) => {
      const projectId = entry.projectId || 'no-project'
      if (!acc[projectId]) {
        acc[projectId] = {
          name: entry.projectName,
          color: entry.projectColor || '#666666',
          entries: []
        }
      }
      acc[projectId].entries.push(entry)
      return acc
    }, {})

    // Sort entries within each project by date
    Object.values(groups).forEach(group => {
      group.entries.sort((a, b) =>
        new Date(b.timeInterval.start) - new Date(a.timeInterval.start)
      )
    })

    return groups
  }, [timeEntries])

  const handleCopyToClipboard = () => {
    const projectTimes = Object.entries(groupedEntries).map(([, project]) => {
      const totalMs = project.entries.reduce((total, entry) => {
        return total + (new Date(entry.timeInterval.end) - new Date(entry.timeInterval.start))
      }, 0)
      return `${project.name} - ${formatMillisecondsToTime(totalMs)}`
    }).join('\n')

    navigator.clipboard.writeText(projectTimes).then(() => {
      setSnackbarOpen(true)
    })
  }

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px'
      }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (!timeEntries.length) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: theme.palette.grey[50]
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No time entries found for the selected period.
        </Typography>
      </Paper>
    )
  }

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="medium"
          startIcon={showGraphs ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={() => setShowGraphs(!showGraphs)}
          sx={{
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            '&:hover': {
              borderColor: theme.palette.text.secondary,
              backgroundColor: theme.palette.action.hover,
            }
          }}
        >
          {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
        </Button>
      </Box>

      <Collapse in={showGraphs} timeout="auto">
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4, minHeight: showGraphs ? '600px' : '0px' }}>
          <Grid item xs={12} md={12} lg={6} xl={6} sx={{ height: '500px' }}>
            <DailyHoursChart timeEntries={timeEntries} />
          </Grid>
          <Grid item xs={12} md={12} lg={6} xl={6} sx={{ height: '500px' }}>
            <ProjectDistributionChart timeEntries={timeEntries} />
          </Grid>
        </Grid>
      </Collapse>

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1.5, sm: 2 }
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
            Time Entries Details
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="contained"
              size="medium"
              startIcon={<ContentCopyIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
              onClick={handleCopyToClipboard}
              sx={{
                backgroundColor: theme.palette.grey[100],
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.grey[200],
                },
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                minWidth: { xs: '100%', sm: '160px' },
                py: { xs: 1, sm: 1.25 }
              }}
            >
              Copy Project Times
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={<FileDownloadIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
              onClick={() => {
                const startStr = format(dateRange.startDate, 'yyyy-MM-dd')
                const endStr = format(dateRange.endDate, 'yyyy-MM-dd')
                const periodName = `${selectedMonth} ${BILLING_YEAR}`
                onDownloadReport(startStr, endStr, periodName)
              }}
              sx={{
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                minWidth: { xs: '100%', sm: '200px' },
                py: { xs: 1, sm: 1.25 }
              }}
            >
              Download Clockify PDF Report
            </Button>
          </Stack>
        </Box>

        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main + '10' }}>
              <TableCell />
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Project</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Entries</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Total Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedEntries).map(([projectId, project]) => (
              <ProjectRow
                key={projectId}
                project={project}
                entries={project.entries}
              />
            ))}
          </TableBody>
        </Table>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Project times copied to clipboard"
      />
    </>
  )
}

export default TimeEntriesList
