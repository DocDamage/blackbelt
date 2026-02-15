/**
 * Certificate Sharing Component
 * Allows users to share certificates on social media and LinkedIn
 */

import { useState } from 'react';
import './CertificateSharing.css';

interface CertificateSharingProps {
    beltLevel: string;
    userName: string;
    completionDate: string;
    certificateId: string;
}

export function CertificateSharing({
    beltLevel,
    userName,
    completionDate,
    certificateId
}: CertificateSharingProps) {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const beltNames: Record<string, string> = {
        white: 'White Belt',
        yellow: 'Yellow Belt',
        green: 'Green Belt',
        black: 'Black Belt',
        master: 'Master Black Belt'
    };

    const shareText = `🎓 I just earned my Six Sigma ${beltNames[beltLevel]} certification! Check out my achievement at the Six Sigma Academy.`;
    const shareUrl = `${window.location.origin}/certificates/validate/${certificateId}`;

    // LinkedIn share URL
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

    // Twitter share URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

    // Facebook share URL
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Six Sigma Certification',
                    text: shareText,
                    url: shareUrl
                });
            } catch (err) {
                // User cancelled or error - show menu instead
                setShowShareMenu(true);
            }
        } else {
            setShowShareMenu(!showShareMenu);
        }
    };

    const downloadCertificate = () => {
        // Create a printable certificate view
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Six Sigma ${beltNames[beltLevel]} Certificate</title>
                    <style>
                        body {
                            font-family: 'Georgia', serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            margin: 0;
                            background: #f5f5f5;
                        }
                        .certificate {
                            background: white;
                            border: 8px double #1a365d;
                            padding: 60px 80px;
                            text-align: center;
                            max-width: 800px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        }
                        .logo {
                            font-size: 48px;
                            margin-bottom: 20px;
                        }
                        .title {
                            font-size: 32px;
                            color: #1a365d;
                            margin-bottom: 10px;
                            font-weight: bold;
                        }
                        .subtitle {
                            font-size: 18px;
                            color: #666;
                            margin-bottom: 40px;
                        }
                        .recipient {
                            font-size: 36px;
                            color: #000;
                            border-bottom: 2px solid #1a365d;
                            padding-bottom: 10px;
                            margin-bottom: 40px;
                            font-style: italic;
                        }
                        .certification {
                            font-size: 24px;
                            color: #1a365d;
                            margin-bottom: 40px;
                        }
                        .date {
                            font-size: 14px;
                            color: #666;
                            margin-bottom: 10px;
                        }
                        .id {
                            font-size: 12px;
                            color: #999;
                        }
                        .seal {
                            width: 100px;
                            height: 100px;
                            margin: 30px auto 0;
                            border: 3px solid #d4a574;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 32px;
                        }
                        @media print {
                            body { background: white; }
                            .certificate { box-shadow: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="certificate">
                        <div class="logo">🎓</div>
                        <div class="title">Certificate of Completion</div>
                        <div class="subtitle">Six Sigma Academy</div>
                        <div class="recipient">${userName}</div>
                        <div class="certification">has successfully completed the<br><strong>${beltNames[beltLevel]}</strong><br>certification program</div>
                        <div class="date">Completed on ${new Date(completionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</div>
                        <div class="id">Certificate ID: ${certificateId}</div>
                        <div class="seal">✓</div>
                    </div>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <div className="certificate-sharing">
            <button className="share-button" onClick={handleShare}>
                📤 Share Certificate
            </button>

            {showShareMenu && (
                <div className="share-menu">
                    <h4>Share Your Achievement</h4>
                    <div className="share-options">
                        <a
                            href={linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="share-option linkedin"
                        >
                            <span className="icon">💼</span>
                            <span>LinkedIn</span>
                        </a>
                        <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="share-option twitter"
                        >
                            <span className="icon">🐦</span>
                            <span>Twitter</span>
                        </a>
                        <a
                            href={facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="share-option facebook"
                        >
                            <span className="icon">📘</span>
                            <span>Facebook</span>
                        </a>
                        <button
                            onClick={handleCopyLink}
                            className="share-option copy"
                        >
                            <span className="icon">{copied ? '✓' : '🔗'}</span>
                            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                        <button
                            onClick={downloadCertificate}
                            className="share-option download"
                        >
                            <span className="icon">📄</span>
                            <span>Print/Download</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CertificateSharing;