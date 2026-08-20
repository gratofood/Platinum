import React, { useState } from 'react';
import { PRICING_PACKAGES } from '../data/projectsData';
import { Check, Calculator, ArrowRight, Sparkles } from 'lucide-react';

export default function Pricing({ onSelectPackageForOrder }) {
  const [calcArea, setCalcArea] = useState(100);
  const [selectedPlanId, setSelectedPlanId] = useState('standard');

  const selectedPlan = PRICING_PACKAGES.find(p => p.id === selectedPlanId) || PRICING_PACKAGES[1];
  const calculatedTotal = calcArea * selectedPlan.pricePerSqM;

  return (
    <div className="section-wrapper">
      {/* Title */}
      <div className="section-title-group">
        <span className="section-subtitle">Tariflar & Hsob-kitob</span>
        <h2 className="section-main-title">Shaffof Narxlar</h2>
      </div>

      {/* Interactive Calculator Card */}
      <div className="calculator-box">
        <div className="calc-header">
          <div className="brand-logo-badge" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>
            <Calculator size={18} />
          </div>
          <div>
            <h3>Interaktiv Narx Kalkulyatori</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ob'ekt maydonini kiriting va taxminiy narxni hisoblang</p>
          </div>
        </div>

        <div className="calc-input-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="calc-input-label">Maydon hajmi (m²):</label>
            <span style={{ color: 'var(--accent-gold-light)', fontWeight: '700', fontSize: '1.1rem' }}>
              {calcArea} m²
            </span>
          </div>

          <input
            type="range"
            min="20"
            max="400"
            step="5"
            value={calcArea}
            onChange={(e) => setCalcArea(Number(e.target.value))}
            className="custom-range-slider"
          />

          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            {PRICING_PACKAGES.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPlanId(pkg.id)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  border: selectedPlanId === pkg.id ? '1px solid var(--accent-gold)' : '1px solid var(--border-light)',
                  background: selectedPlanId === pkg.id ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                  color: selectedPlanId === pkg.id ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {pkg.name} (${pkg.pricePerSqM}/m²)
              </button>
            ))}
          </div>
        </div>

        <div className="calc-result-row">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Jami smeta qiymati:</span>
            <span className="calc-result-price">${calculatedTotal.toLocaleString()}</span>
          </div>
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 18px', fontSize: '0.85rem' }}
            onClick={() => onSelectPackageForOrder(selectedPlan.name, calcArea)}
          >
            <span>Tanlash</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Package Cards List */}
      <div className="pricing-cards-container" style={{ marginTop: '10px' }}>
        {PRICING_PACKAGES.map(pkg => (
          <div
            key={pkg.id}
            className={`glass-card pricing-card ${pkg.popular ? 'featured' : ''}`}
          >
            {pkg.popular && (
              <div className="popular-badge">
                <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
                Eng Ommabop
              </div>
            )}

            <h3 className="plan-title">{pkg.name}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {pkg.description}
            </p>

            <div className="plan-price-group">
              <span className="plan-price">${pkg.pricePerSqM}</span>
              <span className="plan-unit">/ 1 m² uchun</span>
            </div>

            <ul className="plan-features">
              {pkg.features.map((feat, idx) => (
                <li key={idx}>
                  <Check size={16} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              className={pkg.popular ? "btn-primary" : "btn-outline"}
              onClick={() => onSelectPackageForOrder(pkg.name, calcArea)}
            >
              <span>{pkg.name} ni Tanlash</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
