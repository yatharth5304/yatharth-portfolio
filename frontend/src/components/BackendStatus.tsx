import { useEffect, useState } from 'react';
export default function BackendStatus() {
    const [status, setStatus] = useState('Checking backend…');
    useEffect(() => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 6000);
        fetch('/api/health', { signal: controller.signal }).then(async (response) => { if (!response.ok)
            throw new Error('Unavailable'); return response.json(); }).then(result => setStatus(result.status === 'UP' && result.database === 'UP' ? 'All systems operational' : 'Backend unavailable')).catch(() => setStatus('Backend status unavailable'));
        return () => { clearTimeout(timeout); controller.abort(); };
    }, []);
    return <p className="backend-status" role="status">{status}</p>;
}
