import React, { useEffect, forwardRef } from 'react'
import { Paper, Button, Box, useTheme, CircularProgress } from '@mui/material'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SearchIcon from '@mui/icons-material/Search'

// Custom styles for the date picker
const datePickerCustomStyles = `
  .react-datepicker {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    border: none;
    border-radius: 2px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 10000 !important;
  }
  .react-datepicker-popper {
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

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button
      variant="outlined"
      onClick={onClick}
      ref={ref}
      sx={{
        width: '100%',
        minWidth: { xs: '100%', sm: '180px' },
        justifyContent: 'space-between',
        backgroundColor: 'white',
        '&:hover': {
          backgroundColor: theme.palette.grey[50],
        },
        textTransform: 'none',
        color: theme.palette.text.primary,
        borderRadius: 1,
      }}
      endIcon={<CalendarTodayIcon />}
    >
      {value}
    </Button>
  ))

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 1.5, sm: 1 },
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
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1.5, sm: 1 },
          flexDirection: { xs: 'column', sm: 'row' },
          flex: 1,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box sx={{ width: '100%', flex: 1 }}>
          <ReactDatePicker
            selected={dateRange.startDate}
            onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
            selectsStart
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            dateFormat="MMM dd, yyyy"
            placeholderText="Start Date"
            customInput={<CustomInput />}
            disabled={loading}
            popperClassName="date-picker-popper"
            popperModifiers={[
              {
                name: 'preventOverflow',
                options: {
                  mainAxis: true,
                  altAxis: true
                }
              }
            ]}
          />
        </Box>
        <Box sx={{ width: '100%', flex: 1 }}>
          <ReactDatePicker
            selected={dateRange.endDate}
            onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
            selectsEnd
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            minDate={dateRange.startDate}
            dateFormat="MMM dd, yyyy"
            placeholderText="End Date"
            customInput={<CustomInput />}
            disabled={loading}
            popperClassName="date-picker-popper"
            popperModifiers={[
              {
                name: 'preventOverflow',
                options: {
                  mainAxis: true,
                  altAxis: true
                }
              }
            ]}
          />
        </Box>
      </Box>
      <Button
        variant="contained"
        onClick={handleFetch}
        disabled={loading}
        sx={{
          height: '100%',
          minWidth: { xs: '100%', sm: '200px' },
          textTransform: 'none',
          fontSize: '1rem',
          py: 1.5,
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
    </Paper>
  )
}

export default DateRangePicker
