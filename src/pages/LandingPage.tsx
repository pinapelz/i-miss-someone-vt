import { useEffect, useState } from 'react';
import CurrentStatus from "../components/CurrentStatus";
import ProgressBar from "../components/ProgressBar";
import '../styles/LandingPage.css';  
import Navbar from "../components/NavBar";

interface StreamData {
  status: string;
  available_at: string;
  end_actual: string;
  channel: {
    name: string;
    english_name: string;
  };
  title: string;
  start_actual: string;
  id: string;
}

function LandingPage() {
    const [data, setData] = useState<StreamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRefetching, setIsRefetching] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchData = (initialFetch: boolean = false) => {
      if (!autoRefresh && !initialFetch) return;
      if (initialFetch) {
        setLoading(true);
      }
      setIsRefetching(true);
  
      fetch("/api/live")
        .then(response => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((result: StreamData) => {
          setData(result);
          setLoading(false);
          setIsRefetching(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
          setIsRefetching(false);
        });
    };
  
    useEffect(() => {
      fetchData(true);
    }, []);
  
    const handleProgressComplete = () => {
      fetchData();
    };
  
    return (
      <>
      <Navbar/>
      <div>
        <CurrentStatus data={data} loading={loading || isRefetching} error={error} />
        {autoRefresh && <ProgressBar onComplete={handleProgressComplete} />}
        <label>
          Auto-refresh Live Status:
          <input type="checkbox" checked={autoRefresh} onChange={() => setAutoRefresh(!autoRefresh)} /> {/* Checkbox to toggle auto-refresh */}
        </label>
      </div>
      </>
    );
  }
  

export default LandingPage;