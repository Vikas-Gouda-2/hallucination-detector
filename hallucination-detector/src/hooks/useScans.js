import { useState, useEffect } from 'react';
import { getScan, getHistory, getStats } from '../lib/api';

export const useScans = (userId) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch scans when userId changes
  useEffect(() => {
    if (!userId) return;

    const fetchScans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getHistory(userId);
        setScans(response.data || []);
      } catch (err) {
        console.error('❌ Fetch scans error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [userId]);

  return { scans, loading, error, refetch: () => {} };
};

export const useScanById = (scanId) => {
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scanId) return;

    const fetchScan = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getScan(scanId);
        setScan(response.data);
      } catch (err) {
        console.error('❌ Fetch scan error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [scanId]);

  return { scan, loading, error };
};

export const useStats = (userId) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStats(userId);
        setStats(response.data);
      } catch (err) {
        console.error('❌ Fetch stats error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
};
