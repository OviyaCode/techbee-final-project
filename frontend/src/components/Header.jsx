import { useProSidebar } from "react-pro-sidebar"
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Badge, Box, IconButton, Toolbar, Typography } from "@mui/material";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
const Header = () => {
    const { collapseSidebar, toggleSidebar, broken } = useProSidebar();
    const navigate = useNavigate();

    const MenuIconClick = () => {
        broken ? toggleSidebar() : collapseSidebar()
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/')
    }
    const profile = () =>{
        navigate('/admindashboard/settings')
    }
    return (
        <AppBar position="sticky" sx={styles.appBar}>
            <Toolbar>
                <Typography variant='h6' sx={{ paddingRight: 3, paddingLeft: 3 }}>TechBee</Typography>
                <IconButton onClick={MenuIconClick} color='secondary'>
                    <MenuIcon sx={{ fontSize: 25 }} />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton title="profile" color="secondary" onClick={profile}>
                    <Badge variant='dot' color="success">
                        <AccountCircleIcon sx={{ fontSize: 25 }} />
                    </Badge>
                </IconButton>
                <IconButton title="notification" color="secondary">
                    <Badge badgeContent={5} color="error">
                        <CircleNotificationsIcon sx={{ fontSize: 25 }} />
                    </Badge>

                </IconButton>
                <IconButton title="Sign Out" color="secondary" onClick={handleLogout}>
                    <ExitToAppRoundedIcon sx={{ fontSize: 25 }} />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

/**@type {import("@mui/material").SxProps} */

const styles = {
    appBar: {
        bgcolor: 'neutral.main'
    },
    appLogo: {
        borderRadius: 2,
        width: 80,
        marginLeft: 2,
        cursor: 'pointer'
    }
}

export default Header