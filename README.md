# Hourglass - Time Tracking Analytics

Hourglass is a powerful time tracking analytics application that helps you visualize and analyze your work hours from Clockify. It provides detailed insights into your time entries, project distribution, and earnings calculations.

> 📖 [View the complete User Guide](https://github.com/b-nicasio/hourglass/blob/main/docs/user-guide.md)

## Features

### Time Tracking Analytics
- **Daily Hours Visualization**: View your daily work hours through an intuitive bar chart
- **Project Distribution**: See how your time is distributed across different projects
- **Time Statistics**: Get detailed statistics about your work hours, including:
  - Total hours worked
  - Average hours per day
  - Billable vs. non-billable time
  - Project-specific breakdowns

### Date Range Selection
- **Flexible Date Selection**: Choose custom date ranges for analysis
- **Preset Periods**: Quick access to common time periods (Last 7 days, Last 30 days, etc.)
- **Monthly View**: Special view for analyzing monthly work patterns

### Earnings Calculations
- **Hourly Rate Tracking**: Set and track your hourly rates
- **Currency Conversion**: Support for USD to DOP conversion
- **Earnings Projections**: Calculate potential earnings based on billable days

### Report Generation
- **PDF Reports**: Generate detailed PDF reports of your time entries
- **Customizable Reports**: Include project breakdowns and earnings calculations
- **Easy Export**: Download reports for record-keeping or client billing

## Getting Started

### Prerequisites
- A Clockify account with an API key
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hourglass.git
   cd hourglass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory

3. Deploy using Docker:
   ```bash
   docker-compose up -d
   ```

## Usage Guide

### Initial Setup

1. When you first open the application, you'll be prompted to enter your Clockify API key
2. Enter your API key in the profile settings
3. The app will automatically fetch your user information and workspace details

### Profile Configuration

1. Click on your profile icon in the top-right corner
2. In the profile settings, you can:
   - Set your hourly rate
   - Configure USD to DOP conversion rate
   - Update your API key
   - Reset your settings if needed

### Viewing Time Entries

1. Select a date range using the date picker
2. View your time entries in the main table
3. Toggle between different views:
   - Daily hours chart
   - Project distribution chart
   - Detailed time entries list

### Generating Reports

1. Select your desired date range
2. Click the "Download Report" button
3. Choose your preferred report format
4. The report will be generated and downloaded automatically

## Development

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint to check code quality
- `npm run test`: Run tests
- `npm run test:coverage`: Run tests with coverage report

### Project Structure

```
hourglass/
├── src/
│   ├── components/     # React components
│   ├── services/       # API and utility services
│   └── App.jsx         # Main application component
├── public/            # Static assets
├── dist/             # Production build output
└── package.json      # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Material-UI
- Powered by Clockify API
- Charts powered by Chart.js
