import { useState, useCallback } from "react";

export interface OptimisticUpdateHook<T> {
  data: T[];
  addRecord: (record: T) => void;
  updateRecord: (id: string, updates: Partial<T>) => void;
  deleteRecord: (id: string) => void;
  updateSurveyStatus: (id: string, updates: Partial<T>) => void;
  setData: (data: T[]) => void;
}

export function useOptimisticUpdates<T>(
  initialData: T[]
): OptimisticUpdateHook<T> {
  const [data, setData] = useState<T[]>(initialData);

  const addRecord = useCallback((record: T) => {
    setData((prev) => [record, ...prev]);
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<T>) => {
    setData((prev) =>
      prev.map((record) =>
        (record as Record<string, unknown>).id === id
          ? { ...record, ...updates }
          : record
      )
    );
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setData((prev) =>
      prev.filter((record) => (record as Record<string, unknown>).id !== id)
    );
  }, []);

  const updateSurveyStatus = useCallback((id: string, updates: Partial<T>) => {
    setData((prev) =>
      prev.map((record) =>
        (record as Record<string, unknown>).id === id
          ? { ...record, ...updates }
          : record
      )
    );
  }, []);

  return {
    data,
    addRecord,
    updateRecord,
    deleteRecord,
    updateSurveyStatus,
    setData,
  };
}
