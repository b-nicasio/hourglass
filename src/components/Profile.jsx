import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  Alert,
  Stack,
  Paper,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyIcon from '@mui/icons-material/Key'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PaidIcon from '@mui/icons-material/Paid'

const defaultProfile = {
  name: '',
  hourlyRate: '',
  usdToDopRate: ''
}

function Profile({ open, onClose, apiKey, onApiKeyChange, onResetApiKey }) {
  const theme = useTheme()
  const [profile, setProfile] = useState(defaultProfile)
  const [newApiKey, setNewApiKey] = useState(apiKey || '')
  const [error, setError] = useState(null)

  useEffect(() => {
    const savedProfile = localStorage.getItem('hourglassProfile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  useEffect(() => {
    setNewApiKey(apiKey || '')
  }, [apiKey])

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      hourlyRate: Number(profile.hourlyRate),
      usdToDopRate: Number(profile.usdToDopRate)
    }
    localStorage.setItem('hourglassProfile', JSON.stringify(updatedProfile))

    if (newApiKey !== apiKey) {
      onApiKeyChange(newApiKey)
    }

    onClose(updatedProfile)
  }

  const handleResetProfile = () => {
    localStorage.removeItem('hourglassProfile')
    localStorage.removeItem('clockifyApiKey')
    onResetApiKey()
    setProfile(defaultProfile)
    setNewApiKey('')
    setError(null)
    onClose(null)
    window.location.reload()
  }

  const isProfileComplete = profile.name && profile.hourlyRate && profile.usdToDopRate && newApiKey

  const SectionTitle = ({ icon, title, subtitle }) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon}
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  )

  return (
    <Dialog
      open={open}
      onClose={() => onClose(null)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            Profile Settings
          </Typography>
          <IconButton
            onClick={() => onClose(null)}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: theme.palette.error.main + '10',
                color: 'error.main'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, #2563eb08 0%, #7c3aed08 100%)',
              border: '1px solid',
              borderColor: 'primary.light',
              borderRadius: '12px',
            }}
          >
            <SectionTitle
              icon={<KeyIcon sx={{ color: 'primary.main' }} />}
              title="Clockify Integration"
              subtitle="Connect your Clockify account to start tracking time and analyzing your work patterns."
            />
            <TextField
              fullWidth
              size="small"
              label="Clockify API Key"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              type="password"
              helperText="Your API key will be securely stored in your browser"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper'
                }
              }}
            />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #7c3aed08 0%, #2563eb08 100%)',
              border: '1px solid',
              borderColor: 'secondary.light',
              borderRadius: '12px',
            }}
          >
            <SectionTitle
              icon={<PaidIcon sx={{ color: 'secondary.main' }} />}
              title="Earnings Configuration"
              subtitle="Set up your rates to track earnings in both USD and DOP currencies."
            />
            <Stack spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="Your Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper'
                  }
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Hourly Rate (USD)"
                type="number"
                value={profile.hourlyRate}
                onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary', fontSize: '0.875rem' }}>$</Typography>
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper'
                  }
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="USD to DOP Rate"
                type="number"
                value={profile.usdToDopRate}
                onChange={(e) => setProfile({ ...profile, usdToDopRate: e.target.value })}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary', fontSize: '0.875rem' }}>RD$</Typography>
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper'
                  }
                }}
              />
            </Stack>
          </Paper>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 3,
              borderRadius: '8px'
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            onClick={handleResetProfile}
            color="error"
            startIcon={<DeleteIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              fontSize: '0.875rem'
            }}
          >
            Reset All Settings
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={() => onClose(null)}
            size="small"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: theme.palette.grey[100]
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!isProfileComplete}
            size="small"
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              fontSize: '0.875rem',
              px: 3
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default Profile
