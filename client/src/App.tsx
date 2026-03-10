import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import AuthCallback from "./pages/AuthCallbackPage";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/ChatPage";
import CollectionPage from "./pages/CollectionsPage";

function App() {
  return (
    <>
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
        <Route path="/" element={MainLayout()}>
          <Route index element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/collections/:collectionId" element={<CollectionPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
