import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { glassTheme } from './theme/glassTheme';
import { GlassBackground } from './components/common/GlassBackground';
import { NotesGrid } from './components/notes/NotesGrid';

function App() {
  return (
    <ThemeProvider theme={glassTheme}>
      <CssBaseline />
      <GlassBackground>
        <NotesGrid />
      </GlassBackground>
    </ThemeProvider>
  );
}

export default App;