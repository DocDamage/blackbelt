import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCertificates, clearAllData } from '../../utils/db';
import { Certificate, BeltLevel } from '../../types';
import './CertificatesPage.css';

export function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        const certs = await getAllCertificates();
        setCertificates(certs);
        setLoading(false);
    };

    const handleView = (cert: Certificate) => {
        navigate(`/certificates/${cert.id}`);
    };

    const handleReset = async () => {
        if (confirm('Are you sure you want to reset ALL progress and certificates? This cannot be undone.')) {
            await clearAllData();
            window.location.reload();
        }
    };

    const getBeltColor = (level: BeltLevel) => {
        switch (level) {
            case 'yellow': return '#FFD700';
            case 'green': return '#28a745';
            case 'black': return '#333';
            case 'master': return '#000';
            default: return '#ddd'; // White belt
        }
    };

    if (loading) {
        return <div className="page-container">Loading certificates...</div>;
    }

    return (
        <div className="page-container">
            <h1>🏆 My Certificates</h1>

            {certificates.length > 0 ? (
                <div className="certificates-grid">
                    {certificates.map(cert => (
                        <div key={cert.id} className="certificate-card" style={{ borderTop: `4px solid ${getBeltColor(cert.beltLevel)}` }}>
                            <div className="cert-header">
                                <h3>{cert.beltLevel.toUpperCase()} BELT</h3>
                                <span className="cert-date">{new Date(cert.issueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="cert-body">
                                <p><strong>Certified:</strong> {cert.userName}</p>
                                <p><strong>Score:</strong> {cert.score}%</p>
                                <p className="cert-id">ID: {cert.id}</p>
                            </div>
                            <button className="download-btn" onClick={() => handleView(cert)}>
                                👁️ View / Print
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-certs">
                    <p className="text-muted">You haven't earned any certificates yet.</p>
                </div>
            )}

            <div className="cert-info">
                <h3>Certification Path</h3>
                <ul className="cert-path-list">
                    <li className={certificates.some(c => c.beltLevel === 'white') ? 'earned' : ''}>
                        <span className="icon">⬜</span> White Belt - <em>Basics</em>
                    </li>
                    <li className={certificates.some(c => c.beltLevel === 'yellow') ? 'earned' : ''}>
                        <span className="icon">🟨</span> Yellow Belt - <em>Fundamentals</em>
                    </li>
                    <li className={certificates.some(c => c.beltLevel === 'green') ? 'earned' : ''}>
                        <span className="icon">🟩</span> Green Belt - <em>Statistical Tools</em>
                    </li>
                    <li className={certificates.some(c => c.beltLevel === 'black') ? 'earned' : ''}>
                        <span className="icon">⬛</span> Black Belt - <em>Advanced Analysis</em>
                    </li>
                </ul>
            </div>

            <div className="danger-zone display-flex-column gap-1">
                <h4>⚠️ Danger Zone</h4>
                <p>Resetting data will clear all progress, quiz attempts, and certificates.</p>
                <button className="reset-btn" onClick={handleReset}>
                    Reset All Progress & Data
                </button>
            </div>
        </div>
    );
}
