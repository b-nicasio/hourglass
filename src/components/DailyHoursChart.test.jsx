import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DailyHoursChart from './DailyHoursChart'

describe('DailyHoursChart', () => {
  it('renders with provided time entries', () => {
    const mockTimeEntries = [
      {
        timeInterval: { start: '2024-03-20T09:00:00Z' },
        duration: 28800000, // 8 hours in milliseconds
        projectName: 'Project A',
        description: 'Task 1'
      },
      {
        timeInterval: { start: '2024-03-21T09:00:00Z' },
        duration: 21600000, // 6 hours in milliseconds
        projectName: 'Project B',
        description: 'Task 2'
      }
    ]

    render(<DailyHoursChart timeEntries={mockTimeEntries} />)

    // Check if the chart is rendered
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()

    // Check if the title is rendered
    expect(screen.getByText('Daily Hours Distribution')).toBeInTheDocument()
  })

  it('renders empty chart when no time entries provided', () => {
    render(<DailyHoursChart timeEntries={[]} />)

    // Chart should still render even with no data
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByText('Daily Hours Distribution')).toBeInTheDocument()
  })
})
