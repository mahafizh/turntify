import { axiosInstance, setTokenGetter } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  const { fetchAdminStatus } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();

        if (token) {
          axiosInstance.defaults.headers.common["Authorization"] =
            `Bearer ${token}`;
          await fetchAdminStatus();
        } else {
          delete axiosInstance.defaults.headers.common["Authorization"];
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      initAuth();
    }

    setTokenGetter(getToken);
  }, [getToken, isLoaded]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
