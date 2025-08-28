import { authClient } from "@/lib/auth-client";

async function HomePage() {
  // Authentication is handled at the layout level
  // Get user from the session context
  // const { data: session } = await authClient.getSession();
  // const user = session!.user; // We know user exists because layout already checked

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <h1 className="text-2xl font-bold tracking-tight">
                Dashboard Home
              </h1>
              {/* <p className="text-muted-foreground">
                Welcome back, {user.name || user.email?.split("@")[0] || "User"}
                !
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
