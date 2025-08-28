"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import Link from "next/link";

interface DashboardSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <div className="flex gap-4 flex-col space-y-4 p-4 bg-black text-white">
      <Logo />
      <button
        onClick={handleSignOut}
        className="text-left text-white hover:text-gray-300 transition-colors"
      >
        Sign out
      </button>

      {/* <Link
        href="/dashboard/home"
        className="text-white hover:text-gray-300 transition-colors"
      >
        Dashboard
      </Link> */}

      <Link
        href="/dashboard/clients"
        className="text-white hover:text-gray-300 transition-colors"
      >
        Clients
      </Link>

      <Link
        href="/dashboard/candidates"
        className="text-white hover:text-gray-300 transition-colors"
      >
        Candidates
      </Link>
    </div>
  );
}
