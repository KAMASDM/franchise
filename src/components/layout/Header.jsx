import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';

const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const navItems = [
        { text: 'Home', path: '/' },
        { text: 'About Us', path: '/about' },
        { text: 'Brands', path: '/brands' },
        { text: 'Blog', path: '/blog' },
        { text: 'Contact', path: '/contact' },
        { text: 'FAQs', path: '/faq' },
    ];

    const drawer = (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {navItems.map((item) => (
                    <ListItem button component={RouterLink} to={item.path} key={item.text}>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <ListItem button component={RouterLink} to="/brand-signin">
                     <ListItemText primary="For Brands" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <>
            <AppBar position="sticky" color="default" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                        FranchiseHub
                    </Typography>
                    {isMobile ? (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <div>
                            {navItems.map((item) => (
                                <Button color="inherit" component={RouterLink} to={item.path} key={item.text}>
                                    {item.text}
                                </Button>
                            ))}
                             <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ display: 'inline-block', marginLeft: '10px' }}
                            >
                                <Button variant="contained" color="primary" component={RouterLink} to="/brand-signin">
                                    For Brands
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Header;