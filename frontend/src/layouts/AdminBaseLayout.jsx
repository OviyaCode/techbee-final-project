import React from "react"
import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import theme from "../config/theme"
import {ProSidebarProvider} from 'react-pro-sidebar';
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import { Outlet } from "react-router-dom";
const AdminBaseLayout = () => {
  return (
    <React.Fragment>
        <ThemeProvider theme={theme}>
            <ProSidebarProvider sx={{height:'100%'}}>
                <CssBaseline/>
                <Header/>
                <Box sx={styles.container}>
                    <SideNav/>
                    <Box component={'main'} sx={styles.mainSection}>
                        <Outlet/>
                    </Box>
                </Box>
            </ProSidebarProvider>
        </ThemeProvider>
    </React.Fragment>
  )
}

export default AdminBaseLayout


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
      p: 4,
      width: '100%',
      height: '91.2vh',
      overflow: 'auto'
    }
  }
  
  
  