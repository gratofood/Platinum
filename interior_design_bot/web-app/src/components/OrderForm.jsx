import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Phone, User, Home, Maximize2, MessageSquare, Layers } from 'lucide-react';

export default function OrderForm({ prefilledPackage, prefilledArea }) {
  const [tgUser, setTgUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    propertyType: 'Kvartira',
    area: prefilledArea || 80,
    packageType: prefilledPackage || 'ВЫГОДНЫЙ',
    comment: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Detect Telegram WebApp user context
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const u = window.Telegram.WebApp.initDataUnsafe.user;
      setTgUser(u);
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || `${u.first_name || ''} ${u.last_name || ''}`.trim()
      }));
    }

    if (prefilledPackage) {
      setFormData(prev => ({ ...prev, packageType: prefilledPackage }));
    }
    if (prefilledArea) {
      setFormData(prev => ({ ...prev, area: prefilledArea }));
    }
  }, [prefilledPackage, prefilledArea]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Iltimos, ismingiz va telefon raqamingizni kiritishni unutmang!");
      return;
    }

    setLoading(true);

    const BOT_TOKEN = '8904637807:AAE5vtKeRyR9YzlQkbfnfwweRc8N-BNqSmY';
    const ADMIN_CHAT_ID = '6877877555';

    const usernameStr = tgUser?.username ? `@${tgUser.username}` : 'Noma\'lum';
    const timeStr = new Date().toLocaleString();

    const adminMsg = `
🔔 <b>YANGI INTERYER DESIGN BUYURTMASI!</b>

👤 <b>Mijoz:</b> ${formData.fullName} (${usernameStr})
📞 <b>Telefon:</b> <code>${formData.phone}</code>
🏠 <b>Ob'ekt:</b> ${formData.propertyType} (${formData.area} m²)
💎 <b>Tarif:</b> ${formData.packageType}
📝 <b>Izoh:</b> ${formData.comment || 'Yo\'q'}
📅 <b>Vaqt:</b> ${timeStr}
    `.trim();

    try {
      // 1. Send directly to Admin Chat ID via CORS-safe GET request
      const adminUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${ADMIN_CHAT_ID}&text=${encodeURIComponent(adminMsg)}&parse_mode=HTML`;
      try {
        await fetch(adminUrl, { mode: 'no-cors' });
      } catch (err) {
        const adminImg = new Image();
        adminImg.src = adminUrl;
      }

      // 2. Send confirmation to User if inside Telegram (only if user is not the admin)
      if (tgUser?.id && String(tgUser.id) !== String(ADMIN_CHAT_ID)) {
        const userMsg = `
✅ <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>

📋 <b>Buyurtma tafsilotlari:</b>
👤 <b>Ism:</b> ${formData.fullName}
📞 <b>Tel:</b> ${formData.phone}
🏠 <b>Ob'ekt:</b> ${formData.propertyType} (${formData.area} m²)
💎 <b>Tarif:</b> ${formData.packageType}
${formData.comment ? `📝 <b>Izoh:</b> ${formData.comment}` : ''}

⏰ Mutaxassisimiz tez orada siz bilan bog'lanadi!
        `.trim();

        const userUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${tgUser.id}&text=${encodeURIComponent(userMsg)}&parse_mode=HTML`;
        try {
          await fetch(userUrl, { mode: 'no-cors' });
        } catch (err) {
          const userImg = new Image();
          userImg.src = userUrl;
        }
      }

      // 3. Trigger sendData if available
      if (window.Telegram?.WebApp?.sendData) {
        try {
          window.Telegram.WebApp.sendData(JSON.stringify({
            action: 'NEW_DESIGN_ORDER',
            fullName: formData.fullName,
            phone: formData.phone,
            propertyType: formData.propertyType,
            area: `${formData.area} m²`,
            packageType: formData.packageType,
            comment: formData.comment,
            tgUsername: usernameStr,
            createdAt: timeStr
          }));
        } catch (e) {
          // ignore inline sendData error
        }
      }
    } catch (error) {
      console.error('Telegram API error:', error);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="section-wrapper" style={{ justifyContent: 'center', minHeight: '60vh' }}>
        <div className="success-banner">
          <div className="success-icon">
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem' }}>
            Buyurtma Qabul Qilindi!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Rahmat, <strong style={{ color: 'var(--accent-gold-light)' }}>{formData.fullName}</strong>! Sizning loyiha so'rovingiz muvaffaqiyatli Telegram botimizga uzatildi.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Mutaxassisimiz tez orada <strong>{formData.phone}</strong> raqami orqali siz bilan bog'lanadi.
          </p>

          <button
            className="btn-outline"
            style={{ marginTop: '16px' }}
            onClick={() => {
              setSubmitted(false);
              if (window.Telegram?.WebApp?.close) {
                window.Telegram.WebApp.close();
              }
            }}
          >
            Yopish & Botga Qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-wrapper">
      {/* Title */}
      <div className="section-title-group">
        <span className="section-subtitle">Aloqa & Buyurtma</span>
        <h2 className="section-main-title">Dizayn Buyurtma Berish</h2>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '24px 20px' }}>
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={15} style={{ color: 'var(--accent-gold)' }} />
            <span>Ismingiz va Familiyangiz *</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Masalan: Jamshid Aliyev"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={15} style={{ color: 'var(--accent-gold)' }} />
            <span>Telefon Raqamingiz *</span>
          </label>
          <input
            type="tel"
            className="form-input"
            placeholder="+998 90 123 45 67"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        {/* Property Type */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Home size={15} style={{ color: 'var(--accent-gold)' }} />
            <span>Ob'ekt Turi</span>
          </label>
          <div className="radio-group">
            {['Kvartira', 'Kottej / Villa', 'Offis', 'Tijorat xonasi'].map(type => (
              <div
                key={type}
                className={`radio-card ${formData.propertyType === type ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, propertyType: type })}
              >
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area m² & Tariff */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Maximize2 size={14} style={{ color: 'var(--accent-gold)' }} />
              <span>Maydon (m²)</span>
            </label>
            <input
              type="number"
              className="form-input"
              value={formData.area}
              onChange={e => setFormData({ ...formData, area: Number(e.target.value) })}
              min="10"
              max="2000"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Layers size={14} style={{ color: 'var(--accent-gold)' }} />
              <span>Tarif / Uslub</span>
            </label>
            <select
              className="form-select"
              value={formData.packageType}
              onChange={e => setFormData({ ...formData, packageType: e.target.value })}
            >
              <option value="START">START ($13.5/m²)</option>
              <option value="ВЫГОДНЫЙ">ВЫГОДНЫЙ ($16.5/m²)</option>
              <option value="VIP">VIP ($35/m²)</option>
            </select>
          </div>
        </div>

        {/* Additional Comment */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageSquare size={15} style={{ color: 'var(--accent-gold)' }} />
            <span>Qo'shimcha Istaklar / Izoh</span>
          </label>
          <textarea
            className="form-textarea"
            placeholder="Dizayn uslubi, xonalar soni va boshqa muhim istaklaringizni yozing..."
            value={formData.comment}
            onChange={e => setFormData({ ...formData, comment: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? (
            <span>Yuborilmoqda...</span>
          ) : (
            <>
              <Send size={18} />
              <span>Buyurtmani Botga Yuborish</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
