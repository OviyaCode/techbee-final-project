import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom"
import theme from "../config/theme";
import StudentHeader from "../components/StudentHeader";
const StudentBaseLayout = () => {
  const location = useLocation();
  const hideHeader = location.pathname.includes('/dashboard/code')
  const mainSectionStyles = hideHeader ? { ...styles.mainSection, bgcolor: '#1d1d1d', color: '#fff' } : styles.mainSection;
  const containerStyles = hideHeader ? { ...styles.container, bgcolor: '#1d1d1d' } : styles.container;

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        {!hideHeader && <StudentHeader/>}
        <Box component={'main'} sx={containerStyles}>
          <Box component={'div'} sx={mainSectionStyles}>
            <Outlet/>
          </Box>
        </Box>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default StudentBaseLayout



/**
 * @type {import('@mui/material').SxProps}
 */
const styles = {
  container: {
    display: 'flex',
    bgcolor: 'neutral.light',
    height: 'calc(100% - 64px)'
  },
  mainSection: {
    marginTop: '64px',
    p: 4,
    width: '100%',
    height: '100vh',
  }
}