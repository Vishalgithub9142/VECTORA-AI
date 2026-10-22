import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children }) => {

  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: '#0d1117' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(224,64,123,0.3)', borderTopColor: '#e0407b' }}
          />
          <p className="text-sm" style={{ color: '#6b7fa3' }}>Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default Protected;