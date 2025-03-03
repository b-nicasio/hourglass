import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Container, CssBaseline, Box, Typography, Alert, Grid, IconButton, Tooltip, Button, Paper, TextField, Divider, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
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
  const [apiKey, setApiKey] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  const [workspace, setWorkspace] = useState(null)
  const [workspaces, setWorkspaces] = useState([])
  const [_projects, _setProjects] = useState([])
  const [timeEntries, setTimeEntries] = useState([])
  const [billableDays, setBillableDays] = useState(0)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  })
  const [showProfile, setShowProfile] = useState(false)
  const [_showInitialProfile, setShowInitialProfile] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [profile, setProfile] = useState(null)
  const [userAuth, setUserAuth] = useState(null)

  useEffect(() => {
    const initializeApp = async () => {
      setInitialLoading(true);
      const savedApiKey = localStorage.getItem('apiKey');
      const savedProfile = localStorage.getItem('hourglassProfile');
      const savedWorkspaceId = localStorage.getItem('selectedWorkspaceId');

      // Process API key and profile together to avoid multiple re-renders
      if (savedApiKey) {
        setApiKey(savedApiKey);

        try {
          setError(null);
          // Perform API calls in parallel
          const [user, allWorkspaces] = await Promise.all([
            timeTrackingService.getUserInfo(savedApiKey),
            timeTrackingService.getWorkspaces(savedApiKey)
          ]);

          // Set userAuth for API calls
          setUserAuth({
            id: user.id,
            name: user.name
          });

          // Set userInfo for display
          setUserInfo(user);
          
          // Store all workspaces
          setWorkspaces(allWorkspaces);
          
          // Set the selected workspace
          if (savedWorkspaceId && allWorkspaces.length > 0) {
            // Find the saved workspace in the list
            const savedWorkspace = allWorkspaces.find(ws => ws.id === savedWorkspaceId);
            if (savedWorkspace) {
              setWorkspace(savedWorkspace);
            } else {
              // Fallback to the first workspace if saved one not found
              setWorkspace(allWorkspaces[0]);
            }
          } else if (allWorkspaces.length > 0) {
            // Default to first workspace if none saved
            setWorkspace(allWorkspaces[0]);
          }

          // Set profile if available
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          }

          // Don't show profile dialog if we have valid data
          setShowProfile(false);
        } catch (error) {
          console.error('Initialization error:', error);
          setError('Failed to initialize app. Please check your API key.');

          // Reset state
          setUserAuth(null);
          setUserInfo(null);
          setWorkspace(null);
          setWorkspaces([]);
          setProfile(null);

          // Show profile dialog only if API key is invalid
          setShowProfile(true);
        }
      } else {
        // Show profile setup if no API key is found
        setShowProfile(true);
      }
      setInitialLoading(false);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (apiKey && dateRange && userAuth && workspace) {
      const startStr = format(dateRange.startDate, 'yyyy-MM-dd')
      const endStr = format(dateRange.endDate, 'yyyy-MM-dd')
      fetchTimeEntries(startStr, endStr)
    }
  }, [apiKey, dateRange, userAuth, workspace])

  const handleApiKeySubmit = async (newApiKey) => {
    if (!newApiKey) return;

    // Don't use full-page loading for this operation
    setApiKey(newApiKey);
    localStorage.setItem('apiKey', newApiKey);

    try {
      setError(null);
      // Execute API calls in parallel
      const [user, allWorkspaces] = await Promise.all([
        timeTrackingService.getUserInfo(newApiKey),
        timeTrackingService.getWorkspaces(newApiKey)
      ]);

      // Update state only after both calls complete successfully
      setUserAuth({
        id: user.id,
        name: user.name
      });
      setUserInfo(user);
      setWorkspaces(allWorkspaces);
      
      // Select the first workspace by default
      if (allWorkspaces.length > 0) {
        setWorkspace(allWorkspaces[0]);
      }
    } catch (error) {
      console.error('Initialization error:', error);
      setError('Failed to initialize app. Please check your API key.');
      setUserAuth(null);
      setUserInfo(null);
      setWorkspace(null);
      setWorkspaces([]);
    }
  };

  const handleWorkspaceChange = (event) => {
    const selectedWorkspaceId = event.target.value;
    const selectedWorkspace = workspaces.find(ws => ws.id === selectedWorkspaceId);
    
    if (selectedWorkspace) {
      setWorkspace(selectedWorkspace);
      localStorage.setItem('selectedWorkspaceId', selectedWorkspaceId);
      
      // Refresh time entries for the new workspace
      if (dateRange) {
        const startStr = format(dateRange.startDate, 'yyyy-MM-dd');
        const endStr = format(dateRange.endDate, 'yyyy-MM-dd');
        fetchTimeEntries(startStr, endStr);
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleSaveSettings = async () => {
    if (apiKey && userInfo && workspace) {
      setError(null)
      try {
        // If we need to refresh workspaces
        const allWorkspaces = await timeTrackingService.getWorkspaces(apiKey)
        setWorkspaces(allWorkspaces)
        
        // Find the currently selected workspace in the updated list
        if (workspace) {
          const updatedWorkspace = allWorkspaces.find(ws => ws.id === workspace.id)
          if (updatedWorkspace) {
            setWorkspace(updatedWorkspace)
          } else if (allWorkspaces.length > 0) {
            setWorkspace(allWorkspaces[0])
          }
        }
        
        localStorage.setItem('apiKey', apiKey)
        localStorage.setItem('hourglassProfile', JSON.stringify(userInfo))
      } catch (error) {
        console.error('Error saving settings:', error)
        setError('Failed to save settings. Please try again.')
      }
    }
  }

  const handleResetApiKey = () => {
    localStorage.removeItem('apiKey')
    localStorage.removeItem('selectedWorkspaceId')
    setApiKey('')
    setUserInfo(null)
    setWorkspace(null)
    setWorkspaces([])
    setTimeEntries([])
    setProfile(null)
  }

  const fetchTimeEntries = async (startStr, endStr) => {
    if (!apiKey || !userAuth || !workspace) {
      setError('Please set up your API key and workspace first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const entries = await timeTrackingService.getTimeEntries(
        workspace.id,
        userAuth.id,
        startStr,
        endStr,
        apiKey
      );
      setTimeEntries(entries);
    } catch (error) {
      setError('Failed to fetch time entries. Please try again.');
      console.error('Error fetching time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClose = (updatedProfile) => {
    // Only update profile information, not authentication info
    if (updatedProfile) {
      setProfile(updatedProfile);

      // Only update userInfo display properties, not the id used for API calls
      setUserInfo(prevUserInfo => {
        if (!prevUserInfo) return updatedProfile;
        return {
          ...prevUserInfo,
          hourlyRate: updatedProfile.hourlyRate,
          usdToDopRate: updatedProfile.usdToDopRate
        };
      });
    }

    // Always close the profile dialog
    setShowProfile(false);
    setShowInitialProfile(false);
  };

  const handleDateRangeSelect = (newRange, billableDays, month) => {
    setDateRange(newRange)
    setBillableDays(billableDays)
    setSelectedMonth(month)
  }

  const handleDownloadReport = async (startDate, endDate, periodName) => {
    if (!userAuth || !workspace) {
      setError('Please set up your profile and workspace first')
      return
    }

    try {
      let startStr;
      let endStr;

      try {
        // Check if startDate is a string or Date object
        if (typeof startDate === 'string') {
          // If it's already a string in the format yyyy-MM-dd, use it directly
          startStr = startDate;
        } else {
          // Otherwise format it
          const startDateObj = new Date(startDate);
          if (isNaN(startDateObj.getTime())) {
            throw new Error('Invalid start date');
          }
          startStr = format(startDateObj, 'yyyy-MM-dd');
        }

        // Check if endDate is a string or Date object
        if (typeof endDate === 'string') {
          // If it's already a string in the format yyyy-MM-dd, use it directly
          endStr = endDate;
        } else {
          // Otherwise format it
          const endDateObj = new Date(endDate);
          if (isNaN(endDateObj.getTime())) {
            throw new Error('Invalid end date');
          }
          endStr = format(endDateObj, 'yyyy-MM-dd');
        }
      } catch (error) {
        console.error('Error formatting dates:', error);
        setError('Invalid date range. Please select valid dates.');
        return;
      }

      await timeTrackingService.downloadReport(
        workspace.id,
        userAuth.id,
        startStr,
        endStr,
        userAuth.name,
        periodName,
        apiKey
      )
    } catch (error) {
      console.error('Error downloading report:', error)
      setError(`Error downloading report: ${error.message || 'Unknown error'}`)
    }
  }

  // Show loading indicator while initializing the app for the first time
  if (initialLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  // Show initialization screen when no data is available
  if ((!apiKey || !userAuth || !workspace) && !loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default
          }}
        >
          {/* No content needed here, just auto-open the profile dialog */}
          <Profile
            open={true} // Always open when initializing
            onClose={handleProfileClose}
            apiKey={apiKey}
            onApiKeyChange={handleApiKeySubmit}
            onResetApiKey={handleResetApiKey}
          />
        </Box>
      </ThemeProvider>
    );
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
              workspaces={workspaces}
              onWorkspaceChange={handleWorkspaceChange}
              onProfileClick={() => setShowProfile(true)}
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
                  setBillableDays(0)
                }}
                onFetch={(startStr, endStr) => {
                  fetchTimeEntries(startStr, endStr)
                }}
                loading={loading}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TimeStats
                timeEntries={timeEntries}
                expectedHours={billableDays * 8}
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

      {/* Profile dialog - only shown when explicitly requested */}
      <Profile
        open={showProfile}
        onClose={handleProfileClose}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeySubmit}
        onResetApiKey={handleResetApiKey}
      />
    </ThemeProvider>
  )
}

export default App
