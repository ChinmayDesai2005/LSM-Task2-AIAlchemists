import React, { useState } from "react";
import "./BlogsPage.css";

const blogsData = [
  {
    id: 1,
    title: "Exploring the Beauty of Nature",
    content: "Nature's beauty is truly awe-inspiring, with mountains, rivers, and diverse flora and fauna.",
    author: "John Doe",
    date: "2025-01-18",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Richness of Marathi Culture",
    content: "Marathi culture is known for its vibrant festivals, traditions, and literature.",
    author: "Jane Smith",
    date: "2025-01-17",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Festivals of Gujarat",
    content: "Gujarat's festivals, like Navratri and Uttarayan, are full of joy and color.",
    author: "Amit Patel",
    date: "2025-01-16",
    readTime: "7 min read",
  },
];

const BlogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = blogsData.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="blogs-page">
      <aside className="sidebar">
        <div className="sidebar-icon">M</div>
        <div className="sidebar-icon">W</div>
        <div className="sidebar-icon">D</div>
        <div className="sidebar-icon">+</div>
      </aside>
      <div className="main-content">
        <header className="header">
          <h1>Medium is a place to write, read, and connect</h1>
          <p>It's easy and free to post your thinking on any topic and connect with millions of readers.</p>
          <button className="cta-button">Start Writing</button>
        </header>
        <section className="search-section">
          <input
            type="text"
            placeholder="Search for a blog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>
        <section className="blogs-container">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <h3>{blog.title}</h3>
              <p>By {blog.author} - {blog.readTime}</p>
              <p>{blog.date}</p>
            </div>
          ))}
          {filteredBlogs.length === 0 && <p>No blogs found.</p>}
        </section>
        <section className="trending-section">
          <h2>Trending on Medium</h2>
          <div className="trending-cards">
            {blogsData.map((blog) => (
              <div key={blog.id} className="trending-card">
                <h4>{blog.title}</h4>
                <p>By {blog.author}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogsPage;
