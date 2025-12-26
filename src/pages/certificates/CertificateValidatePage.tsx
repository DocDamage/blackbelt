import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCertificate } from '../../utils/db';
import { Certificate } from '../../types';
import './CertificateValidatePage.css';

export function CertificateValidatePage() {
    const { id } = useParams<{ id: string }>();
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchCertificate() {
            if (!id) {
                setError('No certificate ID provided');
                setLoading(false);
                return;
            }

            try {
                const cert = await getCertificate(id);
                if (cert) {
                    setCertificate(cert);
                } else {
                    setError('Certificate not found. It may be invalid or expired.');
                }
            } catch (err) {
                setError('Error retrieving certificate information.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchCertificate();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="validate-container loading">
                <div className="spinner"></div>
                <p>Verifying Certificate...</p>
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div className="validate-container error">
                <div className="error-icon">⚠️</div>
                <h1>Verification Failed</h1>
                <p>{error}</p>
                <Link to="/" className="home-link">Return to Home</Link>
            </div>
        );
    }

    return (
        <div className="validate-page">
            <div className="no-print-bar">
                <Link to="/certificates" className="back-link">← Back to Certificates</Link>
                <div className="action-buttons">
                    <button onClick={handlePrint} className="print-btn">🖨️ Print / Save PDF</button>
                    <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="share-btn">🔗 Copy Link</button>
                </div>
            </div>

            <div className="certificate-paper">
                <div className="certificate-border">
                    <div className="certificate-content">
                        <div className="cert-header">
                            <div className="logo-placeholder">Six Sigma Training</div>
                            <div className="cert-title">Certificate of Achievement</div>
                        </div>

                        <div className="cert-body">
                            <p className="cert-presented">This is to certify that</p>
                            <h2 className="student-name">{certificate.userName}</h2>
                            <p className="cert-text">
                                has successfully completed all requirements and passed the final examination for the
                            </p>
                            <h1 className="belt-level use-theme-color">{certificate.beltLevel} Belt</h1>
                            <p className="cert-text">
                                demonstrating proficiency in the Lean Six Sigma methodology.
                            </p>
                        </div>

                        <div className="cert-details">
                            <div className="detail-item">
                                <span className="label">Date Issued</span>
                                <span className="value">{new Date(certificate.issueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Certificate ID</span>
                                <span className="value monospace">{certificate.id}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Exam Score</span>
                                <span className="value">{certificate.score}%</span>
                            </div>
                        </div>

                        <div className="cert-footer">
                            <div className="signature-line">
                                <span className="signature">The Black Belt AI</span>
                                <span className="role">Course Director</span>
                            </div>
                            <div className="verification-qr">
                                {/* Placeholder for QR Code */}
                                <div className="qr-placeholder">
                                    VERIFIED
                                    <br />
                                    {certificate.id.substring(0, 8)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
