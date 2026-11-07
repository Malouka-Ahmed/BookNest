import './Hero.css';

export default function Hero({ title, subtitle, image = '/images/hero.jpg', small = false, children }) {
  return (
    <section
      className={small ? 'hero hero-small' : 'hero'}
      style={{ backgroundImage: `linear-gradient(rgba(62, 38, 25, 0.65), rgba(62, 38, 25, 0.65)), url(${image})` }}
    >
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children && <div className="hero-actions">{children}</div>}
      </div>
    </section>
  );
}