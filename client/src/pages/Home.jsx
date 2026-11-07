import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <>
      <Hero
        title="Discover your next favorite book"
        subtitle="Track what you read, rate it, and set your yearly reading goals."
        image="/images/hero.jpg"
      >
        <Link to="/browse" className="btn btn-accent">Browse books</Link>
        <Link to="/register" className="btn">Join BookNest</Link>
      </Hero>

      <div className="container">
        <h2>Featured books</h2>
        {/* Person 3: add the featured books from the API here */}
      </div>
    </>
  );
}