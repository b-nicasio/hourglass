import React, { useEffect, forwardRef } from 'react'
import { Paper, Button, Box, useTheme, CircularProgress, Typography, Divider } from '@mui/material'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SearchIcon from '@mui/icons-material/Search'
import DateRangeIcon from '@mui/icons-material/DateRange'

// Custom styles for the date picker
const datePickerCustomStyles = `
  .react-datepicker {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    border: none;
    border-radius: 2px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 10000 !important;
  }
  .react-datepicker-popper {
    z-index: 10000 !important;
  }
  .react-datepicker-popper[data-placement^="bottom"] {
    margin-top: 10px !important;
  }
  .react-datepicker-popper[data-placement^="top"] {
    margin-bottom: 10px !important;
  }
  .date-picker-popper-start, .date-picker-popper-end {
    z-index: 10000 !important;
  }
  .react-datepicker-wrapper {
    display: inline-block;
    width: 100%;
  }
  .react-datepicker__header {
    background-color: #1976d2;
    border-bottom: none;
    border-radius: 2px 2px 0 0;
    padding-top: 12px;
    position: relative;
  }
  .react-datepicker__current-month {
    color: white;
    font-weight: 500;
    font-size: 1rem;
  }
  .react-datepicker__day-name {
    color: white;
  }
  .react-datepicker__day--selected {
    background-color: #1976d2;
    border-radius: 2px;
  }
  .react-datepicker__day--in-range {
    background-color: #1976d215;
  }
  .react-datepicker__day--in-selecting-range {
    background-color: #1976d230;
  }
  .react-datepicker__day:hover {
    border-radius: 2px;
  }
  .react-datepicker__navigation {
    top: 12px;
  }
  .react-datepicker__navigation-icon::before {
    border-color: white;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #1976d2;
    border-radius: 2px;
  }
`

function DateRangePicker({ dateRange, setDateRange, onFetch, loading }) {
  const theme = useTheme()

  const handleFetch = () => {
    const startStr = format(dateRange.startDate, 'yyyy-MM-dd')
    const endStr = format(dateRange.endDate, 'yyyy-MM-dd')
    onFetch(startStr, endStr)
  }

  // Add custom styles to the document
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.innerHTML = datePickerCustomStyles
    document.head.appendChild(styleElement)
    return () => document.head.removeChild(styleElement)
  }, [])

  // Create refs for the buttons
  const startButtonRef = React.useRef(null);
  const endButtonRef = React.useRef(null);

  const CustomInput = forwardRef(({ value, onClick, isEndDate }, ref) => (
    <Button
      variant="outlined"
      onClick={onClick}
      ref={isEndDate ? endButtonRef : startButtonRef}
      sx={{
        width: 'auto',
        minWidth: '160px',
        maxWidth: '180px',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        '&:hover': {
          backgroundColor: theme.palette.grey[50],
        },
        textTransform: 'none',
        color: theme.palette.text.primary,
        borderRadius: 1,
        px: 1.5
      }}
      endIcon={<CalendarTodayIcon />}
    >
      {value}
    </Button>
  ))

  const StartDateCustomInput = forwardRef((props, ref) => (
    <CustomInput {...props} ref={ref} isEndDate={false} />
  ))

  const EndDateCustomInput = forwardRef((props, ref) => (
    <CustomInput {...props} ref={ref} isEndDate={true} />
  ))

  return (
    <Paper
      sx={{
        mb: 3,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
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
      {/* Header with title */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'relative',
          zIndex: 1
        }}
      >
        <DateRangeIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: '1.25rem' }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            color: theme.palette.text.primary,
            flex: 1
          }}
        >
          Time Period Selection
        </Typography>
      </Box>

      {/* Body with controls */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          position: 'relative',
          zIndex: 5
        }}
      >
        {/* Date picker section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: { xs: 1, md: 'auto' },
            width: 'auto',
            maxWidth: { md: 'fit-content' }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              width: 'auto',
              mr: 1.5,
              whiteSpace: 'nowrap'
            }}
          >
            Date Range:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              alignItems: 'center',
              width: 'auto'
            }}
          >
            <Box sx={{ width: 'auto' }}>
              <ReactDatePicker
                selected={dateRange.startDate}
                onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                selectsStart
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                dateFormat="MMM dd, yyyy"
                placeholderText="Start Date"
                customInput={<StartDateCustomInput />}
                disabled={loading}
                popperClassName="date-picker-popper-start"
                popperPlacement="bottom"
                popperModifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10],
                    },
                  },
                  {
                    name: "preventOverflow",
                    options: {
                      rootBoundary: "viewport",
                      boundary: "viewport",
                      mainAxis: true,
                      altAxis: true
                    }
                  },
                  {
                    name: "flip",
                    options: {
                      fallbackPlacements: ["top", "top-end", "top-start"],
                    },
                  }
                ]}
                portalId="date-picker-portal-start"
              />
            </Box>

            <Typography variant="body2" sx={{
              color: theme.palette.text.secondary,
              mx: 0.5,
              fontSize: '0.75rem',
              whiteSpace: 'nowrap'
            }}>to</Typography>

            <Box sx={{ width: 'auto' }}>
              <ReactDatePicker
                selected={dateRange.endDate}
                onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                selectsEnd
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                minDate={dateRange.startDate}
                dateFormat="MMM dd, yyyy"
                placeholderText="End Date"
                customInput={<EndDateCustomInput />}
                disabled={loading}
                popperClassName="date-picker-popper-end"
                popperPlacement="bottom"
                popperModifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10],
                    },
                  },
                  {
                    name: "preventOverflow",
                    options: {
                      rootBoundary: "viewport",
                      boundary: "viewport",
                      mainAxis: true,
                      altAxis: true
                    }
                  },
                  {
                    name: "flip",
                    options: {
                      fallbackPlacements: ["top", "top-end", "top-start"],
                    },
                  }
                ]}
                portalId="date-picker-portal-end"
              />
            </Box>
          </Box>
        </Box>

        {/* Vertical divider for larger screens */}
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

        {/* Horizontal divider for mobile */}
        <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

        {/* Fetch button section */}
        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', md: 'center' } }}>
          <Button
            variant="contained"
            onClick={handleFetch}
            disabled={loading}
            sx={{
              minWidth: { xs: '100%', md: '180px' },
              textTransform: 'none',
              fontSize: '0.95rem',
              py: 1.25,
              borderRadius: 1,
              background: loading ? theme.palette.primary.main : 'linear-gradient(135deg, #47a9ff 0%, #0071e3 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0071e3 0%, #005bb8 100%)',
              },
              position: 'relative',
              zIndex: 1,
              boxShadow: '0px 2px 6px rgba(0, 113, 227, 0.2)',
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          >
            {loading ? 'Loading...' : 'Fetch Time Entries'}
          </Button>
        </Box>
      </Box>

      {/* Portals for date pickers to ensure they're rendered at the end of the document body */}
      <div id="date-picker-portal-start" />
      <div id="date-picker-portal-end" />
    </Paper>
  )
}

export default DateRangePicker
