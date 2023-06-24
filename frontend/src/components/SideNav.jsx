import { Box, Typography, useTheme } from "@mui/material";
import { Menu, MenuItem, Sidebar, useProSidebar } from "react-pro-sidebar";
import DashboardIcon from '@mui/icons-material/Dashboard';
import HelpIcon from '@mui/icons-material/Help';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SideNav = () => {
    const { collapsed } = useProSidebar();
    const theme = useTheme();

    const [username, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [dashboardLabel, setDashboardLabel] = useState('');


    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');
        if (storedUsername) {
            setUserName(storedUsername);
        }
        if (storedRole) {
            setRole(storedRole);
            setDashboardLabel(getDashboardLabel(storedRole))
        }
    }, []);

    const getDashboardLabel = (role) => {
        if (role === 'admin') {
            return 'Admin Dashboard';
        } else if (role === 'editor') {
            return 'Editor Dashboard';
        }
    }

    return (
        <Sidebar
            style={{ height: "100%", top: 'auto' }}
            breakPoint="md"
            backgroundColor={theme.palette.neutral.light}
        >
            <Box sx={styles.avatarContainer}>
                {!collapsed && <Typography variant="body2" sx={styles.yourChannel}>{username}</Typography>}
                {!collapsed && <Typography variant="overline">{dashboardLabel}</Typography>}
            </Box>

            <Menu
                menuItemStyles={{
                    button: ({ active }) => {
                        return {
                            backgroundColor: active ? theme.palette.neutral.medium : undefined,
                        };
                    },
                }}
            >
                <MenuItem active={window.location.pathname === "/admindashboard"} component={<Link to="/admindashboard" />} icon={<DashboardIcon />}>
                    <Typography variant="body2">Dashboard</Typography>
                </MenuItem>
                {role !== 'editor' && (
                    <MenuItem active={window.location.pathname === "/admindashboard/admin"} component={<Link to="/admindashboard/admin" />} icon={<AdminPanelSettingsIcon />}>
                        <Typography variant="body2">Admin</Typography>
                    </MenuItem>
                )}
                <MenuItem active={window.location.pathname === "/admindashboard/quizcat"} component={<Link to="/admindashboard/quizcat" />} icon={<CategoryIcon />}>
                    <Typography variant="body2">Quiz Category</Typography>
                </MenuItem>
                <MenuItem active={window.location.pathname === "/admindashboard/question"} component={<Link to="/admindashboard/question" />} icon={<HelpIcon />}>
                    <Typography variant="body2">Questions</Typography>
                </MenuItem>
                <MenuItem active={window.location.pathname === "/admindashboard/results"} component={<Link to="/admindashboard/results" />} icon={<ArticleIcon />}>
                    <Typography variant="body2">Results</Typography>
                </MenuItem>
                <MenuItem active={window.location.pathname === "/admindashboard/settings"} component={<Link to="/admindashboard/settings" />} icon={<SettingsIcon />}>
                    <Typography variant="body2">Settings</Typography>
                </MenuItem>
            </Menu>
        </Sidebar>
    );
};

export default SideNav;

/**
 * @type {import("@mui/material").SxProps}
 */
const styles = {
    avatarContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: 'column',
        my: 5,
        width: 'calc(100%-120px)'
    },
    avatar: {
        width: '40%',
        height: 'auto'
    },
    yourChannel: {
        mt: 1,
        textTransform: 'uppercase'
    }

}