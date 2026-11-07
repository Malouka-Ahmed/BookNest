import './VideoSection.css';

export default function VideoSection({ videoId, title = 'How BookNest works' }) {
  return (
    <section className="video-section">
      <h2>{title}</h2>
      <div className="video-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}