import React from "react";
import "./Profile.css";

const data = [
  {
    title: "Exploring the Beauty of Nature",
    language: "Hindi",
    content: "यह ब्लॉग प्रकृति की अद्भुत सुंदरता पर आधारित है।",
    date: "2025-01-18",
  },
  {
    title: "The Richness of Marathi Culture",
    language: "Marathi",
    content: "मराठी संस्कृतीची समृद्ध परंपरा आणि वारसा हा विषय आहे.",
    date: "2025-01-17",
  },
  {
    title: "Festivals of Gujarat",
    language: "Gujarati",
    content: "ગુજરાતના ઉત્સવો અને તેમની વિશેષતાઓ વિશે આ બ્લોગ છે.",
    date: "2025-01-16",
  },
  {
    title: "History of Tamil Literature",
    language: "Tamil",
    content: "இந்திய தமிழ் இலக்கியத்தின் வரலாறு மற்றும் அதன் முக்கியத்துவம்.",
    date: "2025-01-15",
  },
  {
    title: "Famous Dishes of Kerala",
    language: "Malayalam",
    content: "കേരളത്തിലെ പ്രശസ്ത ഭക്ഷണ വിഭവങ്ങളെ കുറിച്ചുള്ള ബ്ലോഗ്.",
    date: "2025-01-14",
  },
];

const Profile = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "********",
  };

  return (
    <div className="profile-page">
      
      <div className="profile-container">
        <section className="profile-info">
          <h2>General</h2>
          <div className="user-profile">
            <img
              className="user-icon"
              src="https://via.placeholder.com/100"
              alt="User Icon"
            />
            <div className="user-details">
              <p>
                <span>Name:</span> {user.name}
              </p>
              <p>
                <span>Email:</span> {user.email}
              </p>
              <p>
                <span>Password:</span> {user.password}
              </p>
            </div>
          </div>
        </section>
        <section className="blogs-section">
          <h2>Your Blogs</h2>
          <div className="blog-cards">
            {data.map((blog, index) => (
              <div className="blog-card" key={index}>
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
                <p>Date: {blog.date}</p>
                <p>Language: {blog.language}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
