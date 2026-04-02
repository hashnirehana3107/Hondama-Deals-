import React, { useState } from 'react';
import {
    Settings,
    Shield,
    Bell,
    Globe,
    CreditCard,
    Database,
    Lock,
    Layout,
    Save,
    RefreshCcw,
    Mail,
    Smartphone,
    UserCircle,
    Server,
    Palette,
    CheckCircle2
} from 'lucide-react';
import './AdminSettings.css';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('General');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    const tabs = [
        { id: 'General', icon: <Settings size={18} />, label: 'General' },
        { id: 'Security', icon: <Shield size={18} />, label: 'Security' },
        { id: 'Notifications', icon: <Bell size={18} />, label: 'Notifications' },
        { id: 'Revenue', icon: <CreditCard size={18} />, label: 'Commission & Fees' },
        { id: 'System', icon: <Database size={18} />, label: 'System' },
    ];



    return (
        <div className="aset-page-wrapper">
            {/* 1. Page Header */}
            <div className="aset-header">
                <div className="aset-header-left">
                    <h1 className="aset-title">System Settings</h1>
                    <p className="aset-subtitle">Configure global platform parameters and administrative controls</p>
                </div>
                <div className="aset-header-right">
                    <button className={`aset-btn-save ${isSaving ? 'saving' : ''}`} onClick={handleSave}>
                        {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="aset-main-layout">
                {/* Side Navigation */}
                <div className="aset-sidebar adlay-shadow">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`aset-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="aset-content-area">
                    {activeTab === 'General' && (
                        <div className="aset-section animate-fade-in">
                            <div className="aset-section-header">
                                <h3><Globe size={20} /> General Configuration</h3>
                                <p>Basic website information and global metadata</p>
                            </div>

                            <div className="aset-form-grid">
                                <div className="aset-input-group">
                                    <label>Marketplace Name</label>
                                    <input type="text" defaultValue="Hodama Deals" />
                                </div>
                                <div className="aset-input-group">
                                    <label>Support Email</label>
                                    <input type="email" defaultValue="support@hodamadeals.lk" />
                                </div>
                                <div className="aset-input-group full">
                                    <label>Store Motto / Description</label>
                                    <textarea defaultValue="Sri Lanka's leading marketplace for exclusive deals, student discounts, and partner referrals."></textarea>
                                </div>

                                <div className="aset-input-group">
                                    <label>Default Currency</label>
                                    <select>
                                        <option>Sri Lankan Rupee (LKR)</option>
                                        <option>US Dollar (USD)</option>
                                    </select>
                                </div>
                                <div className="aset-input-group">
                                    <label>Contact Number</label>
                                    <input type="text" defaultValue="+94 11 222 3333" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <div className="aset-section animate-fade-in">
                            <div className="aset-section-header">
                                <h3><Lock size={20} /> Security & Access</h3>
                                <p>Control authentication methods and administrative safety</p>
                            </div>

                            <div className="aset-toggle-list">
                                <div className="aset-toggle-item">
                                    <div className="aset-toggle-info">
                                        <strong>Two-Factor Authentication (2FA)</strong>
                                        <p>Require a secondary code for all administrative logins</p>
                                    </div>
                                    <label className="aset-switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="aset-slider"></span>
                                    </label>
                                </div>
                                <div className="aset-toggle-item">
                                    <div className="aset-toggle-info">
                                        <strong>Automatic Logout</strong>
                                        <p>Session timeout after 30 minutes of inactivity</p>
                                    </div>
                                    <label className="aset-switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="aset-slider"></span>
                                    </label>
                                </div>
                                <div className="aset-toggle-item">
                                    <div className="aset-toggle-info">
                                        <strong>New Client Approval Mode</strong>
                                        <p>Manually verify every new client registration</p>
                                    </div>
                                    <label className="aset-switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="aset-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Notifications' && (
                        <div className="aset-section animate-fade-in">
                            <div className="aset-section-header">
                                <h3><Bell size={20} /> Notification Settings</h3>
                                <p>Configure how students and clients receive updates</p>
                            </div>

                            <div className="aset-checkbox-group">
                                <div className="aset-checkbox-item">
                                    <input type="checkbox" id="email-orders" defaultChecked />
                                    <label htmlFor="email-orders">
                                        <Mail size={16} /> Deal approval notification emails
                                    </label>
                                </div>
                                <div className="aset-checkbox-item">
                                    <input type="checkbox" id="sms-delivery" defaultChecked />
                                    <label htmlFor="sms-delivery">
                                        <Smartphone size={16} /> SMS alerts for deal expiries
                                    </label>
                                </div>
                                <div className="aset-checkbox-item">
                                    <input type="checkbox" id="push-promos" />
                                    <label htmlFor="push-promos">
                                        <Bell size={16} /> Promotional push notifications
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Revenue' && (
                        <div className="aset-section animate-fade-in">
                            <div className="aset-section-header">
                                <h3><CreditCard size={20} /> Revenue & Fees</h3>
                                <p>Manage platform commissions, listing fees, and partner earnings</p>
                            </div>
                            
                            <div className="aset-form-grid">
                                <div className="aset-input-group">
                                    <label>Partner Listing Fee (Rs)</label>
                                    <input type="number" defaultValue="1500" />
                                </div>
                                <div className="aset-input-group">
                                    <label>Referral Commission (%)</label>
                                    <input type="number" defaultValue="10" />
                                </div>
                                <div className="aset-input-group">
                                    <label>Min. Payout Threshold (Rs)</label>
                                    <input type="number" defaultValue="5000" />
                                </div>
                                <div className="aset-input-group">
                                    <label>Payout Cycle</label>
                                    <select defaultValue="monthly">
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="aset-toggle-list mt-8">
                                <div className="aset-toggle-item">
                                    <div className="aset-toggle-info">
                                        <strong>Enable Partner Withdrawals</strong>
                                        <p>Allow business partners to request payouts for their referral earnings</p>
                                    </div>
                                    <label className="aset-switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="aset-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}


                    {activeTab === 'System' && (
                        <div className="aset-section animate-fade-in">
                            <div className="aset-section-header">
                                <h3><Server size={20} /> System Infrastructure</h3>
                                <p>Server health, database maintenance and logging</p>
                            </div>

                            <div className="aset-status-grid">
                                <div className="aset-stat-box">
                                    <span>System Status</span>
                                    <strong className="text-green"><CheckCircle2 size={16} /> Healthy</strong>
                                </div>
                                <div className="aset-stat-box">
                                    <span>Database Size</span>
                                    <strong>4.2 GB</strong>
                                </div>
                                <div className="aset-stat-box">
                                    <span>Last Backup</span>
                                    <strong>2 hours ago</strong>
                                </div>
                            </div>

                            <div className="aset-action-panel">
                                <button className="aset-panel-btn">Clear System Cache</button>
                                <button className="aset-panel-btn">Download Error Logs</button>
                                <button className="aset-panel-btn danger">Force System Maintenance</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
