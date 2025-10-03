import React from 'react';
import { Box } from '@mui/material';

export const GlassBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(104, 85, 224, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 50% 0%, rgba(104, 85, 224, 0.15), transparent 40%)',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1), transparent 50%)',
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          backdropFilter: 'blur(20px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};