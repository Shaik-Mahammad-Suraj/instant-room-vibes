
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <div className="text-5xl font-bold text-roomloop-purple">404</div>
        <h1 className="text-3xl font-bold">Room not found</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          The room you're looking for might have ended or doesn't exist.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button size="lg">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
