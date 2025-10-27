import { useState, useEffect } from 'react';

/**
 * Custom hook to detect PWA installation capability and manage install prompt
 * @returns {Object} PWA installation state and methods
 */
export const usePWAInstall = () => {
    const [installPromptEvent, setInstallPromptEvent] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        const checkIfInstalled = () => {
            // Check if running in standalone mode (PWA installed)
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                || window.navigator.standalone 
                || document.referrer.includes('android-app://');
            
            setIsInstalled(isStandalone);
            return isStandalone;
        };

        // Detect iOS devices
        const detectIOS = () => {
            const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            setIsIOS(isIOSDevice);
            return isIOSDevice;
        };

        const installed = checkIfInstalled();
        const ios = detectIOS();

        // If already installed, no need to show prompt
        if (installed) {
            setIsInstallable(false);
            return;
        }

        // iOS devices don't support beforeinstallprompt, but we can still show manual instructions
        if (ios) {
            setIsInstallable(true);
            return;
        }

        // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setInstallPromptEvent(e);
            setIsInstallable(true);
            console.log('PWA: beforeinstallprompt event fired');
        };

        // Listen for successful installation
        const handleAppInstalled = () => {
            console.log('PWA: App was installed');
            setIsInstalled(true);
            setIsInstallable(false);
            setInstallPromptEvent(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Cleanup
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    /**
     * Trigger the install prompt
     * @returns {Promise<boolean>} True if user accepted, false if declined
     */
    const promptInstall = async () => {
        if (!installPromptEvent) {
            console.warn('PWA: Install prompt not available');
            return false;
        }

        // Show the install prompt
        installPromptEvent.prompt();

        // Wait for the user to respond to the prompt
        const choiceResult = await installPromptEvent.userChoice;

        if (choiceResult.outcome === 'accepted') {
            console.log('PWA: User accepted the install prompt');
            setInstallPromptEvent(null);
            return true;
        } else {
            console.log('PWA: User dismissed the install prompt');
            return false;
        }
    };

    /**
     * Dismiss the install prompt (user chose not to install)
     */
    const dismissPrompt = () => {
        setIsInstallable(false);
        // Store dismissal in localStorage to not show again for a while
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    /**
     * Check if user has previously dismissed the prompt within the last 7 days
     */
    const wasDismissedRecently = () => {
        const dismissedTime = localStorage.getItem('pwa-install-dismissed');
        if (!dismissedTime) return false;

        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const timeSinceDismissal = Date.now() - parseInt(dismissedTime);
        
        return timeSinceDismissal < sevenDaysInMs;
    };

    return {
        isInstallable: isInstallable && !wasDismissedRecently(),
        isInstalled,
        isIOS,
        promptInstall,
        dismissPrompt,
        canPrompt: !!installPromptEvent
    };
};
