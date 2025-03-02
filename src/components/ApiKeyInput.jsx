import React, { useState } from 'react'
import {
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  Link,
  Alert
} from '@mui/material'
import KeyIcon from '@mui/icons-material/Key'

function ApiKeyInput({ onApiKeySubmit, error }) {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('clockifyApiKey') || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (apiKey.trim()) {
      localStorage.setItem('clockifyApiKey', apiKey.trim())
      onApiKeySubmit(apiKey.trim())
    }
  }

  const handleClear = () => {
    localStorage.removeItem('clockifyApiKey')
    setApiKey('')
    onApiKeySubmit('')
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <KeyIcon color="primary" />
        Enter your Clockify API Key
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        To use Hourglass, you need to provide your Clockify API key. You can find it in your{' '}
        <Link
          href="https://app.clockify.me/user/settings"
          target="_blank"
          rel="noopener noreferrer"
        >
          Clockify Profile Settings
        </Link>.
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
            variant="outlined"
            size="small"
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!apiKey.trim()}
          >
            Connect
          </Button>
          {apiKey && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
        </Box>
      </form>

      <Alert severity="info" sx={{ mt: 2 }}>
        Your API key is stored securely in your browser's local storage and is never sent to any server except Clockify.
      </Alert>
    </Paper>
  )
}

export default ApiKeyInput
