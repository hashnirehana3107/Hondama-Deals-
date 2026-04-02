import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import './AlertModal.css';

const AlertModal = ({ isOpen, type, message, onClose, onConfirm, title, buttonText }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <div className="modal-icon success-icon"><CheckCircle size={48} /></div>;
            case 'error': return <div className="modal-icon error-icon"><AlertCircle size={48} /></div>;
            case 'confirm': return <div className="modal-icon confirm-icon"><AlertCircle size={48} /></div>;
            case 'loading': return <div className="modal-icon loading-icon"><Loader2 size={48} className="animate-spin" /></div>;
            default: return null;
        }
    };

    return (
        <div className="alert-modal-overlay fadeIn">
            <div className="alert-modal-card scaleIn">
                <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                <div className="modal-content">
                    {getIcon()}
                    <h3 className={`modal-title ${type === 'error' || type === 'confirm' ? 'text-red' : 'text-blue'}`}>{title || (type === 'success' ? 'Successful!' : 'Action Required')}</h3>
                    <p className="modal-message">{message}</p>
                    <div className="modal-footer-btns">
                        {type === 'confirm' && (
                            <button className="modal-secondary-btn" onClick={onClose}>Cancel</button>
                        )}
                        <button 
                            className={`modal-action-btn ${type === 'success' ? 'bg-success' : (type === 'confirm' ? 'bg-error' : 'bg-primary')}`} 
                            onClick={onConfirm || onClose}
                        >
                            {type === 'loading' ? 'Please Wait...' : (buttonText || 'Understand')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
