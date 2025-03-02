# ⌛ Hourglass

🚀 Your dream companion for turning Clockify time-tracking chaos into beautiful monthly reports! Say goodbye to manual calculations and hello to automated awesomeness.

## What's This Magic? ✨

Ever spent hours creating monthly time reports? Not anymore! Hourglass is your time-tracking superhero that:
- Creates gorgeous visual reports with just a few clicks
- Transforms boring time entries into beautiful charts
- Makes your monthly reporting actually fun (yes, really!)
- Saves you from Excel formula nightmares

## Features 🎯

- Smart date range picker for pinpoint accuracy
- Beautiful charts that make your time data look amazing
- One-click PDF report generation
- Instant project time summaries
- Seamless Clockify API integration

## Setup 🛠️

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Clockify API key:
   ```
   VITE_CLOCKIFY_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Getting Your Clockify API Key 🔑

1. Log in to your Clockify account
2. Go to Profile Settings
3. Generate an API key
4. Copy the API key and paste it in your `.env` file

## Environment Variables 🌳

- `VITE_CLOCKIFY_API_KEY`: Your Clockify API key (required for fetching your time entries)

## Technologies Used 💻

- React
- Vite
- Material-UI
- Axios
- date-fns
- React DatePicker
- Chart.js
- jsPDF

