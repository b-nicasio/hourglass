import { parse } from 'date-fns'

// Billing Year Configuration
// Change this value to update all billing periods at once
export const BILLING_YEAR = 2025

// Billing Periods Configuration
// Format: MM/DD/YYYY
// Each period consists of:
// - id: unique identifier for the period
// - month: display name for the month
// - billableDays: number of billable days in the period
// - startDate: start date of the billing period
// - endDate: end date of the billing period

export const billingPeriods = [
  {
    id: 'jan-2025',
    month: 'January',
    billableDays: 23,
    startDate: parse(`12/27/${BILLING_YEAR-1}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`1/28/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'feb-2025',
    month: 'February',
    billableDays: 20,
    startDate: parse(`1/29/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`2/25/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'mar-2025',
    month: 'March',
    billableDays: 21,
    startDate: parse(`2/26/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`3/26/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'apr-2025',
    month: 'April',
    billableDays: 22,
    startDate: parse(`3/27/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`4/25/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'may-2025',
    month: 'May',
    billableDays: 22,
    startDate: parse(`4/28/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`5/27/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'jun-2025',
    month: 'June',
    billableDays: 21,
    startDate: parse(`5/28/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`6/25/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'jul-2025',
    month: 'July',
    billableDays: 23,
    startDate: parse(`6/26/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`7/28/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'aug-2025',
    month: 'August',
    billableDays: 21,
    startDate: parse(`7/29/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`8/26/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'sep-2025',
    month: 'September',
    billableDays: 22,
    startDate: parse(`8/27/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`9/25/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'oct-2025',
    month: 'October',
    billableDays: 23,
    startDate: parse(`9/26/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`10/28/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'nov-2025',
    month: 'November',
    billableDays: 20,
    startDate: parse(`10/29/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`11/25/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  },
  {
    id: 'dec-2025',
    month: 'December',
    billableDays: 23,
    startDate: parse(`11/26/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date()),
    endDate: parse(`12/26/${BILLING_YEAR}`, 'MM/dd/yyyy', new Date())
  }
]

// Helper function to get the billing year
export const getBillingYear = () => BILLING_YEAR
