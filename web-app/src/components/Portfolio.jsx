import React, { useState } from 'react';
import { CATEGORIES, PROJECTS } from '../data/projectsData';
import { Maximize2, Clock, MapPin, Sparkles, X, ChevronRight, DollarSign } from 'lucide-react';

export default function Portfolio({ onSelectProjectForOrder }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const filteredProjects = selectedCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <div className="section-wrapper">
      {/* Header Info */}
      <div className="section-title-group">
        <span className="section-subtitle">Portfolio</span>
        <h2 className="section-main-title">Amalga Oshirilgan Ishlar</h2>
      </div>

      {/* Category Filter */}
      <div className="filter-scroll">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      <div className="portfolio-grid">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="glass-card project-card"
            onClick={() => setActiveModalProject(project)}
          >
            <div className="project-image-wrapper">
              <img
                src={project.mainImage}
                alt={project.title}
                className="project-image"
                loading="lazy"
              />
              <span className="project-badge-tag">{project.style}</span>
            </div>

            <div className="project-info-body">
              <div className="project-header-row">
                <h3 className="project-name">{project.title}</h3>
              </div>

              <div className="project-specs">
                {project.pricePerSqM ? (
                  <div className="spec-item" style={{ color: 'var(--accent-gold-light)', fontWeight: '600' }}>
                    <DollarSign size={14} />
                    <span>{project.pricePerSqM}$ / m²</span>
                  </div>
                ) : (
                  <div className="spec-item">
                    <Maximize2 size={14} />
                    <span>{project.area}</span>
                  </div>
                )}
                <div className="spec-item">
                  <Clock size={14} />
                  <span>{project.duration}</span>
                </div>
                <div className="spec-item">
                  <MapPin size={14} />
                  <span>{project.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal Popup */}
      {activeModalProject && (
        <div className="modal-overlay" onClick={() => setActiveModalProject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setActiveModalProject(null)}
            >
              <X size={20} />
            </button>

            <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '16px', height: '220px' }}>
              <img
                src={activeModalProject.mainImage}
                alt={activeModalProject.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <span className="section-subtitle">{activeModalProject.categoryLabel}</span>
            <h2 className="section-main-title" style={{ fontSize: '1.4rem', margin: '4px 0 12px 0' }}>
              {activeModalProject.title}
            </h2>

            <div className="project-specs" style={{ marginBottom: '16px', borderTop: 'none', paddingTop: 0 }}>
              {activeModalProject.pricePerSqM ? (
                <div className="spec-item" style={{ color: 'var(--accent-gold-light)', fontWeight: '600' }}>
                  <DollarSign size={14} /> <span>{activeModalProject.pricePerSqM}$ / m²</span>
                </div>
              ) : (
                <div className="spec-item"><Maximize2 size={14} /> <span>{activeModalProject.area}</span></div>
              )}
              <div className="spec-item"><Clock size={14} /> <span>{activeModalProject.duration}</span></div>
              <div className="spec-item"><MapPin size={14} /> <span>{activeModalProject.location}</span></div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.6' }}>
              {activeModalProject.description}
            </p>

            <h4 style={{ color: 'var(--accent-gold-light)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Asosiy Xususiyatlar:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {activeModalProject.highlights.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                const projName = activeModalProject.title;
                setActiveModalProject(null);
                onSelectProjectForOrder(projName);
              }}
            >
              <span>Shu kabi loyiha buyurtma qilish</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
