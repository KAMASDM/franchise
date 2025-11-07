import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

/**
 * Configure NProgress for smooth page transitions
 */
NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.1,
  trickleSpeed: 200,
});

/**
 * Hook to show loading bar on route changes
 */
export const usePageProgress = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timeout);
      NProgress.done();
    };
  }, [location.pathname]);
};

export default usePageProgress;
