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
    border-radius: 8px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  }
  .react-datepicker__header {
    background-color: #1976d2;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    padding-top: 12px;
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
    border-radius: 50%;
  }
  .react-datepicker__day--in-range {
    background-color: #1976d215;
  }
  .react-datepicker__day--in-selecting-range {
    background-color: #1976d230;
  }
  .react-datepicker__day:hover {
    border-radius: 50%;
  }
  .react-datepicker__navigation {
    top: 12px;
  }
  .react-datepicker__navigation-icon::before {
    border-color: white;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #1976d2;
    border-radius: 50%;
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
        minWidth: '200px',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        '&:hover': {
          backgroundColor: theme.palette.grey[50],
        },
        textTransform: 'none',
        color: theme.palette.text.primary,
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
        gap: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2]
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          flex: 1
        }}
      >
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
        />
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
        />
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
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
      >
        {loading ? 'Loading...' : 'Fetch Time Entries'}
      </Button>
    </Paper>
  )
}

export default DateRangePicker
