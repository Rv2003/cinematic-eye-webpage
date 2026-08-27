import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/navbar';
import './booking.css';

// ----------------------------------------------------
// DYNAMIC DATA CONSTANTS (No hardcoding in layout)
// ----------------------------------------------------
const CATEGORIES = [
  'All Services',
  'Narrative Film',
  'Fashion & Editorial',
  'Commercial & Brand',
  'Documentary'
];

const PACKAGES_DATA = [
  {
    id: 'essential',
    category: 'Narrative Film',
    title: 'Essential Reel',
    price: 1200,
    duration: '4 Hours',
    popular: false,
    description: 'Ideal for short films, artist spotlights, and high-impact targeted promotional reels.',
    specs: [
      'Half-day production (4 Hours)',
      '1 Lead Cinematographer',
      '4K Cinema Camera Rig',
      'Standard Color Grading',
      '2 Revisions included'
    ]
  },
  {
    id: 'directors_cut',
    category: 'Fashion & Editorial',
    title: 'Director’s Cut',
    price: 2800,
    duration: '8 Hours',
    popular: true,
    description: 'Our signature flagship tier crafted for high-fashion, editorial campaigns, and music films.',
    specs: [
      'Full-day production (8 Hours)',
      '2 Cinematographers + Sound Eng.',
      'Anamorphic / Cinema Primes',
      'Bespoke Cinema LUT & Color Grade',
      'Custom Sound Design & Mix',
      '3 Revisions included'
    ]
  },
  {
    id: 'masterpiece',
    category: 'Commercial & Brand',
    title: 'Masterpiece Suite',
    price: 5500,
    duration: '2 Full Days',
    popular: false,
    description: 'Full-scale theatrical production with complete crew, lighting design, and master post-production.',
    specs: [
      'Multi-day shoot (16 Hours total)',
      'Full Crew (Director, DP, Gaffer, Audio)',
      'RED / ARRI Cinema Camera Rig',
      'Full Post-Production & Score',
      'DCP Format & Master Delivery',
      'Unlimited Revisions'
    ]
  }
];

const ADDONS_DATA = [
  {
    id: 'drone',
    title: '4K Aerial Drone Cinematography',
    price: 450,
    description: 'Licensed drone operator for cinematic high-altitude landscape and venue shots.'
  },
  {
    id: 'film_stills',
    title: '35mm Analog Film Stills',
    price: 350,
    description: '2 rolls of authentic 35mm film photography developed and digitized in high resolution.'
  },
  {
    id: 'luts',
    title: 'Signature Cinema Color Grade & LUT',
    price: 300,
    description: 'Custom look creation crafted specifically for your project’s narrative mood.'
  },
  {
    id: 'express',
    title: 'Express 48-Hour Turnaround',
    price: 600,
    description: 'Priority post-production delivery of the final master within 48 hours.'
  },
  {
    id: 'raw_ssd',
    title: 'Master RAW Footage SSD Hard Drive',
    price: 200,
    description: 'Uncompressed camera RAW files shipped on a rugged USB-C SSD drive.'
  },
  {
    id: 'multicam',
    title: 'Multi-Cam Live Audio & Video Rig',
    price: 800,
    description: 'Synchronized multi-angle coverage for performances, events, or multi-person scenes.'
  }
];

const TIME_SLOTS = [
  { id: 'morning', name: 'Morning Session', time: '09:00 AM - 01:00 PM', icon: '🌅', badge: 'Soft Light' },
  { id: 'afternoon', name: 'Afternoon Session', time: '01:30 PM - 05:30 PM', icon: '☀️', badge: 'Peak Daylight' },
  { id: 'golden', name: 'Golden Hour / Sunset', time: '05:00 PM - 09:00 PM', icon: '🌇', badge: 'Most Popular' },
  { id: 'night', name: 'Night Studio Session', time: '08:30 PM - 12:30 AM', icon: '🌙', badge: 'Atmospheric' }
];

export function Booking({ user, setUser, token, setToken }) {
  const navigate = useNavigate();

  // Step Control (1: Package, 2: Schedule, 3: Addons, 4: Client Info, 5: Confirmation)
  const [currentStep, setCurrentStep] = useState(1);

  // Selections State
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES_DATA[1]); // Default to Director's Cut
  const [selectedAddons, setSelectedAddons] = useState([ADDONS_DATA[0]]); // Default first addon checked
  
  // Date State
  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(
    new Date(today.setDate(today.getDate() + 3)).toISOString().split('T')[0] // 3 days from now
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[2]); // Golden Hour

  // Client Details Form State
  const [clientForm, setClientForm] = useState({
    fullName: user ? (typeof user === 'object' ? user.username || '' : user) : '',
    email: '',
    phone: '',
    projectTitle: '',
    location: 'On Location (Client Venue)',
    brief: '',
    agreedToTerms: false
  });

  // Booking Confirmation State
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter packages based on category tab
  const filteredPackages = selectedCategory === 'All Services'
    ? PACKAGES_DATA
    : PACKAGES_DATA.filter(p => p.category === selectedCategory);

  // Live Price Calculation
  const basePrice = selectedPackage ? selectedPackage.price : 0;
  const addonsTotal = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
  const subtotal = basePrice + addonsTotal;
  const estimatedTax = Math.round(subtotal * 0.08); // 8% service fee/tax
  const grandTotal = subtotal + estimatedTax;

  // Toggle Addon Selection
  const toggleAddon = (addon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Calendar Days Logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfWeek = (year, month) => new Date(year, month, 1).getDay();

  const handleMonthChange = (delta) => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const renderCalendarDays = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);

    const cells = [];
    // Blank padding cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`blank-${i}`} className="calendar-day-cell disabled"></div>);
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const dateStr = cellDate.toISOString().split('T')[0];
      const isPast = cellDate < now;
      const isSelected = dateStr === selectedDate;

      cells.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={isPast}
          className={`calendar-day-cell ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isPast && setSelectedDate(dateStr)}
        >
          {day}
        </button>
      );
    }

    return cells;
  };

  // Submit Booking Handler
  const handleSubmitBooking = () => {
    if (!clientForm.fullName || !clientForm.email || !clientForm.agreedToTerms) {
      alert('Please fill out all required fields and accept the terms of service.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newRef = 'CE-' + Math.floor(100000 + Math.random() * 900000);
      setConfirmedBooking({
        id: newRef,
        packageName: selectedPackage.title,
        category: selectedPackage.category,
        price: selectedPackage.price,
        addons: selectedAddons.map(a => a.title),
        totalPrice: grandTotal,
        date: selectedDate,
        timeSlot: `${selectedTimeSlot.name} (${selectedTimeSlot.time})`,
        clientName: clientForm.fullName,
        email: clientForm.email
      });
      setIsSubmitting(false);
      setCurrentStep(5); // Jump to Confirmation View
    }, 600);
  };

  return (
    <div className="booking-page-wrapper">
      {/* Background Lighting Effects */}
      <div className="booking-bg-atmosphere">
        <div className="booking-ambient-glow-1"></div>
        <div className="booking-ambient-glow-2"></div>
      </div>

      {/* Global Navbar */}
      <Navbar user={user} setUser={setUser} token={token} setToken={setToken} />

      <div className="booking-container">
        
        {/* Header Title */}
        <header className="booking-header">
          <span className="eyebrow">
            <span className="eyebrow-dot-pulse"></span>
            Production Reservation
          </span>
          <h1 className="booking-title">
            RESERVE YOUR <span className="gold-accent">SESSION</span>
          </h1>
          <p className="booking-subtitle">
            Configure your bespoke film or editorial photography package. Every frame is tailor-crafted with precision optics and master color science.
          </p>
        </header>

        {/* Stepper Navigation Bar */}
        {currentStep <= 4 && (
          <div className="booking-stepper">
            <div
              className="stepper-progress-fill"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>

            <button
              className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
              onClick={() => setCurrentStep(1)}
            >
              <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
              <span className="step-label">Package</span>
            </button>

            <button
              className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
              onClick={() => setCurrentStep(2)}
            >
              <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
              <span className="step-label">Schedule</span>
            </button>

            <button
              className={`step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}
              onClick={() => setCurrentStep(3)}
            >
              <div className="step-number">{currentStep > 3 ? '✓' : '3'}</div>
              <span className="step-label">Add-Ons</span>
            </button>

            <button
              className={`step-item ${currentStep === 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}
              onClick={() => setCurrentStep(4)}
            >
              <div className="step-number">{currentStep > 4 ? '✓' : '4'}</div>
              <span className="step-label">Details</span>
            </button>
          </div>
        )}

        {/* STEP 5: CONFIRMATION SCREEN */}
        {currentStep === 5 && confirmedBooking ? (
          <div className="booking-layout-grid single-column">
            <div className="confirmation-card">
              <div className="confirm-success-icon">✓</div>
              <span className="eyebrow" style={{ marginBottom: '8px', display: 'block' }}>Booking Confirmed</span>
              <h2 className="confirm-title">SESSION RESERVED</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Your production reservation has been received. Our executive producer will review your brief and contact you within 24 hours.
              </p>

              <div className="confirm-ref-badge">
                REFERENCE CODE: {confirmedBooking.id}
              </div>

              <div className="confirm-receipt-box">
                <div className="confirm-receipt-header">Reservation Summary</div>
                <div className="receipt-row">
                  <span className="receipt-label">Package</span>
                  <span className="receipt-val">{confirmedBooking.packageName}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Date</span>
                  <span className="receipt-val">{confirmedBooking.date}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Time Slot</span>
                  <span className="receipt-val">{confirmedBooking.timeSlot}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Client</span>
                  <span className="receipt-val">{confirmedBooking.clientName}</span>
                </div>
                <div className="receipt-row" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="receipt-label" style={{ fontWeight: 'bold' }}>Total Reserved Amount</span>
                  <span className="receipt-val" style={{ color: 'var(--accent)', fontSize: '18px', fontWeight: 'bold' }}>
                    ${confirmedBooking.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="confirm-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setCurrentStep(1);
                    setConfirmedBooking(null);
                  }}
                >
                  Book Another Session
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 1-4: MULTI-STEP WORKFLOW WITH STICKY SUMMARY */
          <div className="booking-layout-grid">
            
            {/* LEFT MAIN PANEL */}
            <div className="booking-panel-card">

              {/* STEP 1: PACKAGE SELECTION */}
              {currentStep === 1 && (
                <div>
                  <h2 className="panel-section-title">Select Production Tier</h2>
                  <p className="panel-section-subtitle">
                    Choose the ideal scale for your visual production. All packages include high-end cinema glass and post-production color science.
                  </p>

                  {/* Filter Tabs */}
                  <div className="category-filter-tabs">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Packages Grid */}
                  <div className="packages-grid">
                    {filteredPackages.map(pkg => {
                      const isSelected = selectedPackage?.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          className={`package-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          {pkg.popular && <span className="package-popular-tag">MOST REQUESTED</span>}
                          
                          <div className="package-header">
                            <span className="package-category-label">{pkg.category}</span>
                            <h3 className="package-title">{pkg.title}</h3>
                          </div>

                          <div className="package-price-wrap">
                            <span className="package-price">${pkg.price.toLocaleString()}</span>
                            <span className="package-price-unit">/ {pkg.duration}</span>
                          </div>

                          <p className="package-desc">{pkg.description}</p>

                          <div className="package-specs">
                            {pkg.specs.map((spec, idx) => (
                              <div key={idx} className="spec-item">
                                <span className="spec-icon">✦</span>
                                <span>{spec}</span>
                              </div>
                            ))}
                          </div>

                          <div className="package-select-indicator">
                            {isSelected ? '✓ Package Selected' : 'Select Package'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: DATE & TIME SLOT SELECTION */}
              {currentStep === 2 && (
                <div>
                  <h2 className="panel-section-title">Schedule Shoot Date & Time</h2>
                  <p className="panel-section-subtitle">
                    Select your preferred production date and lighting slot. Golden hour and night slots fill quickly.
                  </p>

                  <div className="schedule-container">
                    
                    {/* Calendar Box */}
                    <div className="calendar-box">
                      <div className="calendar-month-header">
                        <span className="calendar-month-title">
                          {currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="calendar-nav-btn"
                            onClick={() => handleMonthChange(-1)}
                            disabled={currentMonthDate <= new Date(today.getFullYear(), today.getMonth(), 1)}
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            className="calendar-nav-btn"
                            onClick={() => handleMonthChange(1)}
                          >
                            ›
                          </button>
                        </div>
                      </div>

                      <div className="calendar-weekdays-grid">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>

                      <div className="calendar-days-grid">
                        {renderCalendarDays()}
                      </div>
                    </div>

                    {/* Time Slots Box */}
                    <div className="time-slots-box">
                      <span className="time-slots-label">Select Lighting / Time Window</span>
                      <div className="time-slots-list">
                        {TIME_SLOTS.map(slot => {
                          const isSelected = selectedTimeSlot?.id === slot.id;
                          return (
                            <div
                              key={slot.id}
                              className={`time-slot-card ${isSelected ? 'selected' : ''}`}
                              onClick={() => setSelectedTimeSlot(slot)}
                            >
                              <div className="slot-info">
                                <span className="slot-icon">{slot.icon}</span>
                                <div>
                                  <span className="slot-name">{slot.name}</span>
                                  <span className="slot-time">{slot.time}</span>
                                </div>
                              </div>
                              <span className="slot-badge">{slot.badge}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 3: BESPOKE ADD-ONS */}
              {currentStep === 3 && (
                <div>
                  <h2 className="panel-section-title">Bespoke Enhancements & Add-Ons</h2>
                  <p className="panel-section-subtitle">
                    Elevate your visual project with custom specialized equipment, aerial cinematography, or analog film stills.
                  </p>

                  <div className="addons-list">
                    {ADDONS_DATA.map(addon => {
                      const isSelected = selectedAddons.some(a => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          className={`addon-card-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleAddon(addon)}
                        >
                          <div className="addon-left">
                            <div className="addon-checkbox">
                              {isSelected ? '✓' : ''}
                            </div>
                            <div>
                              <h4 className="addon-title">{addon.title}</h4>
                              <p className="addon-desc">{addon.description}</p>
                            </div>
                          </div>
                          <span className="addon-price">+${addon.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: CLIENT & LOCATION DETAILS */}
              {currentStep === 4 && (
                <div>
                  <h2 className="panel-section-title">Client & Narrative Details</h2>
                  <p className="panel-section-subtitle">
                    Provide your contact information and creative brief so our directorship team can prepare for the session.
                  </p>

                  <div className="form-grid">
                    <div>
                      <label className="booking-form-label" htmlFor="fullName">Full Name *</label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="booking-form-input"
                        placeholder="e.g. Elena Rostova"
                        value={clientForm.fullName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="booking-form-label" htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="booking-form-input"
                        placeholder="e.g. elena@studio.com"
                        value={clientForm.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="booking-form-label" htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="booking-form-input"
                        placeholder="+1 (555) 000-0000"
                        value={clientForm.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="booking-form-label" htmlFor="location">Shoot Location / Venue</label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        className="booking-form-input"
                        placeholder="e.g. Cinematic Eye Studio B / On Location"
                        value={clientForm.location}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group-full">
                      <label className="booking-form-label" htmlFor="projectTitle">Project Title / Working Name</label>
                      <input
                        id="projectTitle"
                        name="projectTitle"
                        type="text"
                        className="booking-form-input"
                        placeholder="e.g. Summer Editorial 2026 Film"
                        value={clientForm.projectTitle}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group-full">
                      <label className="booking-form-label" htmlFor="brief">Creative Brief & Special Requirements</label>
                      <textarea
                        id="brief"
                        name="brief"
                        className="booking-form-textarea"
                        placeholder="Describe the visual theme, mood, references, or specific deliverables required..."
                        value={clientForm.brief}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="form-group-full">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <input
                          type="checkbox"
                          name="agreedToTerms"
                          checked={clientForm.agreedToTerms}
                          onChange={handleInputChange}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                        />
                        <span>I accept the studio production terms & copyright reservation agreement.</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT STICKY LIVE SUMMARY SIDEBAR */}
            <aside className="booking-summary-card">
              <div className="summary-header">
                <span className="eyebrow" style={{ fontSize: '10px' }}>Live Order Calculation</span>
                <h3 className="summary-title">RESERVATION SUMMARY</h3>
              </div>

              <div className="summary-details-list">
                <div className="summary-row">
                  <span className="summary-row-label">Package Tier</span>
                  <span className="summary-row-val accent">{selectedPackage ? selectedPackage.title : 'None'}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-row-label">Base Cost</span>
                  <span className="summary-row-val">${basePrice.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-row-label">Shoot Date</span>
                  <span className="summary-row-val">{selectedDate}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-row-label">Time Window</span>
                  <span className="summary-row-val">{selectedTimeSlot ? selectedTimeSlot.name : 'Not selected'}</span>
                </div>

                {selectedAddons.length > 0 && (
                  <div>
                    <div className="summary-row" style={{ marginTop: '4px' }}>
                      <span className="summary-row-label">Add-Ons ({selectedAddons.length})</span>
                      <span className="summary-row-val">+${addonsTotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-addons-mini">
                      {selectedAddons.map(a => (
                        <div key={a.id} className="summary-addon-item">
                          <span>• {a.title}</span>
                          <span>+${a.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span className="summary-row-label">Subtotal</span>
                  <span className="summary-row-val">${subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-row-label">Est. Tax & Processing (8%)</span>
                  <span className="summary-row-val">${estimatedTax.toLocaleString()}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total-row">
                  <span className="total-label">Total Amount</span>
                  <span className="total-amount">${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="booking-nav-buttons">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    className="btn-continue"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-continue"
                    disabled={isSubmitting || !clientForm.fullName || !clientForm.email || !clientForm.agreedToTerms}
                    onClick={handleSubmitBooking}
                  >
                    <span>{isSubmitting ? 'Processing...' : 'Confirm Reservation'}</span>
                  </button>
                )}
              </div>
            </aside>

          </div>
        )}

      </div>
    </div>
  );
}
