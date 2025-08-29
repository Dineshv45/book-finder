import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BookDetails.css";

export default function BookDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book;
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (book) {
      document.title = `${book.title} - 📚 Book Finder`;

      // 🔑 check edition for preview availability
      if (book.edition_key?.length > 0) {
        const olid = book.edition_key[0];
        fetch(
          `https://openlibrary.org/api/books?bibkeys=OLID:${olid}&jscmd=viewapi&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            const info = data[`OLID:${olid}`];
            if (info && info.preview_url) {
              setPreviewUrl(info.preview_url);
            }
          })
          .catch((err) => console.error("Books API error:", err));
      }
    }

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [book]);

  if (!book) {
    return (
      <div className="book-details">
        <p>No book details available.</p>
        <button onClick={() => navigate(-1)}>⬅ Go Back</button>
      </div>
    );
  }

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : book.edition_key?.length > 0
    ? `https://covers.openlibrary.org/b/olid/${book.edition_key[0]}-L.jpg`
    : null;

  return (
    <div className="book-details">
      {loading ? (
        <div className="detail-skeleton">
          <div className="cover-skeleton"></div>
          <div className="title-skeleton"></div>
          <div className="title-skeleton"></div>
          <div className="button-skeleton"></div>
        </div>
      ) : (
        <>
          <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>

          {coverUrl && <img src={coverUrl} alt={book.title} className="detail-cover" />}

          <h1 className="detail-title">{book.title}</h1>
          {book.author_name && <p className="detail-author">Author: <span>{book.author_name.join(", ")}</span></p>}
          {book.first_publish_year && <p className="detail-year">First Published: <span>{book.first_publish_year}</span></p>}
          {book.subject && <p className="detail-subjects">Subjects: <span>{book.subject.slice(0, 5).join(", ")}</span></p>}

          <div className="actions">
            {previewUrl && (
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="buy-now">
                📖 Read Preview
              </a>
            )}
            <a
              href={`https://openlibrary.org${book.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="buy-now"
            >
              🌐 View on OpenLibrary
            </a>
          </div>
        </>
      )}
    </div>
  );
}
