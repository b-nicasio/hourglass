import React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Box
} from '@mui/material'
import { format } from 'date-fns'
import { billingPeriods, getBillingYear } from '../config/billingPeriods'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

function DateRangeTable({ onSelectRange }) {
  const theme = useTheme()

  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main + '10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
        <CalendarTodayIcon color="primary" />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          {getBillingYear()} Billing Periods
        </Typography>
      </Box>
      <TableContainer
        sx={{
          maxHeight: 'calc(100vh - 300px)',
          overflowY: 'auto',
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.paper}`,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.paper,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
          '& .MuiTable-root': {
            minWidth: '460px',
            width: '100%'
          }
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: '120px',
                  backgroundColor: theme.palette.background.paper,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  textAlign: 'center'
                }}
              >
                Periods
              </TableCell>
              <TableCell
                sx={{
                  width: '100px',
                  backgroundColor: theme.palette.background.paper,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  textAlign: 'center'
                }}
              >
                Billing Days
              </TableCell>
              <TableCell
                sx={{
                  width: '100px',
                  backgroundColor: theme.palette.background.paper,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  textAlign: 'center'
                }}
              >
                Total Hours
              </TableCell>
              <TableCell
                sx={{
                  width: '140px',
                  backgroundColor: theme.palette.background.paper,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  textAlign: 'center'
                }}
              >
                Date Range
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billingPeriods.map((range) => (
              <TableRow
                key={range.id}
                hover
                onClick={() => onSelectRange(
                  { startDate: range.startDate, endDate: range.endDate },
                  range.billableDays,
                  range.month
                )}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}15`,
                    '& .MuiTableCell-root': {
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      transform: 'translateX(6px)'
                    }
                  },
                  '&:last-child td': {
                    borderBottom: 0
                  }
                }}
              >
                <TableCell
                  sx={{
                    py: 1.75,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.2s ease-in-out',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center'
                  }}
                >
                  {range.month}
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.75,
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease-in-out',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center'
                  }}
                >
                  {range.billableDays}
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.75,
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease-in-out',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    textAlign: 'center'
                  }}
                >
                  {range.billableDays * 8}h
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.75,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.2s ease-in-out',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center'
                  }}
                >
                  {format(range.startDate, 'MMM d')} - {format(range.endDate, 'MMM d')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default DateRangeTable
