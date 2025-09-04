"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientForm } from "../forms/client-form";
import { CandidateForm } from "../forms/candidate-form";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  forClient?: boolean;
  forCandidate?: boolean;
  currentUserId?: string;
  apiEndpoint: string; // e.g., "/api/clients" or "/api/candidates"
  onRefreshTrigger?: (triggerRefresh: () => void) => void; // Callback to expose refresh function
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  forClient = false,
  forCandidate = false,
  currentUserId,
  apiEndpoint,
  onRefreshTrigger,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Server-side pagination state
  const [currentData, setCurrentData] = useState<TData[]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Get current pagination state from URL
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentLimit = parseInt(searchParams.get("limit") || "10");
  const currentSearch = searchParams.get("search") || "";
  const refreshTimestamp = searchParams.get("refresh");

  // Local state for sorting and filtering
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Function to fetch data from API with current pagination state
  const fetchData = useCallback(
    async (page: number, limit: number, search: string) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        if (search) params.set("search", search);

        const response = await fetch(`${apiEndpoint}?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          setCurrentData(result.data);
          setTotalRows(result.pagination.total);
          setTotalPages(result.pagination.totalPages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiEndpoint]
  );

  // Fetch data when component mounts or URL params change
  useEffect(() => {
    fetchData(currentPage, currentLimit, currentSearch);
  }, [fetchData, currentPage, currentLimit, currentSearch, refreshTimestamp]);

  // Function to update URL params
  const updateURLParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Function to trigger a table refresh
  const triggerRefresh = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("refresh", Date.now().toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Expose refresh function to parent component
  useEffect(() => {
    onRefreshTrigger?.(triggerRefresh);
  }, [onRefreshTrigger, triggerRefresh]);

  // Handle search
  const handleSearch = useCallback(
    (searchTerm: string) => {
      updateURLParams({ search: searchTerm, page: "1" }); // Reset to first page
    },
    [updateURLParams]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      updateURLParams({ page: page.toString() });
    },
    [updateURLParams]
  );

  // Handle limit change
  const handleLimitChange = useCallback(
    (limit: number) => {
      updateURLParams({ limit: limit.toString(), page: "1" }); // Reset to first page
    },
    [updateURLParams]
  );

  const table = useReactTable({
    data: currentData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4 px-5 mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={searchPlaceholder}
            value={currentSearch}
            onChange={(event) => handleSearch(event.target.value)}
            className="max-w-sm h-[36px]"
          />
        </div>
        <div className="flex flex-row gap-4 items-center justify-end">
          {forClient && <ClientForm currentUserId={currentUserId} />}
          {forCandidate && <CandidateForm currentUserId={currentUserId} />}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: currentLimit }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {Array.from({ length: columns.length }).map(
                    (_, cellIndex) => (
                      <TableCell key={`loading-cell-${index}-${cellIndex}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={`${row.id}-${row.index}`}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {totalRows > 0 ? (
            <>
              Showing {(currentPage - 1) * currentLimit + 1} to{" "}
              {Math.min(currentPage * currentLimit, totalRows)} of {totalRows}{" "}
              total row(s).
            </>
          ) : (
            "No rows to display."
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={`${currentLimit}`}
              onValueChange={(value) => {
                handleLimitChange(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={currentLimit} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem
                    className="font-sans"
                    key={pageSize}
                    value={`${pageSize}`}
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Page</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) : 1;
                handlePageChange(page);
              }}
              className="w-16 h-8 text-center"
            />
            <span className="text-sm text-muted-foreground">
              of {totalPages}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1}
              title="First page"
            >
              <span className="text-xs">«</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              title="Previous page"
            >
              <span className="">
                <IconChevronLeft />
              </span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              title="Next page"
            >
              <span className="">
                <IconChevronRight />
              </span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage >= totalPages}
              title="Last page"
            >
              <span className="">
                <span className="text-xs">»</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
