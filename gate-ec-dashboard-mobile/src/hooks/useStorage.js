import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

export function useStorage(key) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const loaded = await storage.get(key);
      setData(loaded);
      setLoading(false);
    };
    loadData();
  }, [key]);

  // Callbacks for mutations
  const add = useCallback(async (item) => {
    const result = await storage.add(key, item);
    const updated = await storage.get(key);
    setData(updated);
    return result;
  }, [key]);

  const update = useCallback(async (id, changes) => {
    await storage.update(key, id, changes);
    const updated = await storage.get(key);
    setData(updated);
  }, [key]);

  const remove = useCallback(async (id) => {
    await storage.delete(key, id);
    const updated = await storage.get(key);
    setData(updated);
  }, [key]);

  const refresh = useCallback(async () => {
    const updated = await storage.get(key);
    setData(updated);
  }, [key]);

  return { data, loading, add, update, remove, refresh };
}
