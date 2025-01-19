import React, { useEffect, useState } from "react";
import "./BlogsPage.css";
import axios from "axios";

const blogsData = [
  {
    id: 1,
    title: "Exploring the Beauty of Nature",
    content:
      "Nature's beauty is truly awe-inspiring, with mountains, rivers, and diverse flora and fauna.",
    author: "John Doe",
    date: "2025-01-18",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Richness of Marathi Culture",
    content:
      "Marathi culture is known for its vibrant festivals, traditions, and literature.",
    author: "Jane Smith",
    date: "2025-01-17",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Festivals of Gujarat",
    content:
      "Gujarat's festivals, like Navratri and Uttarayan, are full of joy and color.",
    author: "Amit Patel",
    date: "2025-01-16",
    readTime: "7 min read",
  },
];

const BlogsPage = () => {
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  const fetchAllBlogs = async (e) => {
    try {
      const response = await axios.get("http://localhost:8000/blogs");
      setFiltered(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <div className="blogs-page">
      <div className="main-content">
        <section className="blogs-container">
          {filteredBlogs &&
            filteredBlogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <h3>{blog.title}</h3>
                <p>
                  By {blog.author} - {blog.readTime}
                </p>
                <p>{blog.date}</p>
              </div>
            ))}
          {filteredBlogs.length === 0 && <p>No blogs found.</p>}
        </section>
      </div>
    </div>
  );
};

export default BlogsPage;
