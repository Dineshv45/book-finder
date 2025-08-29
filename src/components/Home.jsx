import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const coverUrl = (book) => {
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  } else if (book.edition_key?.length > 0) {
    return `https://covers.openlibrary.org/b/olid/${book.edition_key[0]}-M.jpg`;
  }
  return null;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // Fetch trending books on first load
  useEffect(() => {
    document.title = "📚 Book Finder";
    fetchBooks("the", 1, true); // default trending search
  }, []);

  // Fetch books on search
  useEffect(() => {
    if (submittedQuery) {
      setBooks([]);
      setPage(1);
      fetchBooks(submittedQuery, 1, true);
    }
  }, [submittedQuery]);

  async function fetchBooks(q, pageNum = 1, reset = false) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          q
        )}&page=${pageNum}`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();

      const newBooks = data.docs || [];
      setBooks((prev) => (reset ? newBooks : [...prev, ...newBooks]));
      setHasMore(pageNum * 100 < (data.numFound || 0));

      if (reset && (data.numFound || 0) === 0) {
        setError("No results found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSubmittedQuery(query);
  }

  function loadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(submittedQuery || "the", nextPage); // continue trending if no search
  }

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <h1 className="title">📚 Book Finder</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search any book like Harry Potter, Pride and Prejudice..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <main className="results">
        {/* Skeleton while loading */}
        {loading && books.length === 0 && (
          <div className="grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card skeleton">
                <div className="cover-skeleton"></div>
                <div className="title-skeleton"></div>
                <div className="button-skeleton"></div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="status error">{error}</p>}

        {/* Books Grid */}
        <div className="grid">
          {books.map((book, index) => (
            <div key={book.key || index} className="card">
              {coverUrl(book) ? (
                <img src={coverUrl(book)} alt={book.title} className="cover" />
              ) : (
                <div className="no-cover">No Image</div>
              )}
              <h2>{book.title}</h2>
              <Link
                to={`/book/${book.key?.replace("/works/", "")}`}
                state={{ book }}
                className="more-btn"
              >
                Know More
              </Link>
            </div>
          ))}
        </div>

        {/* Load More */}
        {!loading && hasMore && books.length > 0 && (
          <div style={{ textAlign: "center", margin: "1.5rem" }}>
            <button onClick={loadMore} className="load-more">
              Load More
            </button>
          </div>
        )}

        {loading && books.length > 0 && <p className="status">Loading more...</p>}
      </main>
    </div>
  );
}
