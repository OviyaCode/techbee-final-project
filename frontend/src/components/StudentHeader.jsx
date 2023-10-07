import { AppBar, Badge, Box, IconButton, Toolbar, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
const StudentHeader = () => {
    const navigate = useNavigate();
    
    const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s;
  padding: 10px;
  border-radius: 5px;

  &:hover {
      background-color: #333;
      color: #fff;
}
`;

    const profile = () => {
        navigate('/dashboard/settings')
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/')
    }

    const userId = localStorage.getItem("userId")
    return (
        <AppBar position='fixed' sx={styles.appBar}>
            <Toolbar>
                <Typography variant='h6' sx={{ paddingRight: 3, paddingLeft: 3 }}><StyledLink to="/dashboard" >TechBee</StyledLink></Typography>
                <Box sx={{ marginLeft: 5, display: 'flex', alignItems: "center", gap: "50px" }}>
                    <Typography variant='body2'><StyledLink to="/dashboard/questions" >Practice</StyledLink></Typography>
                    <Typography variant='body2'><StyledLink to={`/dashboard/user/${userId}`}>Results</StyledLink></Typography>
                    <Typography variant='body2'><StyledLink to={`/dashboard/ranking`}>Leader board</StyledLink></Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton title="profile" color="secondary" onClick={profile}>
                    <Badge variant='dot' color="success">
                        <AccountCircleIcon sx={{ fontSize: 25 }} />
                    </Badge>
                </IconButton>
                <IconButton title="Sign Out" color="secondary" onClick={handleLogout}>
                    <ExitToAppRoundedIcon sx={{ fontSize: 25 }} />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default StudentHeader

/**@type {import("@mui/material").SxProps} */

const styles = {
    appBar: {
        bgcolor: 'neutral.main',
        height: '64px',
    },
    appLogo: {
        borderRadius: 2,
        width: 80,
        marginLeft: 2,
        cursor: 'pointer'
    }
}
