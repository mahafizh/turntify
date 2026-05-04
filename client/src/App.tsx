import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";
import { Routes, Route, Navigate, Outlet } from "react-router";
import HomePage from "./pages/HomePage";
import AuthCallback from "./pages/AuthCallbackPage";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/ChatPage";
import CollectionPage from "./pages/CollectionsPage";
import DashboardPage from "./pages/DashboardPage";
import { useEffect } from "react";
import ProfilePage from "./pages/ProfilePage";
import { useUserStore } from "./stores/useUserStore";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  const userEmailAddress = clerkUser?.primaryEmailAddress?.emailAddress;
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  if (!isSignedIn || userEmailAddress !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/sso-callback"
        element={
          <AuthenticateWithRedirectCallback
            signUpForceRedirectUrl={"/auth-callback"}
          />
        }
      />
      <Route path="/auth-callback" element={<AuthCallback />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="collections/:collectionId" element={<CollectionPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
}

export default App;
