import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCertificates, clearAllData } from '../../utils/db';
import { Certificate, BeltLevel } from '../../types';
import { CertificateSharing } from '../../components/features/CertificateSharing';
import './CertificatesPage.css';

const ITEMS_PER_PAGE = 6;

export function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
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

    // Pagination logic
    const totalPages = Math.ceil(certificates.length / ITEMS_PER_PAGE);
    const paginatedCertificates = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return certificates.slice(start, start + ITEMS_PER_PAGE);
    }, [certificates, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset to page 1 if certificates change
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [certificates.length, totalPages, currentPage]);

    if (loading) {
        return <div className="page-container">Loading certificates...</div>;
    }

    return (
        <div className="page-container">
            <h1>🏆 My Certificates</h1>

            {certificates.length > 0 ? (
                <>
                    <div className="certificates-grid">
                        {paginatedCertificates.map(cert => (
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
                                <div className="cert-actions">
                                    <button className="download-btn" onClick={() => handleView(cert)}>
                                        👁️ View / Print
                                    </button>
                                    <CertificateSharing
                                        beltLevel={cert.beltLevel}
                                        userName={cert.userName}
                                        completionDate={cert.issueDate.toISOString()}
                                        certificateId={cert.id}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <nav className="pagination" role="navigation" aria-label="Certificate pagination">
                            <div className="pagination-info">
                                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, certificates.length)} of {certificates.length}
                            </div>
                            <ul className="pagination-list">
                                <li>
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        aria-label="Previous page"
                                    >
                                        ← Prev
                                    </button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <li key={page}>
                                        <button
                                            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                                            onClick={() => handlePageChange(page)}
                                            aria-current={page === currentPage ? 'page' : undefined}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        aria-label="Next page"
                                    >
                                        Next →
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
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