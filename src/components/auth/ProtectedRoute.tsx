import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowRetry(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowRetry(false);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        {showRetry && (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">लोडिंग जास्त वेळ लागत आहे...</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary underline hover:no-underline"
            >
              पुन्हा प्रयत्न करा (Reload)
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
