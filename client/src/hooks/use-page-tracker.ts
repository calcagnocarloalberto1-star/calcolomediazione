import { useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export function usePageTracker() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Track page view
    apiRequest("POST", "/api/track", { path: location }).catch(() => {});
  }, [location]);
}
