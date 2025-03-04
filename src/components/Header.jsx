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
  Link,
  Select,
  MenuItem,
  FormControl
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

function Header({ userInfo, workspace, workspaces = [], onWorkspaceChange, onProfileClick }) {
  const theme = useTheme()
  const hasMultipleWorkspaces = workspaces.length > 1

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top row - Logo and title with profile card */}
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', width: '100%', mb: 1.5 }}>
        {/* Left side - Logo and Title */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            minHeight: '100px',
            pl: 1,
            pt: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 'auto'
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #47a9ff 0%, #0071e3 100%)',
                boxShadow: '0px 4px 10px rgba(0, 113, 227, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
                  opacity: 0.7,
                },
              }}
            >
              <HourglassEmptyIcon
                sx={{
                  fontSize: '2.5rem',
                  color: 'white',
                  position: 'relative',
                  zIndex: 1,
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
            <Typography
              variant="h3"
              component="h1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1d1d1f 30%, #6e6e73 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              Hourglass
            </Typography>
          </Box>
        </Box>

        {/* Right side - Profile and Workspace Info */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            minWidth: '320px',
            background: theme.palette.background.paper,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(0,199,190,0.08) 0%, rgba(0,199,190,0) 70%)',
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, position: 'relative', zIndex: 1 }}>
            {/* Settings button */}
            <Button
              onClick={onProfileClick}
              variant="outlined"
              startIcon={<PersonIcon />}
              sx={{
                justifyContent: 'flex-start',
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                backgroundColor: 'rgba(245, 245, 247, 0.8)',
                borderRadius: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #47a9ff 0%, #0071e3 100%)',
                  color: 'white',
                  borderColor: 'transparent',
                  boxShadow: '0px 4px 10px rgba(0, 113, 227, 0.2)',
                }
              }}
            >
              Profile Settings
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Profile info */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    display: 'block',
                    mb: 0.75
                  }}
                >
                  Profile
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 1,
                    px: 1.5,
                    background: 'linear-gradient(135deg, #47a9ff 0%, #0071e3 100%)',
                    borderRadius: 1,
                    color: 'white',
                    boxShadow: '0px 2px 6px rgba(0, 113, 227, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to bottom right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                    }
                  }}
                >
                  <PersonIcon sx={{ fontSize: 18 }} />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      maxWidth: '110px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {userInfo?.name || 'Loading...'}
                  </Typography>
                </Box>
              </Box>

              {/* Workspace info */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    display: 'block',
                    mb: 0.75
                  }}
                >
                  Workspace
                </Typography>
                {!hasMultipleWorkspaces ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1,
                      px: 1.5,
                      background: 'linear-gradient(135deg, #5e5ce6 0%, #4A48B9 100%)',
                      borderRadius: 1,
                      color: 'white',
                      boxShadow: '0px 2px 6px rgba(94, 92, 230, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                      }
                    }}
                  >
                    <WorkspacesIcon sx={{ fontSize: 18 }} />
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        maxWidth: '110px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {workspace?.name || 'Loading...'}
                    </Typography>
                  </Box>
                ) : (
                  <FormControl 
                    fullWidth
                    size="small"
                    sx={{
                      '.MuiOutlinedInput-root': {
                        borderRadius: 1,
                        color: 'white',
                        background: 'linear-gradient(135deg, #5e5ce6 0%, #4A48B9 100%)',
                        boxShadow: '0px 2px 6px rgba(94, 92, 230, 0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                          zIndex: 0
                        },
                      },
                      '.MuiSelect-select': {
                        paddingLeft: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        position: 'relative',
                        zIndex: 1
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '.MuiSvgIcon-root': {
                        color: 'white'
                      }
                    }}
                  >
                    <Select
                      value={workspace?.id || ''}
                      onChange={onWorkspaceChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WorkspacesIcon sx={{ fontSize: 18 }} />
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.875rem',
                              maxWidth: '110px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {workspaces.find(ws => ws.id === selected)?.name || 'Loading...'}
                          </Typography>
                        </Box>
                      )}
                      inputProps={{
                        MenuProps: {
                          sx: {
                            '& .MuiPaper-root': {
                              borderRadius: 1,
                              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                            },
                          }
                        }
                      }}
                    >
                      {workspaces.map((ws) => (
                        <MenuItem key={ws.id} value={ws.id}>
                          {ws.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Description row - Below logo and title */}
      <Box sx={{ maxWidth: '800px', mb: 4, mt: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.secondary,
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
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 500,
              position: 'relative',
              '&:hover': {
                textDecoration: 'none',
                '&::after': {
                  transform: 'scaleX(1)',
                  transformOrigin: 'bottom left',
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                transform: 'scaleX(0)',
                height: '2px',
                bottom: -2,
                left: 0,
                background: 'linear-gradient(90deg, #47a9ff 0%, #0071e3 100%)',
                transformOrigin: 'bottom right',
                transition: 'transform 0.3s ease-out'
              }
            }}
          >
            Learn how to use it
            <HelpOutlineIcon sx={{ fontSize: '1.125rem', ml: 0.5 }} />
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default Header
