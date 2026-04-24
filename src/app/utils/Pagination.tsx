// Replace your page number section with this logic

const getVisiblePages = () => {
  const pages = [];

  // Always show first 3 pages
  for (let i = 1; i <= Math.min(3, totalPages); i++) {
    pages.push(i);
  }

  // Show dots + last page if more than 4 pages
  if (totalPages > 4) {
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
};
