import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Hook to trigger table refreshes by updating URL params
 * @returns Function to trigger a refresh
 */
export function useTableRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const triggerRefresh = () => {
    const params = new URLSearchParams(searchParams);
    params.set("refresh", Date.now().toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return triggerRefresh;
}

/**
 * Utility function to trigger a refresh for a specific path
 * @param pathname - The path to refresh
 * @param currentParams - Current search params
 * @param router - Next.js router instance
 */
export function triggerTableRefresh(
  pathname: string,
  currentParams: URLSearchParams,
  router: { push: (url: string) => void }
) {
  const params = new URLSearchParams(currentParams);
  params.set("refresh", Date.now().toString());
  router.push(`${pathname}?${params.toString()}`);
}
