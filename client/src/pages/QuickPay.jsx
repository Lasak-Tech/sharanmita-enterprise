import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, CreditCard, Loader2, CheckCircle2, Phone, Tag, Wifi, AlertCircle, LogIn, ChevronRight, Shield, Zap, Clock, MapPin, X, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key_replace_me';

const QuickPay = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!serialNumber.trim()) return;

    setLoading(true);
    setError('');
    setCustomer(null);
    setSuccess(false);

    try {
      const queryVal = serialNumber.trim();
      const finalQuery = queryVal.length === 10 ? '91' + queryVal : queryVal;
      const { data } = await axios.get(`http://localhost:8000/api/customers/lookup/${encodeURIComponent(finalQuery)}`);
      setCustomer(data);
    } catch (err) {
      setError(err.response?.data?.message || 'No record found for this Phone Number. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    setShowQR(true);
  };

  const reset = () => {
    setCustomer(null);
    setSuccess(false);
    setIsPending(false);
    setError('');
    setSerialNumber('');
  };

  return (
    <div className="qp-root">
      {/* Animated background */}
      <div className="qp-bg">
        <div className="qp-blob qp-blob-1" />
        <div className="qp-blob qp-blob-2" />
        <div className="qp-blob qp-blob-3" />
        <div className="qp-grid" />
      </div>

      {/* Navbar */}
      <nav className={`qp-nav ${mounted ? 'qp-fade-in' : ''}`}>
        <div className="qp-nav-inner">
          <div className="qp-logo">
            <div className="qp-logo-icon">
              <Wifi size={22} />
            </div>
            <span className="qp-logo-text">Sharanmita Cable</span>
          </div>
          <Link to="/login" className="qp-login-btn">
            <LogIn size={16} />
            Staff Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="qp-container">
        {/* Super Package Sidebar */}
        <aside className={`qp-sidebar ${mounted ? 'qp-slide-in-left' : ''}`}>
          <div className="qp-sidebar-content">
            <div className="qp-super-card">
              <div className="qp-super-bg-glow"></div>
              <div className="qp-super-content">
                <div className="qp-super-header">
                  <div>
                    <div className="qp-super-badge">Premium</div>
                    <h4>Super Package</h4>
                  </div>
                  <div className="qp-super-price">₹999<small>/mo</small></div>
                </div>
                <div className="qp-ott-container">
                  <div className="qp-ott-track">
                    {/* Original set */}
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 100 24" className="qp-ott-svg">
                        <text x="0" y="16" fontFamily="sans-serif" fontWeight="bold" fill="#fff" fontSize="12">prime video</text>
                        <path d="M5,19 Q30,23 68,19" stroke="#00a8e1" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <path d="M68,19 L63,16 M68,19 L65,22" stroke="#00a8e1" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 95 24" className="qp-ott-svg">
                        <path d="M12,2 L13.5,9.5 L19,6.5 L14.5,11 L22,12 L14.5,13 L19,17.5 L13.5,14.5 L12,22 L10.5,14.5 L5,17.5 L9.5,13 L2,12 L9.5,11 L5,6.5 L10.5,9.5 Z" fill="url(#jioStarGrad)" />
                        <text x="25" y="16" fontFamily="sans-serif" fontWeight="800" fill="#fff" fontSize="11" letterSpacing="0.2">JioHotstar</text>
                        <defs>
                          <linearGradient id="jioStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fffefe" />
                            <stop offset="30%" stopColor="#ffd875" />
                            <stop offset="70%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#b45309" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 85 24" className="qp-ott-svg">
                        <text x="0" y="15" fontFamily="sans-serif" fontWeight="700" fill="#a1a1aa" fontSize="10" letterSpacing="0.5">SONY</text>
                        <text x="36" y="17" fontFamily="sans-serif" fontWeight="900" fill="url(#livGrad)" fontSize="14" letterSpacing="0.2">LIV</text>
                        <rect x="0" y="18" width="28" height="2" fill="#ef4444" />
                        <defs>
                          <linearGradient id="livGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="40%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 80 24" className="qp-ott-svg">
                        <circle cx="12" cy="12" r="9" fill="url(#zeeGrad)" />
                        <path d="M9,9 L15,9 L9,15 L15,15" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="27" y="16" fontFamily="sans-serif" fontWeight="900" fill="#fff" fontSize="12" letterSpacing="0.5">ZEE5</text>
                        <defs>
                          <linearGradient id="zeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d946ef" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 80 24" className="qp-ott-svg">
                        <text x="0" y="16" fontFamily="sans-serif" fontWeight="900" fill="#ef4444" fontSize="13" letterSpacing="0.5">SUN</text>
                        <rect x="34" y="3" width="36" height="18" rx="4" fill="#ef4444" />
                        <text x="39" y="15" fontFamily="sans-serif" fontWeight="900" fill="#fff" fontSize="10" letterSpacing="0.5">NXT</text>
                      </svg>
                    </div>

                    {/* Duplicated set for seamless loop scrolling */}
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 100 24" className="qp-ott-svg">
                        <text x="0" y="16" fontFamily="sans-serif" fontWeight="bold" fill="#fff" fontSize="12">prime video</text>
                        <path d="M5,19 Q30,23 68,19" stroke="#00a8e1" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <path d="M68,19 L63,16 M68,19 L65,22" stroke="#00a8e1" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 95 24" className="qp-ott-svg">
                        <path d="M12,2 L13.5,9.5 L19,6.5 L14.5,11 L22,12 L14.5,13 L19,17.5 L13.5,14.5 L12,22 L10.5,14.5 L5,17.5 L9.5,13 L2,12 L9.5,11 L5,6.5 L10.5,9.5 Z" fill="url(#jioStarGradDupe)" />
                        <text x="25" y="16" fontFamily="sans-serif" fontWeight="800" fill="#fff" fontSize="11" letterSpacing="0.2">JioHotstar</text>
                        <defs>
                          <linearGradient id="jioStarGradDupe" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fffefe" />
                            <stop offset="30%" stopColor="#ffd875" />
                            <stop offset="70%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#b45309" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 85 24" className="qp-ott-svg">
                        <text x="0" y="15" fontFamily="sans-serif" fontWeight="700" fill="#a1a1aa" fontSize="10" letterSpacing="0.5">SONY</text>
                        <text x="36" y="17" fontFamily="sans-serif" fontWeight="900" fill="url(#livGradDupe)" fontSize="14" letterSpacing="0.2">LIV</text>
                        <rect x="0" y="18" width="28" height="2" fill="#ef4444" />
                        <defs>
                          <linearGradient id="livGradDupe" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="40%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 80 24" className="qp-ott-svg">
                        <circle cx="12" cy="12" r="9" fill="url(#zeeGradDupe)" />
                        <path d="M9,9 L15,9 L9,15 L15,15" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="27" y="16" fontFamily="sans-serif" fontWeight="900" fill="#fff" fontSize="12" letterSpacing="0.5">ZEE5</text>
                        <defs>
                          <linearGradient id="zeeGradDupe" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d946ef" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="qp-ott-item">
                      <svg viewBox="0 0 80 24" className="qp-ott-svg">
                        <text x="0" y="16" fontFamily="sans-serif" fontWeight="900" fill="#ef4444" fontSize="13" letterSpacing="0.5">SUN</text>
                        <rect x="34" y="3" width="36" height="18" rx="4" fill="#ef4444" />
                        <text x="39" y="15" fontFamily="sans-serif" fontWeight="900" fill="#fff" fontSize="10" letterSpacing="0.5">NXT</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Providing Services Card in Sidebar */}
            <div className="qp-areas-sidebar-card">
              <div className="qp-areas-sidebar-header">
                <div className="qp-sidebar-icon">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="qp-sidebar-title">Providing Services</h3>
                  <p className="qp-sidebar-sub">Currently active in</p>
                </div>
              </div>
              
              <div className="qp-marquee-container qp-marquee-sidebar">
                <div className="qp-marquee-content">
                  {[
                    "Sripathy Nagar",
                    "Nethaji nagar phase 1",
                    "Nethaji nagar phase 2",
                    "Parsen Aranyaka",
                    "Parsen Anthara",
                    "Parsen",
                    "Nanjundapuram check post",
                    "Sripathy Nagar",
                    "Nethaji nagar phase 1",
                    "Nethaji nagar phase 2",
                    "Parsen Aranyaka",
                    "Parsen Anthara",
                    "Parsen",
                    "Nanjundapuram check post"
                  ].map((place, i) => (
                    <div key={i} className="qp-marquee-item">
                      <ChevronRight size={14} className="qp-item-icon" />
                      {place}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="qp-main">
          <div className={`qp-hero ${mounted ? 'qp-slide-up' : ''}`}>
          <div className="qp-badge">
            <Zap size={14} className="qp-badge-icon" />
            Instant Bill Payment
          </div>
          <h1 className="qp-title">
            Pay Your Cable Bill
            <span className="qp-title-gradient"> in Seconds</span>
          </h1>
          <p className="qp-subtitle">
            Enter your Phone Number to instantly view your account details and pay securely.
          </p>
        </div>

        {/* Search Card */}
        <div className={`qp-card ${mounted ? 'qp-slide-up-delay' : ''}`}>
          {!success ? (
            <>
              <form onSubmit={handleLookup} className="qp-form">
                <label className="qp-label">
                  <Search size={15} />
                  Phone Number
                </label>
                <div className="qp-input-row">
                  <div className="qp-input-wrap">
                    <span className="qp-input-prefix">+91</span>
                    <input
                      id="serial-number-input"
                      type="tel"
                      maxLength="10"
                      required
                      placeholder="9876543210"
                      className="qp-input"
                      style={{ paddingLeft: '56px' }}
                      value={serialNumber}
                      onChange={(e) => {
                        setSerialNumber(e.target.value);
                        setError('');
                        if (!e.target.value) setCustomer(null);
                      }}
                    />
                  </div>
                  <button
                    id="lookup-btn"
                    type="submit"
                    disabled={loading || !serialNumber.trim()}
                    className="qp-search-btn"
                  >
                    {loading ? <Loader2 className="qp-spin" size={20} /> : 'Search'}
                  </button>
                </div>
              </form>

              {/* Error */}
              {error && (
                <div className="qp-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Customer Card */}
              {customer && !success && (
                <div className="qp-customer-card">
                  <div className="qp-customer-header">
                    <div className="qp-avatar">
                      {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div className="qp-customer-info">
                      <h3 className="qp-customer-name">{customer.name}</h3>
                      {customer.phone && (
                        <div className="qp-customer-phone">
                          <Phone size={13} />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                    <span className={`qp-status-badge ${customer.status === 'PAID' ? 'qp-status-paid' : 'qp-status-unpaid'}`}>
                      {customer.status === 'PAID' ? '✓ PAID' : '⚡ UNPAID'}
                    </span>
                  </div>

                  <div className="qp-details-grid">
                    <div className="qp-detail-item">
                      <div className="qp-detail-label"><Tag size={12} /> Serial Number</div>
                      <div className="qp-detail-value">{customer.cableId}</div>
                    </div>
                    <div className="qp-detail-item">
                      <div className="qp-detail-label"><Tag size={12} /> VC Number</div>
                      <div className="qp-detail-value">{customer.vcNumber || 'N/A'}</div>
                    </div>
                    <div className="qp-detail-item">
                      <div className="qp-detail-label"><Tag size={12} /> Account No</div>
                      <div className="qp-detail-value">{customer.accountNo || 'N/A'}</div>
                    </div>
                    <div className="qp-detail-item">
                      <div className="qp-detail-label"><CreditCard size={12} /> Monthly Amount</div>
                      <div className="qp-detail-value qp-amount">₹{customer.monthlyAmount}</div>
                    </div>
                    {customer.dueDate && (
                      <div className="qp-detail-item qp-detail-full">
                        <div className="qp-detail-label"><Clock size={12} /> Due Date</div>
                        <div className="qp-detail-value">
                          {new Date(customer.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    )}
                  </div>

                  {customer.status === 'UNPAID' ? (
                    <button
                      id="pay-now-btn"
                      onClick={handlePayment}
                      disabled={paying}
                      className="qp-pay-btn"
                    >
                      {paying ? (
                        <><Loader2 className="qp-spin" size={20} /> Processing…</>
                      ) : (
                        <><CreditCard size={20} /> Pay ₹{customer.monthlyAmount} Securely<ChevronRight size={18} /></>
                      )}
                    </button>
                  ) : (
                    <div className="qp-paid-notice">
                      <CheckCircle2 size={20} />
                      Your account is fully up to date. Nothing to pay!
                    </div>
                  )}

                  <button onClick={reset} className="qp-reset-btn">Search another ID</button>
                </div>
              )}
            </>
          ) : (
            <>
              {isPending ? (
                /* Pending State */
                <div className="qp-success qp-pending">
                  <div className="qp-success-icon qp-pending-icon">
                    <Clock size={40} />
                  </div>
                  <h2 className="qp-success-title">Payment Submitted! ⏳</h2>
                  <p className="qp-success-sub">
                    Your payment of <strong>₹{customer?.monthlyAmount}</strong> has been submitted for verification.
                    Please wait while our team verifies the transaction. Your service will be updated within <strong>1-2 hours</strong>.
                  </p>
                  <button onClick={reset} className="qp-new-search-btn">
                    Check Another ID
                  </button>
                </div>
              ) : (
                /* Success State */
                <div className="qp-success">
                  <div className="qp-success-icon">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="qp-success-title">Payment Successful! 🎉</h2>
                  <p className="qp-success-sub">
                    ₹{customer?.monthlyAmount} has been paid for <strong>{customer?.name}</strong>.
                    Your cable service is now active.
                  </p>
                  <button onClick={reset} className="qp-new-search-btn">
                    Make Another Payment
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Trust badges */}
        <div className={`qp-trust ${mounted ? 'qp-fade-in-delay' : ''}`}>
          <div className="qp-trust-item">
            <Shield size={16} />
            <span>256-bit Encrypted</span>
          </div>
          <div className="qp-trust-dot" />
          <div className="qp-trust-item">
            <Zap size={16} />
            <span>Instant Confirmation</span>
          </div>
          <div className="qp-trust-dot" />
          <div className="qp-trust-item">
            <CheckCircle2 size={16} />
            <span>Powered by Razorpay</span>
          </div>
        </div>

        </div>

        {/* Channels & Packages on Right */}
        <aside className={`qp-right-sidebar ${mounted ? 'qp-slide-in-right' : ''}`}>
          <div className="qp-channels-card">
            <img src="/channels.jpg" alt="Channels" className="qp-channels-img" />
            <div className="qp-channels-overlay">
              <div className="qp-channels-badge">Live</div>
              <h3 className="qp-channels-title">200+ HD Channels</h3>
            </div>
            <div className="qp-channels-logos-bar">
              <span className="qp-logo-item qp-logo-channel">CHANNEL</span>
              <span className="qp-logo-item qp-logo-jiohotstar">
                <svg viewBox="0 0 95 24" className="qp-logo-svg">
                  <path d="M12,2 L13.5,9.5 L19,6.5 L14.5,11 L22,12 L14.5,13 L19,17.5 L13.5,14.5 L12,22 L10.5,14.5 L5,17.5 L9.5,13 L2,12 L9.5,11 L5,6.5 L10.5,9.5 Z" fill="url(#jioStarOverlayGrad)" />
                  <text x="25" y="16" fontFamily="sans-serif" fontWeight="800" fill="#fff" fontSize="11" letterSpacing="0.2">JioHotstar</text>
                  <defs>
                    <linearGradient id="jioStarOverlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fffefe" />
                      <stop offset="30%" stopColor="#ffd875" />
                      <stop offset="70%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span className="qp-logo-item qp-logo-prime">
                <svg viewBox="0 0 100 24" className="qp-logo-svg">
                  <text x="0" y="15" fontFamily="sans-serif" fontWeight="800" fill="#fff" fontSize="12">prime video</text>
                  <path d="M6,17 Q35,21 72,17" stroke="#00a8e1" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M72,17 L67,14 M72,17 L69,20" stroke="#00a8e1" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <span className="qp-logo-item qp-logo-zee">ZEETV</span>
              <span className="qp-logo-item qp-logo-netflix">NETFLIX</span>
            </div>
          </div>

          <div className="qp-packages">
            <div className="qp-package-card">
              <div className="qp-pkg-icon qp-pkg-cable"><Wifi size={18} /></div>
              <div className="qp-pkg-info">
                <h4>Cable TV</h4>
                <p>Starts from <span>₹300</span></p>
              </div>
            </div>

            <div className="qp-promo-card">
              <div className="qp-promo-badge">Mega Deal</div>
              <h4>Triple Play Special</h4>
              <div className="qp-promo-features">
                 <span className="qp-feat"><Wifi size={12}/> Cable</span>
                 <span className="qp-feat-plus">+</span>
                 <span className="qp-feat"><Zap size={12}/> Internet</span>
                 <span className="qp-feat-plus">+</span>
                 <span className="qp-feat"><MonitorPlay size={12}/> OTT</span>
              </div>
              <div className="qp-promo-price" style={{marginBottom: '10px'}}>₹4,999</div>
              <p>Free Installation + 7 Months Service</p>
              <div className="qp-promo-note">6 Months + 1 Month Bonus</div>
            </div>
          </div>
        </aside>

        {/* QR Code Modal */}
        {showQR && (
          <div className="qp-modal-overlay">
            <div className="qp-modal">
              <button className="qp-modal-close" onClick={() => setShowQR(false)}><X size={24} /></button>
              <div className="qp-modal-header" style={{ marginBottom: '10px' }}>
                <div className="qp-qr-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <Clock size={24} />
                </div>
                <h3>Payment Gateway Upgrading</h3>
                <p>We are currently integrating Razorpay for a seamless experience.</p>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                  Our secure online payment portal will be fully operational within the next <strong>3 business days</strong>. <br/><br/>
                  For immediate assistance or alternative payment methods, please contact our support team.
                </p>
              </div>

              <button className="qp-done-btn" style={{ background: '#334155', boxShadow: 'none' }} onClick={() => setShowQR(false)}>
                Okay, I'll pay later
              </button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        /* ── Root & BG ── */
        .qp-root {
          min-height: 100vh;
          background: #0a0f1e;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .qp-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .qp-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: qp-float 8s ease-in-out infinite;
        }
        .qp-blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
          top: -150px; right: -100px;
        }
        .qp-blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
          bottom: 0; left: -100px;
          animation-delay: -3s;
        }
        .qp-blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%);
          top: 50%; left: 50%;
          animation-delay: -5s;
        }
        .qp-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* ── Navbar ── */
        .qp-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(10,15,30,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .qp-nav-inner {
          max-width: 900px; margin: 0 auto;
          padding: 16px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .qp-logo { display: flex; align-items: center; gap: 10px; }
        .qp-logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: white;
          box-shadow: 0 4px 15px rgba(79,70,229,0.4);
        }
        .qp-logo-text { font-size: 18px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.3px; }
        .qp-login-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: #cbd5e1;
          font-size: 13px; font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .qp-login-btn:hover { background: rgba(255,255,255,0.12); color: #f1f5f9; }

        /* ── Layout ── */
        .qp-container {
          position: relative; z-index: 10;
          max-width: 1400px; margin: 0 auto;
          padding: 60px 24px 80px;
          display: flex; justify-content: center;
        }

        .qp-sidebar {
          position: absolute;
          left: 40px;
          top: 120px;
          width: 280px;
          display: block;
        }

        .qp-right-sidebar {
          position: absolute;
          right: 40px;
          top: 120px;
          width: 300px;
          display: block;
        }

        .qp-main {
          flex: 0 1 620px;
          display: flex; flex-direction: column; align-items: center; gap: 32px;
          width: 100%;
        }

        /* ── Sidebar ── */
        .qp-sidebar-content {
          background: transparent;
          padding: 0;
          overflow: visible;
        }

        .qp-channels-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 2/3;
          backdrop-filter: blur(20px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.4);
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .qp-channels-img {
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.9;
        }
        .qp-channels-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 16px;
        }
        .qp-channels-badge {
          align-self: flex-start;
          padding: 3px 8px;
          background: #ef4444;
          color: white;
          border-radius: 4px;
          font-size: 9px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 1px;
          margin-bottom: 8px;
          animation: pulse 2s infinite;
        }
         .qp-channels-title { font-size: 15px; font-weight: 800; color: #f1f5f9; margin: 0 0 50px 0; }

        .qp-channels-logos-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: 4px;
          align-items: center;
          background: #090e1a;
          padding: 8px 12px;
          border-radius: 0 0 19px 19px;
          border-top: 1px solid rgba(255,255,255,0.08);
          justify-content: space-between;
        }
        .qp-logo-item {
          font-family: sans-serif;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .qp-logo-channel {
          background: #0d6efd;
          color: #fff;
          font-size: 7px;
          font-weight: 900;
          padding: 0 5px;
          letter-spacing: 0.5px;
        }
        .qp-logo-jiohotstar {
          background: #000;
          padding: 0 5px;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .qp-logo-prime {
          background: #00a8e1;
          padding: 0 4px;
        }
        .qp-logo-zee {
          background: #ff5722;
          color: #fff;
          font-size: 7px;
          font-weight: 900;
          padding: 0 5px;
          letter-spacing: 0.5px;
        }
        .qp-logo-netflix {
          background: #000;
          color: #e50914;
          font-size: 7px;
          font-weight: 900;
          padding: 0 5px;
          letter-spacing: 0.5px;
        }
        .qp-logo-svg {
          height: 9px;
          width: auto;
          display: block;
        }

        /* ── Packages ── */
        .qp-packages { display: flex; flex-direction: column; gap: 12px; }
        .qp-package-card {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          transition: all 0.2s;
        }
        .qp-package-card:hover { background: rgba(255,255,255,0.06); transform: translateX(-4px); border-color: rgba(255,255,255,0.12); }
        .qp-pkg-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; color: white;
        }
        .qp-pkg-cable { background: linear-gradient(135deg, #4f46e5, #7c3aed); }
        .qp-pkg-net { background: linear-gradient(135deg, #059669, #10b981); }
        .qp-pkg-triple { background: linear-gradient(135deg, #d946ef, #8b5cf6); }
        .qp-pkg-info h4 { font-size: 13px; font-weight: 700; color: #f1f5f9; margin: 0 0 2px; }
        .qp-pkg-info p { font-size: 11px; color: #94a3b8; margin: 0; }
        .qp-pkg-info span { font-size: 14px; font-weight: 800; color: #fff; margin-left: 2px; }
        .qp-pkg-info small { font-size: 9px; color: #64748b; font-weight: 600; }

        .qp-promo-card {
          margin-top: 8px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(139,92,246,0.05) 100%);
          border: 1px solid rgba(79,70,229,0.2);
          border-radius: 20px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .qp-promo-badge {
          display: inline-block; padding: 4px 10px; background: #fbbf24; color: #78350f;
          font-size: 10px; font-weight: 900; border-radius: 100px; margin-bottom: 12px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .qp-promo-card h4 { font-size: 16px; font-weight: 800; color: #f1f5f9; margin: 0 0 8px; }
        .qp-promo-price { font-size: 32px; font-weight: 900; color: #fff; line-height: 1; margin-bottom: 8px; letter-spacing: -1px; }
        .qp-promo-card p { font-size: 12px; color: #94a3b8; font-weight: 600; margin: 0 0 4px; }
        .qp-promo-note { font-size: 11px; color: #34d399; font-weight: 700; text-transform: uppercase; }
        
        .qp-promo-features {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-bottom: 12px;
        }
        .qp-feat {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700; color: #a5b4fc;
          background: rgba(79,70,229,0.2); padding: 4px 8px; border-radius: 6px;
        }
        .qp-feat-plus { color: #6366f1; font-weight: 800; font-size: 12px; }

        .qp-super-card {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 20px; padding: 2px;
          margin-top: 10px;
        }
        .qp-areas-sidebar-card {
          position: relative; overflow: hidden;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px; padding: 24px;
          margin-top: 20px;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
        }
        .qp-areas-sidebar-header {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 16px;
        }
        .qp-marquee-sidebar {
          height: 240px;
          overflow: hidden;
          position: relative;
          margin-top: 10px;
        }
        .qp-marquee-sidebar::before,
        .qp-marquee-sidebar::after {
          content: ''; position: absolute; left: 0; right: 0; height: 50px; z-index: 2; pointer-events: none;
        }
        .qp-marquee-sidebar::before { top: 0; background: linear-gradient(to bottom, #0a0f1e 0%, transparent 100%); }
        .qp-marquee-sidebar::after { bottom: 0; background: linear-gradient(to top, #0a0f1e 0%, transparent 100%); }
        .qp-super-bg-glow {
          position: absolute; inset: -50%;
          background: conic-gradient(from 0deg, transparent, #8b5cf6, transparent 30%);
          animation: qp-spin 4s linear infinite;
        }
        .qp-super-content {
          position: relative; background: #0a0f1e; border-radius: 18px;
          padding: 16px; z-index: 1; height: 100%;
        }
        .qp-super-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .qp-super-badge {
          display: inline-block; padding: 3px 8px; background: linear-gradient(90deg, #ec4899, #8b5cf6);
          color: white; font-size: 9px; font-weight: 900; border-radius: 100px;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
        }
        .qp-super-header h4 { font-size: 15px; font-weight: 800; color: #f1f5f9; margin: 0; }
        .qp-super-price { font-size: 24px; font-weight: 900; color: #fff; line-height: 1; text-align: right; }
        .qp-super-price small { font-size: 12px; color: #94a3b8; font-weight: 600; display: block; }

        .qp-ott-container {
          overflow: hidden; white-space: nowrap; position: relative;
          padding: 4px 0;
          mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
        }
        .qp-ott-track {
          display: flex; gap: 12px;
          padding: 12px 0;
          animation: qp-marquee-horizontal 18s linear infinite;
          width: max-content;
        }
        .qp-super-card:hover .qp-ott-track {
          animation-play-state: paused;
        }
        .qp-ott-item {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 6px 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; height: 38px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .qp-ott-item:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          box-shadow: 0 0 15px rgba(255,255,255,0.1);
        }
        .qp-ott-svg {
          height: 20px; display: block; width: auto;
        }

        @keyframes qp-spin { 100% { transform: rotate(360deg); } }
        @keyframes qp-marquee-horizontal { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 6px)); } }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .qp-sidebar-header {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 20px;
        }
        .qp-sidebar-icon {
          width: 38px; height: 38px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: #34d399;
        }
        .qp-sidebar-title { font-size: 15px; font-weight: 800; color: #f1f5f9; margin: 0; }
        .qp-sidebar-sub { font-size: 11px; font-weight: 600; color: #64748b; margin: 2px 0 0; text-transform: uppercase; letter-spacing: 0.5px; }

        .qp-marquee-container {
          height: 480px;
          overflow: hidden;
          position: relative;
          margin-top: 10px;
        }
        .qp-marquee-container::before,
        .qp-marquee-container::after {
          content: ''; position: absolute; left: 0; right: 0; height: 100px; z-index: 2; pointer-events: none;
        }
        .qp-marquee-container::before { top: 0; background: linear-gradient(to bottom, #0a0f1e 0%, transparent 100%); }
        .qp-marquee-container::after { bottom: 0; background: linear-gradient(to top, #0a0f1e 0%, transparent 100%); }

        .qp-marquee-content {
          display: flex; flex-direction: column; gap: 12px;
          animation: qp-marquee-vertical 25s linear infinite;
        }
        .qp-marquee-content:hover { animation-play-state: paused; }

        .qp-marquee-item {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          color: #94a3b8;
          font-size: 16px; font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }
        .qp-marquee-item:hover {
          background: rgba(79,70,229,0.1);
          border-color: rgba(79,70,229,0.3);
          color: #f1f5f9;
          transform: translateX(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .qp-item-icon { color: #34d399; flex-shrink: 0; }

        /* ── Hero ── */
        .qp-hero { text-align: center; }
        .qp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          background: rgba(79,70,229,0.15);
          border: 1px solid rgba(79,70,229,0.3);
          border-radius: 100px;
          font-size: 12px; font-weight: 700;
          color: #a5b4fc; letter-spacing: 0.5px;
          margin-bottom: 24px;
          text-transform: uppercase;
        }
        .qp-badge-icon { color: #fbbf24; }
        .qp-title {
          font-size: clamp(32px, 6vw, 52px);
          font-weight: 900;
          color: #f1f5f9;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin: 0 0 16px;
        }
        .qp-title-gradient {
          background: linear-gradient(90deg, #818cf8, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .qp-subtitle {
          font-size: 16px; color: #94a3b8; line-height: 1.7; margin: 0;
        }

        /* ── Card ── */
        .qp-card {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 28px;
          padding: 32px;
          backdrop-filter: blur(20px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        /* ── Form ── */
        .qp-form { margin-bottom: 0; }
        .qp-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 700;
          color: #64748b; letter-spacing: 0.8px;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .qp-input-row { display: flex; gap: 10px; }
        .qp-input-wrap { position: relative; flex: 1; }
        .qp-input-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); color: #475569;
          pointer-events: none;
        }
        .qp-input-prefix {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); color: #f1f5f9;
          font-size: 15px; font-weight: 700; letter-spacing: 0.5px;
          pointer-events: none;
        }
        .qp-input {
          width: 100%; padding: 15px 16px 15px 48px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: #f1f5f9;
          font-size: 15px; font-weight: 500;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .qp-input::placeholder { color: #475569; }
        .qp-input:focus {
          border-color: #4f46e5;
          background: rgba(79,70,229,0.08);
          box-shadow: 0 0 0 3px rgba(79,70,229,0.15);
        }
        .qp-search-btn {
          padding: 0 28px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          font-size: 15px; font-weight: 700;
          border: none; border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          min-width: 110px;
          box-shadow: 0 4px 20px rgba(79,70,229,0.4);
        }
        .qp-search-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 25px rgba(79,70,229,0.5);
        }
        .qp-search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Error ── */
        .qp-error {
          display: flex; align-items: center; gap: 10px;
          margin-top: 16px; padding: 14px 16px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 14px;
          color: #fca5a5;
          font-size: 14px; font-weight: 500;
        }

        /* ── Customer Card ── */
        .qp-customer-card {
          margin-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 24px;
          animation: qp-slide-up 0.4s ease;
        }
        .qp-customer-header {
          display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
        }
        .qp-avatar {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 800; color: white;
          flex-shrink: 0;
        }
        .qp-customer-info { flex: 1; }
        .qp-customer-name { font-size: 18px; font-weight: 700; color: #f1f5f9; margin: 0 0 4px; }
        .qp-customer-phone {
          display: flex; align-items: center; gap: 5px;
          font-size: 13px; color: #64748b; font-weight: 500;
        }
        .qp-status-badge {
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.5px; white-space: nowrap;
        }
        .qp-status-paid { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.2); }
        .qp-status-unpaid { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }

        .qp-details-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 20px;
        }
        .qp-detail-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 14px 16px;
        }
        .qp-detail-full { grid-column: span 2; }
        .qp-detail-label {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700;
          color: #475569; letter-spacing: 0.5px;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .qp-detail-value { font-size: 15px; font-weight: 600; color: #cbd5e1; }
        .qp-amount { font-size: 20px; font-weight: 800; color: #f1f5f9; }

        .qp-pay-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #059669 150%);
          background-size: 200% 100%;
          color: white; font-size: 16px; font-weight: 800;
          border: none; border-radius: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s;
          box-shadow: 0 8px 30px rgba(79,70,229,0.4);
          letter-spacing: -0.3px;
          margin-bottom: 12px;
        }
        .qp-pay-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(79,70,229,0.5);
          background-position: 100% 0;
        }
        .qp-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .qp-paid-notice {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 16px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 16px;
          color: #34d399; font-weight: 700; font-size: 15px;
          margin-bottom: 12px;
        }

        .qp-reset-btn {
          width: 100%; padding: 10px;
          background: transparent;
          border: none; color: #64748b;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: color 0.2s;
          text-decoration: underline;
        }
        .qp-reset-btn:hover { color: #94a3b8; }

        /* ── Success ── */
        .qp-success {
          text-align: center; padding: 20px 0;
          animation: qp-slide-up 0.4s ease;
        }
        .qp-success-icon {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2));
          border: 1px solid rgba(16,185,129,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #34d399;
          margin: 0 auto 20px;
          box-shadow: 0 0 40px rgba(16,185,129,0.2);
        }
        .qp-success-title { font-size: 26px; font-weight: 800; color: #f1f5f9; margin: 0 0 10px; }
        .qp-success-sub { font-size: 15px; color: #64748b; line-height: 1.6; margin: 0 0 28px; }
        .qp-new-search-btn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white; font-size: 15px; font-weight: 700;
          border: none; border-radius: 14px; cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(79,70,229,0.4);
        }
        .qp-new-search-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 25px rgba(79,70,229,0.5); }

        /* ── Trust badges ── */
        .qp-trust {
          display: flex; align-items: center; gap: 16px;
          flex-wrap: wrap; justify-content: center;
        }
        .qp-trust-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; color: #475569;
        }
        .qp-trust-item svg { color: #334155; }
        .qp-trust-dot { width: 3px; height: 3px; background: #334155; border-radius: 50%; }

        @keyframes qp-marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .qp-slide-in-left { animation: qp-slide-in-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes qp-slide-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .qp-slide-in-right { animation: qp-slide-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes qp-slide-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes qp-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes qp-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .qp-fade-in { animation: qp-slide-up 0.5s ease; }
        .qp-slide-up { animation: qp-slide-up 0.6s ease 0.1s both; }
        .qp-slide-up-delay { animation: qp-slide-up 0.6s ease 0.2s both; }
        .qp-fade-in-delay { animation: qp-slide-up 0.6s ease 0.4s both; }
        .qp-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Modal ── */
        .qp-modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(7,10,20,0.85);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: qp-fade-in 0.3s ease;
        }
        .qp-modal {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 32px;
          width: 100%; max-width: 440px;
          padding: 40px;
          position: relative;
          box-shadow: 0 25px 60px -12px rgba(0,0,0,0.5);
          text-align: center;
        }
        .qp-modal-close {
          position: absolute; top: 24px; right: 24px;
          color: #94a3b8; background: rgba(255,255,255,0.05);
          border: none; border-radius: 12px; padding: 6px;
          cursor: pointer; transition: all 0.2s;
        }
        .qp-modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
        
        .qp-qr-icon {
          width: 50px; height: 50px; background: #2563eb; color: white;
          border-radius: 14px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .qp-modal-header h3 { font-size: 24px; font-weight: 800; color: #fff; margin: 0 0 8px; }
        .qp-modal-header p { font-size: 14px; color: #94a3b8; margin: 0 0 30px; }

        .qp-qr-container {
          position: relative;
          width: 240px; height: 240px;
          margin: 0 auto 30px;
          padding: 12px;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
        }
        .qp-qr-img { width: 100%; height: 100%; object-fit: contain; }
        .qp-qr-scan-line {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: #2563eb;
          box-shadow: 0 0 15px #2563eb;
          animation: scan 3s linear infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .qp-modal-steps { text-align: left; margin-bottom: 30px; }
        .qp-step { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; }
        .qp-step-num {
          width: 20px; height: 20px; background: rgba(37,99,235,0.2); color: #60a5fa;
          border-radius: 6px; display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; flex-shrink: 0; margin-top: 2px;
        }
        .qp-step p { font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.4; }

        .qp-done-btn {
          width: 100%; padding: 14px;
          background: #2563eb; color: #fff; font-weight: 700;
          border: none; border-radius: 16px; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 10px 20px -5px rgba(37,99,235,0.4);
        }
        .qp-done-btn:hover { background: #1d4ed8; transform: translateY(-2px); }

        .qp-pending-icon {
          background: rgba(245,158,11,0.1) !important;
          color: #f59e0b !important;
          border-color: rgba(245,158,11,0.2) !important;
        }
        .qp-pending .qp-success-title { color: #fbbf24; }

        @media (max-width: 1300px) {
          .qp-container { 
            flex-direction: column; 
            align-items: center; 
            gap: 40px; 
            padding-bottom: 80px;
          }
          .qp-sidebar, .qp-right-sidebar { 
            position: static; 
            width: 100%; 
            max-width: 620px; 
            display: block;
          }
          .qp-marquee-container { height: auto; }
          .qp-marquee-content { 
            animation: none; 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 10px; 
          }
          .qp-marquee-item:nth-child(n+8) { display: none; }
          
          .qp-right-sidebar {
            order: 3; /* Move to bottom on mobile */
          }
          .qp-main {
            order: 2;
          }
          .qp-sidebar {
            order: 1;
          }
        }

        @media (max-width: 480px) {
          .qp-marquee-content { grid-template-columns: 1fr; }
          .qp-card { padding: 24px 18px; border-radius: 20px; }
          .qp-input-row { flex-direction: column; }
          .qp-search-btn { padding: 14px; border-radius: 12px; width: 100%; }
          .qp-details-grid { grid-template-columns: 1fr; }
          .qp-detail-full { grid-column: span 1; }
          .qp-trust { display: none; }
        }
      `}</style>
    </div>
  );
};

export default QuickPay;
