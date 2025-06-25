import React, { useEffect, useState } from 'react';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      });
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setCurrentPage(1);
    const startIndex = 0;
    const endIndex = itemsPerPage;
    setDisplayedProducts(filtered.slice(startIndex, endIndex));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, sortOrder, products, favorites, showFavoritesOnly]);

  useEffect(() => {
    let filtered = [...products];

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedProducts(filtered.slice(startIndex, endIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const toggleFavorite = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(fid => fid !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const totalPages = Math.ceil(
    products.filter(p =>
      (categoryFilter === 'All' || p.category === categoryFilter) &&
      (!showFavoritesOnly || favorites.includes(p.id))
    ).length / itemsPerPage
  );

  return (
    <div>
      {/* Sticky filter/sort bar */}
      <div className="filter-bar">
        <select onChange={e => setCategoryFilter(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select onChange={e => setSortOrder(e.target.value)}>
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>

        <button onClick={() => setShowFavoritesOnly(prev => !prev)}>
          {showFavoritesOnly ? 'Show All' : 'Show Favorites'}
        </button>
      </div>

      {/* Product grid */}
      <div className="products-container">
        {displayedProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          displayedProducts.map(product => (
            <div
              className={`product-card ${favorites.includes(product.id) ? 'favorited' : ''}`}
              key={product.id}
            >
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <p>{product.category}</p>
              <p>Rating: {product.rating.rate}</p>
              <button onClick={() => toggleFavorite(product.id)}>
                {favorites.includes(product.id) ? '❤️ Unfavorite' : '🤍 Favorite'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={i + 1 === currentPage ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Products;
