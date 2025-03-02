import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectDistributionChart from './ProjectDistributionChart'

describe('ProjectDistributionChart', () => {
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

    render(<ProjectDistributionChart timeEntries={mockTimeEntries} />)

    // Check if the chart is rendered
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()

    // Check if the title is rendered
    expect(screen.getByText('Project Distribution')).toBeInTheDocument()
  })

  it('renders empty chart when no time entries provided', () => {
    render(<ProjectDistributionChart timeEntries={[]} />)

    // Chart should still render even with no data
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    expect(screen.getByText('Project Distribution')).toBeInTheDocument()
  })
})
