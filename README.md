# ⌛ Hourglass

🚀 Your dream companion for turning Clockify time-tracking chaos into beautiful monthly reports! Say goodbye to manual calculations and hello to automated awesomeness.

## What's This Magic? ✨

Ever spent hours creating monthly time reports? Not anymore! Hourglass is your time-tracking superhero that:
- Creates gorgeous visual reports with just a few clicks
- Transforms boring time entries into beautiful charts
- Makes your monthly reporting actually fun (yes, really!)
- Saves you from Excel formula nightmares
- Calculates earnings in both USD and DOP currencies

## Features 🎯

- Smart date range picker for pinpoint accuracy
- Beautiful charts that make your time data look amazing
- One-click PDF report generation
- Instant project time summaries
- Seamless Clockify API integration
- Multi-currency earnings calculation (USD & DOP)
- Customizable billing periods
- Project time distribution visualization
- Daily hours tracking

## Setup 🛠️

### Local Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Deployment

1. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```
   This will start the application on port 80.

2. Or build and run manually:
   ```bash
   docker build -t hourglass .
   docker run -p 80:80 hourglass
   ```

## Testing 🧪

The project uses Vitest and React Testing Library for testing. Available test commands:

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Billing Periods Configuration 📅

Billing periods are configured in `src/config/billingPeriods.js`. To update the billing periods:

1. Change the `BILLING_YEAR` constant to update all billing periods at once
2. Each billing period contains:
   - id: unique identifier (e.g., 'jan-2025')
   - month: display name
   - billableDays: number of billable days
   - startDate: period start date
   - endDate: period end date


## Profile Configuration 👤

Configure your profile settings in the app:
- Add your Clockify API Key
- Set your name
- Configure hourly rate in USD
- Set USD to DOP conversion rate for earnings calculation

## Technologies Used 💻

- React 18
- Vite
- Material-UI
- Vitest & React Testing Library
- Chart.js
- date-fns
- Axios
- jsPDF
- Docker & Nginx

## Development Commands 🛠

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```
