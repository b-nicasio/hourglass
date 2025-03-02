import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const BASE_URL = 'https://api.clockify.me/api/v1'

// API request helper
const makeRequest = async (endpoint, apiKey, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

// User and workspace functions
const getUserInfo = async (apiKey) => {
  return makeRequest('/user', apiKey)
}

const getWorkspace = async (apiKey) => {
  const workspaces = await makeRequest('/workspaces', apiKey)
  return workspaces[0]
}

const getProjects = async (workspaceId, apiKey) => {
  const queryParams = new URLSearchParams({
    archived: 'false',
    'page-size': '500'
  }).toString()

  return makeRequest(`/workspaces/${workspaceId}/projects?${queryParams}`, apiKey)
}

// Time parsing helpers
const parseDuration = (duration) => {
  if (!duration) return 0

  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!matches) return 0

  const hours = parseInt(matches[1] || 0)
  const minutes = parseInt(matches[2] || 0)
  const seconds = parseInt(matches[3] || 0)

  return (hours * 3600 + minutes * 60 + seconds) * 1000
}

const formatDuration = (milliseconds) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

// Time entries retrieval
const getTimeEntries = async (workspaceId, userId, startDate, endDate, apiKey) => {
  const projects = await getProjects(workspaceId, apiKey)
  const projectMap = projects.reduce((map, project) => {
    map[project.id] = {
      name: project.name,
      color: project.color || '#666666'
    }
    return map
  }, {})

  const endpoint = `/workspaces/${workspaceId}/user/${userId}/time-entries`
  const queryParams = new URLSearchParams({
    start: new Date(startDate + 'T00:00:00Z').toISOString(),
    end: new Date(endDate + 'T23:59:59Z').toISOString(),
    'page-size': '1000',
    hydrated: 'true'
  }).toString()

  const timeEntries = await makeRequest(`${endpoint}?${queryParams}`, apiKey)

  return timeEntries.map(entry => {
    let duration = 0

    if (entry.timeInterval && entry.timeInterval.start && entry.timeInterval.end) {
      duration = new Date(entry.timeInterval.end) - new Date(entry.timeInterval.start)
    } else if (entry.duration) {
      duration = parseDuration(entry.duration)
    }

    const baseEntry = {
      ...entry,
      duration,
      projectName: 'No Project',
      projectColor: '#666666'
    }

    if (entry.projectId && projectMap[entry.projectId]) {
      const projectDetails = projectMap[entry.projectId]
      return {
        ...baseEntry,
        projectName: projectDetails.name,
        projectColor: projectDetails.color
      }
    }

    return baseEntry
  })
}

// PDF Report Generation
const generatePDFReport = async (timeEntries, userName, periodName, startDate, endDate) => {
  // Group entries by project
  const projectGroups = timeEntries.reduce((groups, entry) => {
    const projectName = entry.projectName || 'No Project'
    if (!groups[projectName]) {
      groups[projectName] = {
        entries: [],
        totalDuration: 0,
        color: entry.projectColor || '#666666'
      }
    }
    groups[projectName].entries.push(entry)
    groups[projectName].totalDuration += entry.duration
    return groups
  }, {})

  const totalDurationMs = Object.values(projectGroups)
    .reduce((total, project) => total + project.totalDuration, 0)

  // Create PDF document with styling
  const doc = new jsPDF()
  const styles = {
    colors: {
      primary: [46, 125, 50],
      text: [30, 41, 59],
      muted: [100, 116, 139],
      border: [226, 232, 240]
    },
    fonts: {
      title: { size: 24, style: 'bold' },
      heading: { size: 16, style: 'bold' },
      normal: { size: 11, style: 'normal' },
      small: { size: 10, style: 'normal' }
    }
  }

  // Helper functions for PDF generation
  const addPageHeader = (title, yPos = 20) => {
    doc.setFontSize(styles.fonts.title.size)
    doc.setTextColor(...styles.colors.primary)
    doc.setFont(undefined, styles.fonts.title.style)
    doc.text(title, 14, yPos)
    return yPos + 15
  }

  const addSectionTitle = (text, yPos) => {
    doc.setFontSize(styles.fonts.heading.size)
    doc.setTextColor(...styles.colors.text)
    doc.setFont(undefined, styles.fonts.heading.style)
    doc.text(text, 14, yPos)

    doc.setDrawColor(...styles.colors.border)
    doc.setLineWidth(0.5)
    doc.line(14, yPos + 2, 196, yPos + 2)

    return yPos + 15
  }

  const addMetadata = (yPos) => {
    doc.setFontSize(styles.fonts.normal.size)
    doc.setTextColor(...styles.colors.muted)
    doc.setFont(undefined, styles.fonts.normal.style)

    doc.text(`Period: ${periodName}`, 14, yPos)
    doc.text(`User: ${userName}`, 14, yPos + 7)
    doc.text(
      `Date Range: ${format(new Date(startDate), 'MMM d, yyyy')} - ${format(new Date(endDate), 'MMM d, yyyy')}`,
      14,
      yPos + 14
    )

    return yPos + 25
  }

  // Generate Summary Page
  let yPos = addPageHeader('Time Report')
  yPos = addMetadata(yPos)
  yPos = addSectionTitle('Project Summary', yPos + 10)

  // Project Summary Table
  const summaryData = Object.entries(projectGroups).map(([projectName, data]) => {
    const hours = (data.totalDuration / 3600000).toFixed(2)
    const percentage = ((data.totalDuration / totalDurationMs) * 100).toFixed(1)
    return [
      projectName,
      `${hours}h`,
      `${percentage}%`,
      formatDuration(data.totalDuration)
    ]
  })

  autoTable(doc, {
    startY: yPos,
    head: [['Project', 'Hours', '%', 'Duration']],
    body: summaryData,
    foot: [[
      'Total',
      (totalDurationMs / 3600000).toFixed(2) + 'h',
      '100%',
      formatDuration(totalDurationMs)
    ]],
    theme: 'grid',
    headStyles: {
      fillColor: styles.colors.primary,
      fontSize: styles.fonts.normal.size,
      fontStyle: styles.fonts.heading.style,
      cellPadding: 5
    },
    bodyStyles: {
      fontSize: styles.fonts.small.size,
      cellPadding: 4
    },
    footStyles: {
      fillColor: [245, 245, 245],
      fontSize: styles.fonts.normal.size,
      fontStyle: styles.fonts.heading.style
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    margin: { top: 10 }
  })

  // Detailed Time Entries (New Page)
  doc.addPage()
  yPos = addPageHeader('Detailed Time Entries', 20)

  // Group entries by date
  const entriesByDate = timeEntries.reduce((acc, entry) => {
    const date = format(new Date(entry.timeInterval.start), 'MMM d, yyyy')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(entry)
    return acc
  }, {})

  // Sort dates
  const sortedDates = Object.keys(entriesByDate).sort((a, b) =>
    new Date(a) - new Date(b)
  )

  // Add entries for each date
  sortedDates.forEach((date, index) => {
    const entries = entriesByDate[date]
    const dailyTotal = entries.reduce((sum, entry) => sum + entry.duration, 0)

    if (index > 0 && doc.lastAutoTable.finalY > 220) {
      doc.addPage()
      yPos = 20
    } else {
      yPos = (doc.lastAutoTable?.finalY || yPos) + 15
    }

    autoTable(doc, {
      startY: yPos,
      head: [[{ content: date, colSpan: 3 }]],
      body: entries.map(entry => [
        entry.projectName,
        entry.description || 'No description',
        formatDuration(entry.duration)
      ]),
      foot: [[
        { content: 'Daily Total', colSpan: 2 },
        formatDuration(dailyTotal)
      ]],
      theme: 'grid',
      headStyles: {
        fillColor: styles.colors.primary,
        fontSize: styles.fonts.normal.size,
        fontStyle: styles.fonts.heading.style
      },
      bodyStyles: {
        fontSize: styles.fonts.small.size
      },
      footStyles: {
        fillColor: [245, 245, 245],
        fontSize: styles.fonts.normal.size,
        fontStyle: styles.fonts.heading.style
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 100 },
        2: { cellWidth: 40 }
      }
    })
  })

  // Final Summary Page
  doc.addPage()
  yPos = addPageHeader('Time Summary', 20)

  // Add total time in a prominent way
  doc.setFontSize(20)
  doc.setTextColor(...styles.colors.primary)
  doc.setFont(undefined, 'bold')

  const totalTimeText = `Total Time: ${formatDuration(totalDurationMs)}`
  const totalHoursText = `Total Hours: ${(totalDurationMs / 3600000).toFixed(2)}h`

  doc.text(totalTimeText, doc.internal.pageSize.width / 2, 60, { align: 'center' })
  doc.text(totalHoursText, doc.internal.pageSize.width / 2, 75, { align: 'center' })

  // Add summary box
  doc.setDrawColor(...styles.colors.border)
  doc.setFillColor(250, 250, 250)
  doc.roundedRect(20, 100, doc.internal.pageSize.width - 40, 80, 3, 3, 'FD')

  // Add summary details
  doc.setFontSize(styles.fonts.normal.size)
  doc.setTextColor(...styles.colors.text)
  doc.setFont(undefined, styles.fonts.normal.style)

  const avgHoursPerDay = (totalDurationMs / (sortedDates.length * 3600000)).toFixed(2)
  const totalDays = sortedDates.length
  const projectCount = Object.keys(projectGroups).length

  const summaryItems = [
    `Average Hours per Day: ${avgHoursPerDay}h`,
    `Total Days: ${totalDays}`,
    `Number of Projects: ${projectCount}`,
    `Period: ${periodName}`,
    `Date Range: ${format(new Date(startDate), 'MMM d, yyyy')} - ${format(new Date(endDate), 'MMM d, yyyy')}`
  ]

  summaryItems.forEach((item, index) => {
    doc.text(item, 30, 120 + (index * 12))
  })

  // Add footer to all pages
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    doc.setDrawColor(...styles.colors.border)
    doc.setLineWidth(0.5)
    doc.line(14, 280, 196, 280)

    doc.setFontSize(8)
    doc.setTextColor(...styles.colors.muted)
    doc.setFont(undefined, 'normal')

    // Left - App info
    doc.text('Generated by Hourglass - Time Tracking Analytics', 14, 287)

    // Center - Generation date
    const now = format(new Date(), "MMM d, yyyy 'at' h:mm a")
    const centerText = `Generated on ${now}`
    const centerX = (doc.internal.pageSize.width - doc.getStringUnitWidth(centerText) * 8 / doc.internal.scaleFactor) / 2
    doc.text(centerText, centerX, 287)

    // Right - Page numbers
    doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: 'right' })
  }

  return doc
}

// Main report download function
const downloadReport = async (workspaceId, userId, startDate, endDate, userName, periodName, apiKey) => {
  try {
    const timeEntries = await getTimeEntries(workspaceId, userId, startDate, endDate, apiKey)
    const doc = await generatePDFReport(timeEntries, userName, periodName, startDate, endDate)
    doc.save(`Clockify_Report_${userName.replace(/\s+/g, '')}_${periodName.replace(/\s+/g, '')}.pdf`)
  } catch (error) {
    console.error('Error generating report:', error)
    throw new Error('Failed to generate time tracking report')
  }
}

export default {
  getUserInfo,
  getWorkspace,
  getTimeEntries,
  getProjects,
  downloadReport
}
