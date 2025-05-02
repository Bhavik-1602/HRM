"use client";

import { usePathname } from "next/navigation";
import SideMenu from "@/components/SideMenu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { TOKEN } from "@/config/constant";
import { useRouter } from 'next/navigation'
import { ToastContainer } from 'react-toastify';

export default function App({ children }) {
  const pathname = usePathname();
  const isLoginPage = ["/login", "/forgot-password", "/reset-password"].includes(pathname);
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Small screen toggle
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem(TOKEN);

      if (!token && !isLoginPage) {
        router.push('/login');
      } else {
        setLoading(false); 
      }
    };

    checkToken();
  }, [router, isLoginPage]); 

  // loading when authenticating
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-[#F47B55] rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F2F4F7]">
      {/* Header (Mobile Toggle) */}
      {!isLoginPage && <Header toggleSidebar={() => setIsMobileOpen(!isMobileOpen)} />}

      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        {!isLoginPage && <SideMenu isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />}

        {/* Main Content */}
        <main className="flex-1 w-full bg-white rounded-xl m-2 mt-0 shadow-lg p-3 md:p-6 overflow-auto">
          {children}
        </main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1}
        />
      </div>

      {/* Footer */}
      {!isLoginPage && <Footer />}
    </div>
  );
}
