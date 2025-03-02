import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Container, CssBaseline, Box, Typography, Alert, Grid, IconButton, Tooltip, Button, Paper, TextField, Divider } from '@mui/material'
import DateRangePicker from './components/DateRangePicker'
import TimeEntriesList from './components/TimeEntriesList'
import TimeStats from './components/TimeStats'
import DateRangeTable from './components/DateRangeTable'
import ApiKeyInput from './components/ApiKeyInput'
import Header from './components/Header'
import timeTrackingService from './services/timeTrackingService'
import { format } from 'date-fns'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import PersonIcon from '@mui/icons-material/Person'
import Profile from './components/Profile'
import EarningsStats from './components/EarningsStats'
import DeleteIcon from '@mui/icons-material/Delete'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    info: {
      main: '#0284c7',
      light: '#0ea5e9',
      dark: '#0369a1',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569'
    },
    divider: '#e2e8f0'
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      }
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.5
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#64748b',
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    }
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          width: '100vw',
          maxWidth: '100vw !important',
          padding: '0 24px',
          '@media (min-width:1200px)': {
            paddingLeft: '32px',
            paddingRight: '32px'
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          boxShadow: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: 'none'
          }
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid'
        },
        standardSuccess: {
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0'
        },
        standardError: {
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca'
        },
        standardWarning: {
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a'
        },
        standardInfo: {
          backgroundColor: '#f0f9ff',
          borderColor: '#bae6fd'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500
        },
        outlined: {
          borderColor: '#e2e8f0',
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0'
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f8fafc'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0
          }
        }
      }
    }
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 30px -6px rgba(0, 0, 0, 0.1), 0px 12px 12px -6px rgba(0, 0, 0, 0.04)',
    '0px 30px 35px -7px rgba(0, 0, 0, 0.1), 0px 14px 14px -7px rgba(0, 0, 0, 0.04)',
    '0px 35px 40px -8px rgba(0, 0, 0, 0.1), 0px 16px 16px -8px rgba(0, 0, 0, 0.04)',
    '0px 40px 45px -9px rgba(0, 0, 0, 0.1), 0px 18px 18px -9px rgba(0, 0, 0, 0.04)',
    '0px 45px 50px -10px rgba(0, 0, 0, 0.1), 0px 20px 20px -10px rgba(0, 0, 0, 0.04)',
    '0px 50px 55px -11px rgba(0, 0, 0, 0.1), 0px 22px 22px -11px rgba(0, 0, 0, 0.04)',
    '0px 55px 60px -12px rgba(0, 0, 0, 0.1), 0px 24px 24px -12px rgba(0, 0, 0, 0.04)',
    '0px 60px 65px -13px rgba(0, 0, 0, 0.1), 0px 26px 26px -13px rgba(0, 0, 0, 0.04)',
    '0px 65px 70px -14px rgba(0, 0, 0, 0.1), 0px 28px 28px -14px rgba(0, 0, 0, 0.04)',
    '0px 70px 75px -15px rgba(0, 0, 0, 0.1), 0px 30px 30px -15px rgba(0, 0, 0, 0.04)',
    '0px 75px 80px -16px rgba(0, 0, 0, 0.1), 0px 32px 32px -16px rgba(0, 0, 0, 0.04)',
    '0px 80px 85px -17px rgba(0, 0, 0, 0.1), 0px 34px 34px -17px rgba(0, 0, 0, 0.04)',
    '0px 85px 90px -18px rgba(0, 0, 0, 0.1), 0px 36px 36px -18px rgba(0, 0, 0, 0.04)',
    '0px 90px 95px -19px rgba(0, 0, 0, 0.1), 0px 38px 38px -19px rgba(0, 0, 0, 0.04)',
    '0px 95px 100px -20px rgba(0, 0, 0, 0.1), 0px 40px 40px -20px rgba(0, 0, 0, 0.04)',
    '0px 100px 105px -21px rgba(0, 0, 0, 0.1), 0px 42px 42px -21px rgba(0, 0, 0, 0.04)',
    '0px 105px 110px -22px rgba(0, 0, 0, 0.1), 0px 44px 44px -22px rgba(0, 0, 0, 0.04)',
    '0px 110px 115px -23px rgba(0, 0, 0, 0.1), 0px 46px 46px -23px rgba(0, 0, 0, 0.04)',
    '0px 115px 120px -24px rgba(0, 0, 0, 0.1), 0px 48px 48px -24px rgba(0, 0, 0, 0.04)'
  ]
})

function App() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)), // First day of current month
    endDate: new Date(), // Today
  })
  const [timeEntries, setTimeEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [workspace, setWorkspace] = useState(null)
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('clockifyApiKey') || '')
  const [apiKey, setApiKey] = useState('')
  const [initializing, setInitializing] = useState(true)
  const [expectedHours, setExpectedHours] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [showInitialProfile, setShowInitialProfile] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      const savedApiKey = localStorage.getItem('clockifyApiKey')
      if (savedApiKey) {
        setApiKey(savedApiKey)
        setApiKeyInput(savedApiKey)
        try {
          setError(null)
          const user = await timeTrackingService.getUserInfo(savedApiKey)
          setUserInfo(user)
          const ws = await timeTrackingService.getWorkspace(savedApiKey)
          setWorkspace(ws)
        } catch (error) {
          console.error('Initialization error:', error)
          setError('Failed to initialize app. Please check your API key.')
          setUserInfo(null)
          setWorkspace(null)
        }
      }
      setInitializing(false)
    }
    initializeApp()
  }, [])

  useEffect(() => {
    const savedProfile = localStorage.getItem('hourglassProfile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  useEffect(() => {
    if (apiKey && dateRange && userInfo && workspace) {
      setLoading(true)
      setError('')
      const fetchData = async () => {
        try {
          const entries = await timeTrackingService.getTimeEntries(
            workspace.id,
            userInfo.id,
            format(dateRange.startDate, 'yyyy-MM-dd'),
            format(dateRange.endDate, 'yyyy-MM-dd'),
            apiKey
          )
          setTimeEntries(entries)
        } catch (error) {
          setError('Failed to fetch time entries. Please try again.')
          console.error('Error fetching time entries:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [apiKey, dateRange, userInfo, workspace])

  const handleApiKeySubmit = (newApiKey) => {
    setApiKeyInput(newApiKey)
  }

  const handleSaveSettings = async () => {
    if (apiKeyInput && profile?.name && profile?.hourlyRate && profile?.usdToDopRate) {
      setError(null)
      setInitializing(true)
      try {
        const user = await timeTrackingService.getUserInfo(apiKeyInput)
        const ws = await timeTrackingService.getWorkspace(apiKeyInput)
        setUserInfo(user)
        setWorkspace(ws)
        setApiKey(apiKeyInput)
        localStorage.setItem('clockifyApiKey', apiKeyInput)
        localStorage.setItem('hourglassProfile', JSON.stringify(profile))
      } catch (error) {
        console.error('Initialization error:', error)
        setError('Failed to initialize app. Please check your API key.')
        setUserInfo(null)
        setWorkspace(null)
        setApiKey('')
      }
      setInitializing(false)
    }
  }

  const handleResetApiKey = () => {
    localStorage.removeItem('clockifyApiKey')
    setApiKey('')
    setUserInfo(null)
    setWorkspace(null)
    setTimeEntries([])
  }

  const handleProfileClose = (updatedProfile) => {
    if (updatedProfile) {
      setProfile(updatedProfile)
    }
    setProfileOpen(false)
    setShowInitialProfile(false)
  }

  const handleDateRangeSelect = (newRange, billableDays, month) => {
    setDateRange(newRange)
    setExpectedHours(billableDays * 8) // 8 hours per billable day
    setSelectedMonth(month)
  }

  const handleDownloadReport = async (startDate, endDate, periodName) => {
    if (!userInfo || !workspace) {
      setError('App not properly initialized. Please check your API key.')
      return
    }

    try {
      const startStr = format(startDate, 'yyyy-MM-dd')
      const endStr = format(endDate, 'yyyy-MM-dd')
      await timeTrackingService.downloadReport(
        workspace.id,
        userInfo.id,
        startStr,
        endStr,
        userInfo.name,
        periodName,
        apiKey
      )
    } catch (err) {
      setError('Failed to download report. Please try again.')
      console.error('Error downloading report:', err)
    }
  }

  // Show loading state while checking API key
  if (initializing) {
    return null // Or a loading spinner if you prefer
  }

  if (!apiKey || !userInfo || !workspace || !profile?.name || !profile?.hourlyRate || !profile?.usdToDopRate) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '360px',
              mx: 'auto',
              px: 2
            }}
          >
            <Box sx={{
              textAlign: 'center',
              mb: 4,
              mt: { xs: 2, sm: 4 }
            }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  mb: 2
                }}
              >
                <HourglassEmptyIcon
                  sx={{
                    fontSize: '2.25rem',
                    color: theme.palette.primary.main,
                    animation: 'flip 2s infinite',
                    '@keyframes flip': {
                      '0%': {
                        transform: 'rotate(0deg)',
                      },
                      '100%': {
                        transform: 'rotate(180deg)',
                      },
                    },
                  }}
                />
                <Typography variant="h3" component="h1" sx={{ fontSize: '1.75rem' }}>
                  Welcome to Hourglass
                </Typography>
              </Box>
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{
                  mb: 1.5,
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Let's get you set up to track your time and earnings
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: '320px', mx: 'auto', mb: 3, fontSize: '0.875rem' }}
              >
                Hourglass helps you monitor your work hours, track project distributions,
                and calculate earnings in both USD and DOP.
              </Typography>
            </Box>

            <Paper
              sx={{
                p: 2.5,
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                backgroundColor: 'white',
                width: '100%'
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  Profile Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Enter your Clockify API key and profile information to get started.
                </Typography>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Clockify API Key"
                  value={apiKeyInput}
                  onChange={(e) => handleApiKeySubmit(e.target.value)}
                  margin="normal"
                  type="password"
                  helperText="Enter your Clockify API key to connect your account"
                  sx={{ '& .MuiFormHelperText-root': { fontSize: '0.75rem' } }}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  Earnings Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                  These settings will be used to calculate your earnings.
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Your Name"
                  value={profile?.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Hourly Rate (USD)"
                  type="number"
                  value={profile?.hourlyRate || ''}
                  onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                  margin="normal"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, fontSize: '0.75rem' }}>$</Typography>
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="USD to DOP Rate"
                  type="number"
                  value={profile?.usdToDopRate || ''}
                  onChange={(e) => setProfile({ ...profile, usdToDopRate: e.target.value })}
                  margin="normal"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, fontSize: '0.75rem' }}>RD$</Typography>
                  }}
                />

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
                  <Button
                    onClick={handleResetApiKey}
                    color="error"
                    startIcon={<DeleteIcon sx={{ fontSize: 18 }} />}
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Reset Settings
                  </Button>
                  <Button
                    onClick={handleSaveSettings}
                    variant="contained"
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                    disabled={!apiKeyInput || !profile?.name || !profile?.hourlyRate || !profile?.usdToDopRate}
                  >
                    Save Settings
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          py: 4,
          width: '100vw',
          overflowX: 'hidden'
        }}
      >
        <Container>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 4,
            px: { xs: 2, sm: 3, md: 4 }
          }}>
            <Header
              userInfo={userInfo}
              workspace={workspace}
              onProfileClick={() => setProfileOpen(true)}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', xl: 'row' },
              gap: { xs: 3, xl: 4 },
              width: '100%',
              px: { xs: 2, sm: 3, md: 4 }
            }}
          >
            {/* Main content area */}
            <Box
              sx={{
                flex: '1 1 auto',
                width: '100%',
                minWidth: 0,
                order: { xs: 2, xl: 1 },
                maxWidth: { xl: 'calc(100% - 540px)' }
              }}
            >
              <DateRangePicker
                dateRange={dateRange}
                setDateRange={(newRange) => {
                  setDateRange(newRange)
                  setExpectedHours(null)
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TimeStats
                timeEntries={timeEntries}
                expectedHours={expectedHours}
                profile={profile}
              />

              <Box sx={{ mt: 3 }}>
                <TimeEntriesList
                  timeEntries={timeEntries}
                  loading={loading}
                  dateRange={dateRange}
                  onDownloadReport={handleDownloadReport}
                  selectedMonth={selectedMonth}
                />
              </Box>
            </Box>

            {/* Right sidebar with billing periods */}
            <Box
              sx={{
                width: { xs: '100%', xl: '520px' },
                minWidth: { xl: '520px' },
                flexShrink: 0,
                order: { xs: 1, xl: 2 }
              }}
            >
              <DateRangeTable onSelectRange={handleDateRangeSelect} />
            </Box>
          </Box>
        </Container>
      </Box>

      <Profile
        open={profileOpen}
        onClose={handleProfileClose}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeySubmit}
        onResetApiKey={handleResetApiKey}
      />
    </ThemeProvider>
  )
}

export default App
