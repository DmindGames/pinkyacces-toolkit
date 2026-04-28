import React, { useState, useEffect } from 'react';
import {
  applyProfile,
  setFontScale,
  getFontScale,
  enableReadingRuler,
  disableReadingRuler,
  isReadingRulerEnabled,
  injectContrastStyles,
  TourEngine,
  type ProfileName,
} from 'pinkyacces-toolkit';

const tour = new TourEngine({
  steps: [
    {
      target: '#app-header',
      title: 'Panel de accesibilidad',
      description: 'Controla todas las opciones de accesibilidad desde aquí.',
      position: 'bottom',
    },
    {
      target: '#profile-selector',
      title: 'Perfiles rápidos',
      description: 'Aplica configuraciones preestablecidas para distintas necesidades.',
      position: 'bottom',
    },
    {
      target: null,
      title: '¡Listo!',
      description: 'Ya conoces las funciones principales. ¡Personaliza tu experiencia!',
      position: 'center',
    },
  ],
  callbacks: {
    onComplete: () => console.log('Tour completado'),
  },
});

export default function App() {
  const [profile, setProfile] = useState<ProfileName>('default');
  const [rulerActive, setRulerActive] = useState(false);
  const [fontScale, setFontScaleState] = useState(1);

  useEffect(() => {
    injectContrastStyles();
  }, []);

  const handleProfileChange = (newProfile: ProfileName) => {
    setProfile(newProfile);
    applyProfile(newProfile);
    setFontScaleState(getFontScale());
  };

  const handleFontScale = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(3, fontScale + delta));
    setFontScale(newScale);
    setFontScaleState(newScale);
  };

  const toggleRuler = () => {
    if (isReadingRulerEnabled()) {
      disableReadingRuler();
      setRulerActive(false);
    } else {
      enableReadingRuler();
      setRulerActive(true);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui' }}>
      <h1 id="app-header" style={{ color: '#f472b6' }}>🌸 Pinkyacces Toolkit – React</h1>

      <section id="profile-selector" style={{ margin: '24px 0' }}>
        <h2>Perfiles de accesibilidad</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['default', 'low-vision', 'dyslexia', 'senior', 'color-blind'] as ProfileName[]).map(p => (
            <button
              key={p}
              onClick={() => handleProfileChange(p)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                background: profile === p ? '#f472b6' : '#e5e7eb',
                color: profile === p ? '#fff' : '#374151',
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section style={{ margin: '24px 0' }}>
        <h2>Controles manuales</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => handleFontScale(0.1)} style={btnStyle}>A+ Fuente</button>
          <button onClick={() => handleFontScale(-0.1)} style={btnStyle}>A- Fuente</button>
          <button onClick={toggleRuler} style={{ ...btnStyle, background: rulerActive ? '#8b5cf6' : '#6b7280' }}>
            {rulerActive ? '📏 Desactivar regla' : '📏 Regla de lectura'}
          </button>
          <button onClick={() => tour.start()} style={btnStyle}>🎯 Tour</button>
        </div>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>Escala actual: {fontScale.toFixed(1)}x</p>
      </section>

      <article>
        <h2>Sobre la librería</h2>
        <p>
          <strong>pinkyacces-toolkit</strong> es una librería TypeScript para añadir funciones
          de accesibilidad a cualquier aplicación web, incluyendo tours interactivos de onboarding.
        </p>
      </article>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 6,
  border: 'none',
  background: '#f472b6',
  color: '#fff',
  cursor: 'pointer',
};
