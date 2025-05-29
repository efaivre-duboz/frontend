import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
    useTheme,
    useMediaQuery,
    Avatar,
    Menu,
    MenuItem,
    Chip
} from '@mui/material';
import {
    Menu as MenuIcon,
    QrCodeScanner,
    Inventory,
    Assessment,
    BarChart,
    Home,
    AccountCircle,
    Logout,
    AdminPanelSettings,
    Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

function Navigation() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout, isAdmin } = useAuth();

    // Menus selon le rôle
    const getMenuItems = () => {
        const commonItems = [
            { text: 'Tableau de Bord', icon: <Home />, path: '/' },
            { text: 'Scan Production', icon: <QrCodeScanner />, path: '/scan' },
        ];

        const adminItems = [
            { text: 'Gestion Produits', icon: <Inventory />, path: '/products' },
            { text: 'Gestion Lots', icon: <Assessment />, path: '/batches' },
            { text: 'Rapports', icon: <BarChart />, path: '/reports' },
        ];

        return isAdmin() ? [...commonItems, ...adminItems] : commonItems;
    };

    const menuItems = getMenuItems();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleProfileMenuClose();
        logout();
        navigate('/login');
    };

    const isCurrentPath = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.includes(path)) return true;
        return false;
    };

    const getRoleColor = () => {
        return isAdmin() ? 'error' : 'primary';
    };

    const getRoleIcon = () => {
        return isAdmin() ? <AdminPanelSettings /> : <Person />;
    };

    const drawer = (
        <Box sx={{ width: 250 }}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Production App
                </Typography>
            </Toolbar>
            <Divider />
            
            {/* Informations utilisateur dans le drawer mobile */}
            {isMobile && (
                <>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: getRoleColor() + '.main' }}>
                            {getRoleIcon()}
                        </Avatar>
                        <Typography variant="subtitle2">
                            {user?.name}
                        </Typography>
                        <Chip
                            label={isAdmin() ? 'Administrateur' : 'Opérateur'}
                            color={getRoleColor()}
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </Box>
                    <Divider />
                </>
            )}

            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={isCurrentPath(item.path)}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            
            {/* Déconnexion dans le drawer mobile */}
            {isMobile && (
                <>
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText primary="Déconnexion" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </>
            )}
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Production Management System
                    </Typography>

                    {/* Menu de navigation pour desktop */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.text}
                                    color="inherit"
                                    startIcon={item.icon}
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        backgroundColor: isCurrentPath(item.path) ? 
                                            'rgba(255, 255, 255, 0.1)' : 'transparent'
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {/* Profil utilisateur */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {!isMobile && (
                            <Chip
                                label={isAdmin() ? 'Admin' : 'Opérateur'}
                                color={getRoleColor()}
                                size="small"
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'white' }}
                            />
                        )}
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: getRoleColor() + '.main' }}>
                                {getRoleIcon()}
                            </Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Menu profil */}
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
            >
                <MenuItem disabled>
                    <Box>
                        <Typography variant="subtitle2">
                            {user?.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {isAdmin() ? 'Administrateur' : 'Opérateur'}
                        </Typography>
                    </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Déconnexion
                </MenuItem>
            </Menu>

            {/* Navigation mobile */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                    }}
                >
                    {drawer}
                </Drawer>
            )}

            {/* Navigation desktop */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: 250,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 250,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            )}
        </>
    );
}

export default Navigation;