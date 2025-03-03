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
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          borderLeft: `4px solid ${project.color}`,
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell sx={{ width: 48, p: { xs: 1, sm: 1.5 } }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(!open)
            }}
            sx={{
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)'
              }
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ p: { xs: 1, sm: 1.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 1,
                backgroundColor: project.color,
                mr: 1.5,
                flexShrink: 0
              }}
            />
            <Typography sx={{ fontWeight: 500 }}>
              {project.name || 'No Project'}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center" sx={{ p: { xs: 1, sm: 1.5 } }}>
          {entries.length}
        </TableCell>
        <TableCell align="right" sx={{
          fontWeight: 500,
          color: theme.palette.primary.main,
          p: { xs: 1, sm: 1.5 }
        }}>
          {formattedTime}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ p: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 3, backgroundColor: theme.palette.grey[50] }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Time Entries ({entries.length})
              </Typography>
              <Table size="small" sx={{
                mb: 2,
                '& .MuiTableCell-root': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 1.25
                }
              }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.04)' }}>
                    <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Time</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.description || '-'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(entry.timeInterval.start), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(entry.timeInterval.start), 'h:mm a')} - {format(new Date(entry.timeInterval.end), 'h:mm a')}
                      </TableCell>
                      <TableCell align="right" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
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
  const [openStates, setOpenStates] = useState({})
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [showGraphs, setShowGraphs] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const theme = useTheme()

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
      <Paper
        elevation={2}
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
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
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          gap: 2,
          position: 'relative',
          zIndex: 1
        }}>
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Loading time entries...
          </Typography>
        </Box>
      </Paper>
    )
  }

  if (!timeEntries.length) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
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
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          gap: 2,
          position: 'relative',
          zIndex: 1
        }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            No time entries found for the selected period.
          </Typography>
        </Box>
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
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            borderRadius: 1,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          {showGraphs ? 'Hide Charts' : 'Show Charts'}
        </Button>
      </Box>

      <Collapse in={showGraphs} timeout={300}>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={12} lg={6} xl={6} sx={{ height: '500px', pb: 3 }}>
            <DailyHoursChart timeEntries={timeEntries} />
          </Grid>
          <Grid item xs={12} md={12} lg={6} xl={6} sx={{ height: '500px', pb: 3 }}>
            <ProjectDistributionChart timeEntries={timeEntries} />
          </Grid>
        </Grid>
      </Collapse>

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          overflow: 'hidden',
          position: 'relative',
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
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1.5, sm: 2 },
            position: 'relative',
            zIndex: 1
          }}
        >
          <Typography variant="h6" sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <ContentCopyIcon sx={{
              fontSize: '1.25rem',
              mr: 1.5,
              color: theme.palette.primary.main
            }} />
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
                py: { xs: 1, sm: 1.25 },
                borderRadius: 1
              }}
            >
              Copy Project Times
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
              disabled={downloading}
              onClick={async () => {
                try {
                  // Ensure we have valid dates
                  if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
                    console.error('Invalid date range');
                    return;
                  }

                  // Safely format dates
                  const startDate = new Date(dateRange.startDate);
                  const endDate = new Date(dateRange.endDate);

                  // Validate dates
                  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.error('Invalid date objects');
                    return;
                  }

                  setDownloading(true);
                  const startStr = format(startDate, 'yyyy-MM-dd');
                  const endStr = format(endDate, 'yyyy-MM-dd');
                  const periodName = `${selectedMonth || 'Custom Period'} ${BILLING_YEAR || new Date().getFullYear()}`;

                  await onDownloadReport(startStr, endStr, periodName);
                } catch (error) {
                  console.error("Error preparing download:", error);
                } finally {
                  setDownloading(false);
                }
              }}
              sx={{
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                minWidth: { xs: '100%', sm: '200px' },
                py: { xs: 1, sm: 1.25 },
                borderRadius: 1,
                background: downloading ? theme.palette.primary.main : 'linear-gradient(135deg, #47a9ff 0%, #0071e3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0071e3 0%, #005bb8 100%)',
                },
                boxShadow: '0px 2px 6px rgba(0, 113, 227, 0.2)',
              }}
            >
              {downloading ? 'Generating PDF...' : 'Download Clockify PDF Report'}
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
