import Hero from '../components/Hero';

export default function Browse() {
  return (
    <>
      <Hero
        small
        title="Browse books"
        subtitle="Search by title, genre, author, or rating."
        image="/images/browse.jpg"
      />

      <div className="container">
        {/* Person 2: add the search bar, filters, and book cards here */}
      </div>
    </>
  );
}