import React from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const FirestoreTest = () => {
  const { user } = useAuth();
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const testFirestore = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log("🧪 Testing Firestore permissions...");
      console.log("Current user:", {
        uid: user?.uid,
        email: user?.email,
        authenticated: !!user
      });

      const results = [];

      // Test 1: Basic test collection write
      try {
        const testData = {
          message: "Basic permission test",
          userId: user?.uid,
          createdAt: serverTimestamp(),
        };
        
        const testDoc = await addDoc(collection(db, "test"), testData);
        results.push("✅ Basic permissions: PASS");
        console.log("✅ Test collection write successful");
      } catch (error) {
        results.push(`❌ Basic permissions: FAIL (${error.message})`);
        console.error("❌ Test collection write failed:", error);
      }

      // Test 2: Brands collection write (exact same as brand registration)
      try {
        const testBrandData = {
          brandName: "Test Brand Registration",
          userId: user?.uid,
          createdBy: user?.uid,
          status: "pending",
          createdAt: serverTimestamp(),
          timestamp: new Date().toISOString(),
          test: true
        };

        console.log("🏢 Testing brands collection with data:", testBrandData);
        const brandDoc = await addDoc(collection(db, "brands"), testBrandData);
        results.push("✅ Brands collection: PASS");
        console.log("✅ Brands collection write successful");
      } catch (error) {
        results.push(`❌ Brands collection: FAIL (${error.message})`);
        console.error("❌ Brands collection write failed:", error);
      }

      setResult({
        success: results.some(r => r.includes("Brands collection: PASS")),
        message: results.join("\n"),
        details: results.some(r => r.includes("FAIL")) ? 
          "Some tests failed. Check console for details." : 
          "All tests passed! Brand registration should work now."
      });
      
    } catch (error) {
      console.error("General test error:", error);
      setResult({
        success: false,
        message: `Test suite error: ${error.message}`,
        error: error.code
      });
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        You must be logged in to test Firestore permissions.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        🧪 Firestore Permission Test
      </Typography>
      
      <Typography variant="body1" paragraph>
        This component tests if your Firestore security rules allow writing data.
      </Typography>

      <Typography variant="body2" paragraph color="text.secondary">
        Current User: {user.email} (UID: {user.uid})
      </Typography>

      <Button 
        variant="contained" 
        onClick={testFirestore}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test Firestore Write'}
      </Button>

      {result && (
        <Alert 
          severity={result.success ? 'success' : 'error'}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2">
            {result.message}
          </Typography>
          {result.error && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Error Code: {result.error}
            </Typography>
          )}
        </Alert>
      )}

      <Typography variant="caption" display="block" sx={{ mt: 2 }}>
        💡 If this test fails, check your Firestore security rules in the Firebase Console.
      </Typography>
    </Box>
  );
};

export default FirestoreTest;