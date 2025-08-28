import { useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

export const useCreateQueryString = () => {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (
      name: string,
      value: string,
      deletion?: string,
      alt_name?: string,
      alt_value?: string
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      if (alt_name && alt_value) {
        params.set(alt_name, alt_value);
      }

      if (deletion && deletion !== "") {
        params.delete(deletion);
      }

      return params.toString();
    },
    [searchParams]
  );

  // Function to remove a query parameter
  const removeQueryParam = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name); // Remove the parameter

      return params.toString();
    },
    [searchParams]
  );

  return { createQueryString, removeQueryParam };
};
