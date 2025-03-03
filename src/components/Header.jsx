import React from 'react'
import {
  Box,
  Typography,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  Button,
  Link
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

function Header({ userInfo, workspace, onProfileClick }) {
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top row - Logo and title with profile card */}
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', width: '100%', mb: 2 }}>
        {/* Left side - Logo and Title */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: '100px', // Add height to the container
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HourglassEmptyIcon
                sx={{
                  fontSize: '2.5rem',
                  color: 'white',
                  animation: 'flip 2s infinite',
                  '@keyframes flip': {
                    '0%': {
                      transform: 'rotate(0deg)',
                    },
                    '100%': {
                      transform: 'rotate(360deg)',
                    },
                  },
                }}
              />
            </Box>
            <Typography variant="h3" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
              Hourglass
            </Typography>
          </Box>
        </Box>

        {/* Right side - Profile and Workspace Info */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            minWidth: '320px',
            background: 'white',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Settings at the top */}
            <Button
              onClick={onProfileClick}
              variant="text"
              startIcon={<PersonIcon sx={{ fontSize: 16 }} />}
              sx={{
                justifyContent: 'flex-start',
                color: 'text.primary',
                backgroundColor: theme.palette.grey[50],
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                py: 0.75,
                px: 1,
                borderRadius: 1.5,
                minHeight: 0,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                },
                '& .MuiSvgIcon-root': {
                  color: theme.palette.primary.main
                }
              }}
            >
              Profile Settings
            </Button>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Profile info */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.675rem',
                    display: 'block',
                    mb: 0.5
                  }}
                >
                  Profile
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    py: 0.75,
                    px: 1,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1.5,
                    color: 'white'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                    {userInfo?.name || 'Loading...'}
                  </Typography>
                </Box>
              </Box>

              {/* Workspace info */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.675rem',
                    display: 'block',
                    mb: 0.5
                  }}
                >
                  Workspace
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    py: 0.75,
                    px: 1,
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 1.5,
                    color: 'white'
                  }}
                >
                  <WorkspacesIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                    {workspace?.name || 'Loading...'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Description row - Below logo and title */}
      <Box sx={{ maxWidth: '800px', mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            fontSize: '1.25rem',
            lineHeight: 1.6,
          }}
        >
          Transform your Clockify data into clear, actionable insights. Track time, analyze projects, and export reports with ease.{' '}
          <Link
            href="https://github.com/b-nicasio/hourglass/blob/main/docs/user-guide.md"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Learn how to use it
            <HelpOutlineIcon sx={{ fontSize: '1.25rem' }} />
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default Header
