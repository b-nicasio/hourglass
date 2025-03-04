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

const getWorkspaces = async (apiKey) => {
  return makeRequest('/workspaces', apiKey)
}

// Keep this for backward compatibility 
const getWorkspace = async (apiKey) => {
  const workspaces = await getWorkspaces(apiKey)
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

  // Create PDF document with styling and compression
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true
  })

  const styles = {
    colors: {
      primary: [46, 125, 50],
      secondary: [66, 146, 70],
      text: [30, 41, 59],
      muted: [100, 116, 139],
      border: [226, 232, 240],
      background: [250, 250, 250]
    },
    fonts: {
      title: { size: 24, style: 'bold' },
      heading: { size: 16, style: 'bold' },
      subheading: { size: 14, style: 'bold' },
      normal: { size: 11, style: 'normal' },
      small: { size: 10, style: 'normal' },
      footer: { size: 8, style: 'normal' }
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

    doc.setDrawColor(...styles.colors.primary)
    doc.setLineWidth(0.5)
    doc.line(14, yPos + 2, 196, yPos + 2)

    return yPos + 15
  }

  const addMetadata = (yPos) => {
    doc.setFontSize(styles.fonts.normal.size)
    doc.setTextColor(...styles.colors.muted)
    doc.setFont(undefined, styles.fonts.normal.style)

    // Create a metadata box with light background
    doc.setFillColor(...styles.colors.background)
    doc.setDrawColor(...styles.colors.primary)
    doc.roundedRect(14, yPos - 5, 182, 70, 3, 3, 'FD')

    // Add title for the box
    doc.setFontSize(styles.fonts.subheading.size)
    doc.setTextColor(...styles.colors.text)
    doc.setFont(undefined, styles.fonts.subheading.style)
    doc.text('Report Summary', 20, yPos + 5)

    // Reset to normal text style
    doc.setFontSize(styles.fonts.normal.size)
    doc.setTextColor(...styles.colors.text)
    doc.setFont(undefined, styles.fonts.normal.style)

    // Left column
    doc.text(`Period: ${periodName}`, 20, yPos + 20)
    doc.text(`User: ${userName}`, 20, yPos + 30)

    try {
      // Safely format dates
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      // Validate dates
      if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
        doc.text(
          `Date Range: ${format(startDateObj, 'MMM d, yyyy')} - ${format(endDateObj, 'MMM d, yyyy')}`,
          20,
          yPos + 40
        )
      } else {
        doc.text(`Date Range: ${startDate} - ${endDate}`, 20, yPos + 40)
      }
    } catch {
      // Fallback if date formatting fails
      doc.text(`Date Range: ${startDate} - ${endDate}`, 20, yPos + 40)
    }

    // Right column - summary stats
    const totalHours = (totalDurationMs / 3600000).toFixed(2)
    const projectCount = Object.keys(projectGroups).length

    doc.text(`Total Time: ${formatDuration(totalDurationMs)}`, 110, yPos + 20)
    doc.text(`Total Hours: ${totalHours}h`, 110, yPos + 30)
    doc.text(`Projects: ${projectCount}`, 110, yPos + 40)

    // Add divider line between sections
    doc.setDrawColor(...styles.colors.border)
    doc.setLineWidth(0.2)
    doc.line(105, yPos, 105, yPos + 60)

    return yPos + 75
  }

  // Add footer to all pages
  const addFooter = (pageNumber, totalPages) => {
    doc.setDrawColor(...styles.colors.border)
    doc.setLineWidth(0.5)
    doc.line(14, 280, 196, 280)

    doc.setFontSize(styles.fonts.footer.size)
    doc.setTextColor(...styles.colors.muted)
    doc.setFont(undefined, styles.fonts.footer.style)

    // Left - App info
    doc.text('Generated by Hourglass - Time Tracking Analytics', 14, 287)

    // Center - Generation date
    const now = format(new Date(), "MMM d, yyyy 'at' h:mm a")
    const centerText = `Generated on ${now}`
    const centerX = (doc.internal.pageSize.width - doc.getStringUnitWidth(centerText) * 8 / doc.internal.scaleFactor) / 2
    doc.text(centerText, centerX, 287)

    // Right - Page numbers
    doc.text(`Page ${pageNumber} of ${totalPages}`, 196, 287, { align: 'right' })
  }

  // Generate charts for the PDF
  const generateCharts = async () => {
    // Create a temporary canvas for the daily hours chart
    const dailyHoursCanvas = document.createElement('canvas')
    dailyHoursCanvas.width = 800
    dailyHoursCanvas.height = 400
    document.body.appendChild(dailyHoursCanvas)

    try {
      // Group entries by date for daily hours chart
      const entriesByDate = timeEntries.reduce((acc, entry) => {
        try {
          if (!entry.timeInterval || !entry.timeInterval.start) return acc

          const startDate = new Date(entry.timeInterval.start)
          if (isNaN(startDate.getTime())) return acc

          const dateStr = format(startDate, 'MMM d, yyyy')
          if (!acc[dateStr]) acc[dateStr] = 0
          acc[dateStr] += entry.duration / 3600000 // Convert to hours
          return acc
        } catch {
          return acc
        }
      }, {})

      // Sort dates chronologically
      const sortedDates = Object.keys(entriesByDate).sort((a, b) => new Date(a) - new Date(b))
      const dailyHoursData = sortedDates.map(date => entriesByDate[date])

      // Create daily hours chart
      const dailyHoursChart = new ChartJS(dailyHoursCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: sortedDates,
          datasets: [{
            label: 'Hours',
            data: dailyHoursData,
            backgroundColor: 'rgba(46, 125, 50, 0.7)',
            borderColor: 'rgba(46, 125, 50, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Hours',
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.3)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date',
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                display: false
              }
            }
          },
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(46, 125, 50, 0.9)',
              titleFont: {
                weight: 'bold'
              },
              callbacks: {
                label: (context) => {
                  const value = context.raw || 0;
                  return `${value.toFixed(2)} hours`;
                }
              }
            }
          }
        }
      })

      // Wait for chart to render
      await new Promise(resolve => setTimeout(resolve, 300))

      // Get chart image
      const dailyHoursImage = dailyHoursCanvas.toDataURL('image/png', 1.0)

      // Clean up
      document.body.removeChild(dailyHoursCanvas)
      dailyHoursChart.destroy()

      return { dailyHoursImage }
    } catch {
      console.error('Error generating charts')

      // Clean up on error
      if (document.body.contains(dailyHoursCanvas)) {
        document.body.removeChild(dailyHoursCanvas)
      }

      return { dailyHoursImage: null }
    }
  }

  // Generate charts
  const { dailyHoursImage } = await generateCharts()

  // Generate Summary Page
  let yPos = addPageHeader('Time Report')
  yPos = addMetadata(yPos)

  // Add charts to the PDF if they were successfully generated
  if (dailyHoursImage) {
    yPos = addSectionTitle('Daily Hours Distribution', yPos + 10)
    doc.addImage(dailyHoursImage, 'PNG', 10, yPos, 190, 95)
    yPos += 105
  }

  // Project Summary Table
  yPos = addSectionTitle('Project Summary', yPos + 10)

  const summaryData = Object.entries(projectGroups)
    .map(([projectName, data]) => {
      const hours = (data.totalDuration / 3600000).toFixed(2)
      const percentage = ((data.totalDuration / totalDurationMs) * 100).toFixed(1)
      return [
        projectName,
        `${hours}h`,
        `${percentage}%`,
        formatDuration(data.totalDuration)
      ]
    })
    .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])); // Sort by hours (descending)

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
      fontStyle: styles.fonts.heading.style,
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    },
    margin: { top: 10 }
  })

  // Detailed Time Entries (New Page)
  doc.addPage()
  yPos = addPageHeader('Detailed Time Entries', 20)
  yPos = addSectionTitle('Daily Breakdown', yPos + 5)

  // Group entries by date
  const entriesByDate = timeEntries.reduce((acc, entry) => {
    try {
      // Check if timeInterval and start date exist
      if (!entry.timeInterval || !entry.timeInterval.start) {
        // If no valid start date, use a fallback category
        const fallbackDate = 'No Date'
        if (!acc[fallbackDate]) {
          acc[fallbackDate] = []
        }
        acc[fallbackDate].push(entry)
        return acc
      }

      // Try to parse the date safely
      const startDate = new Date(entry.timeInterval.start)
      // Check if the date is valid
      if (isNaN(startDate.getTime())) {
        // If invalid date, use a fallback category
        const fallbackDate = 'Invalid Date'
        if (!acc[fallbackDate]) {
          acc[fallbackDate] = []
        }
        acc[fallbackDate].push(entry)
        return acc
      }

      const date = format(startDate, 'MMM d, yyyy')
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(entry)
    } catch {
      // If any error occurs during date processing, use a fallback category
      const fallbackDate = 'Error Processing Date'
      if (!acc[fallbackDate]) {
        acc[fallbackDate] = []
      }
      acc[fallbackDate].push(entry)
    }
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

    // Check if we need a new page
    if (index > 0 && doc.lastAutoTable.finalY > 220) {
      doc.addPage()
      yPos = 20
      yPos = addPageHeader('Detailed Time Entries', yPos)
      yPos = addSectionTitle('Daily Breakdown (Continued)', yPos + 5)
    } else {
      yPos = (index === 0) ? yPos + 5 : (doc.lastAutoTable?.finalY || yPos) + 15
    }

    autoTable(doc, {
      startY: yPos,
      head: [[{ content: date, colSpan: 3 }]],
      body: entries.map(entry => [
        entry.projectName || 'No Project',
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
        fontStyle: styles.fonts.heading.style,
        textColor: [0, 0, 0]
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 30, halign: 'right' }
      },
      tableWidth: 'auto'
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

  try {
    // Safely format dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Validate dates
    let dateRangeText;
    if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
      dateRangeText = `Date Range: ${format(startDateObj, 'MMM d, yyyy')} - ${format(endDateObj, 'MMM d, yyyy')}`;
    } else {
      dateRangeText = `Date Range: ${startDate} - ${endDate}`;
    }

    const summaryItems = [
      `Average Hours per Day: ${avgHoursPerDay}h`,
      `Total Days: ${totalDays}`,
      `Number of Projects: ${projectCount}`,
      `Period: ${periodName}`,
      dateRangeText
    ]

    summaryItems.forEach((item, index) => {
      doc.text(item, 30, 120 + (index * 12))
    })
  } catch {
    // Fallback if there's an error
    const summaryItems = [
      `Average Hours per Day: ${avgHoursPerDay}h`,
      `Total Days: ${totalDays}`,
      `Number of Projects: ${projectCount}`,
      `Period: ${periodName}`,
      `Date Range: ${startDate} - ${endDate}`
    ]

    summaryItems.forEach((item, index) => {
      doc.text(item, 30, 120 + (index * 12))
    })
  }

  // Add footer to all pages
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    addFooter(i, pageCount)
  }

  return doc
}

// Main report download function
const downloadReport = async (workspaceId, userId, startDate, endDate, userName, periodName, apiKey) => {
  try {
    // Show loading indicator
    const loadingToast = document.createElement('div');
    loadingToast.style.position = 'fixed';
    loadingToast.style.top = '20px';
    loadingToast.style.right = '20px';
    loadingToast.style.backgroundColor = '#2563eb';
    loadingToast.style.color = 'white';
    loadingToast.style.padding = '12px 20px';
    loadingToast.style.borderRadius = '8px';
    loadingToast.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    loadingToast.style.zIndex = '9999';
    loadingToast.style.display = 'flex';
    loadingToast.style.alignItems = 'center';
    loadingToast.style.gap = '10px';

    // Add spinner
    const spinner = document.createElement('div');
    spinner.style.width = '20px';
    spinner.style.height = '20px';
    spinner.style.borderRadius = '50%';
    spinner.style.border = '3px solid rgba(255, 255, 255, 0.3)';
    spinner.style.borderTopColor = 'white';
    spinner.style.animation = 'spin 1s linear infinite';

    // Add animation
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);

    loadingToast.appendChild(spinner);
    loadingToast.appendChild(document.createTextNode('Generating PDF report...'));
    document.body.appendChild(loadingToast);

    // Fetch time entries and generate PDF
    const timeEntries = await getTimeEntries(workspaceId, userId, startDate, endDate, apiKey);
    const doc = await generatePDFReport(timeEntries, userName, periodName, startDate, endDate);

    // Save the PDF with optimized compression
    const filename = `Clockify_Report_${userName.replace(/\s+/g, '')}_${periodName.replace(/\s+/g, '')}.pdf`;
    doc.save(filename);

    // Remove loading indicator
    document.body.removeChild(loadingToast);
    document.head.removeChild(style);

    // Show success message
    const successToast = document.createElement('div');
    successToast.style.position = 'fixed';
    successToast.style.top = '20px';
    successToast.style.right = '20px';
    successToast.style.backgroundColor = '#059669';
    successToast.style.color = 'white';
    successToast.style.padding = '12px 20px';
    successToast.style.borderRadius = '8px';
    successToast.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    successToast.style.zIndex = '9999';

    successToast.textContent = 'PDF report generated successfully!';
    document.body.appendChild(successToast);

    // Remove success message after 3 seconds
    setTimeout(() => {
      document.body.removeChild(successToast);
    }, 3000);

  } catch (error) {
    console.error('Error generating PDF report:', error);

    // Remove loading indicator if it exists
    const loadingToast = document.querySelector('div[style*="Generating PDF report"]');
    if (loadingToast) {
      document.body.removeChild(loadingToast);
      const style = document.querySelector('style[textContent*="@keyframes spin"]');
      if (style) document.head.removeChild(style);
    }

    // Show error message
    const errorToast = document.createElement('div');
    errorToast.style.position = 'fixed';
    errorToast.style.top = '20px';
    errorToast.style.right = '20px';
    errorToast.style.backgroundColor = '#dc2626';
    errorToast.style.color = 'white';
    errorToast.style.padding = '12px 20px';
    errorToast.style.borderRadius = '8px';
    errorToast.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    errorToast.style.zIndex = '9999';

    errorToast.textContent = `Error generating PDF: ${error.message || 'Unknown error'}`;
    document.body.appendChild(errorToast);

    // Remove error message after 5 seconds
    setTimeout(() => {
      document.body.removeChild(errorToast);
    }, 5000);
  }
}

export default {
  getUserInfo,
  getWorkspaces,
  getWorkspace,
  getTimeEntries,
  getProjects,
  downloadReport
}
