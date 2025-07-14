import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, provider, db } from '../firebase/firebaseConfig';
import { Button, Container, Typography, Paper } from '@mui/material';

const BrandSignIn = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if a brand application or profile already exists
            const brandProfileRef = doc(db, 'brandApplications', user.uid);
            const brandProfileSnap = await getDoc(brandProfileRef);

            if (brandProfileSnap.exists()) {
                // If an application/profile exists, navigate to a brand dashboard
                // (This is a placeholder for a future dashboard page)
                alert("Welcome back! Redirecting you to your dashboard.");
                // navigate('/brand-dashboard'); 
            } else {
                // If no application exists, start the registration process
                navigate('/brand-registration');
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            alert("Failed to sign in. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '5rem' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Typography variant="h4" gutterBottom>
                    For Brands
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                    Sign in to create or manage your brand profile.
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleGoogleSignIn}
                >
                    Sign In with Google
                </Button>
            </Paper>
        </Container>
    );
};

export default BrandSignIn;