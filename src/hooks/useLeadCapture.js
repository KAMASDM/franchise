import { useState, useEffect } from "react";
import { apiService } from "../utils/api";
import { LOCAL_STORAGE_KEYS } from "../constants";

export const useLeadCapture = () => {
  const [isUserCaptured, setIsUserCaptured] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const captured = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_CAPTURED);
    setIsUserCaptured(!!captured);

    if (!captured) {
      // Set up scroll trigger
      const handleScroll = () => {
        if (window.scrollY > 500) {
          setShowModal(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };

      // Set up time trigger
      const timer = setTimeout(() => {
        if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_CAPTURED)) {
          setShowModal(true);
        }
      }, 30000); // 30 seconds

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(timer);
      };
    }
  }, []);

  const captureUser = async (userData) => {
    try {
      await apiService.submitLeadCapture(userData);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_CAPTURED, "true");
      setIsUserCaptured(true);
      setShowModal(false);

      // Track the lead capture event
      await apiService.trackEvent("lead_captured", userData);

      return { success: true };
    } catch (error) {
      console.error("Failed to capture user:", error);
      return { success: false, error: error.message };
    }
  };

  const dismissModal = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_CAPTURED, "true");
    setIsUserCaptured(true);
    setShowModal(false);
  };

  return {
    isUserCaptured,
    showModal,
    captureUser,
    dismissModal,
  };
};
