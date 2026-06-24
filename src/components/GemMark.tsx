import { useEffect, useState } from 'react';
import { GemSmoke } from '@paper-design/shaders-react';

/*
 * GemMark  -  a shape (the cloud) rendered as a live @paper-design/shaders Gem
 * Smoke field. The smoke is our primary teal; the base (colorBack) matches the
 * page background exactly, so the canvas is invisible and only the cloud-shaped
 * smoke shows. Keep outerGlow low so the smoke stays inside the silhouette -
 * that's what makes it read as a cloud rather than a rectangular field.
 */

const SMOKE_LIGHT = ['#0d9488', '#14b8a6', '#0f766e'];
const SMOKE_DARK = ['#34bfa1', '#2dd4bf', '#119e88'];
const BACK_LIGHT = '#faf8f3';
const BACK_DARK = '#1a1714';

type Props = { image: string; size?: number; speed?: number; outerGlow?: number; innerGlow?: number };

export default function GemMark({ image, size = 0.66, speed = 1, outerGlow = 0.18, innerGlow = 1 }: Props) {
  const [dark, setDark] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const readTheme = () => setDark(root.dataset.theme === 'dark');
    readTheme();
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const obs = new MutationObserver(readTheme);
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const colors = dark ? SMOKE_DARK : SMOKE_LIGHT;
  const colorBack = dark ? BACK_DARK : BACK_LIGHT;

  return (
    <div style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <GemSmoke
        image={image}
        colors={colors}
        colorBack={colorBack}
        colorInner={colorBack}
        speed={reduce ? 0 : speed}
        size={size}
        scale={1}
        innerGlow={innerGlow}
        outerGlow={outerGlow}
        innerDistortion={0.8}
        outerDistortion={0.4}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
