import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useUser } from "../Context/UserContext";

const FarmerCommunity = () => {
  const { user } = useUser();

  const [farmers, setFarmers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    fetchFarmers();
    fetchPosts();
  }, []);

  const fetchFarmers = async () => {
    const { data } = await supabase
      .from("users")
      .select("id,name,village,expertise")
      .eq("role", "farmer");

    setFarmers(data || []);
  };

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  const addPost = async () => {
    if (newPost.trim().length < 10) {
      alert("Post must be at least 10 characters");
      return;
    }

    await supabase.from("community_posts").insert({
      farmer_id: user.id,
      content: newPost,
    });

    setNewPost("");
    fetchPosts();
  };

  return (
    <div className="p-8 bg-gradient-to-br from-green-50 via-blue-50 to-teal-100 min-h-screen">
      <div className="bg-gradient-to-r from-green-500 via-blue-600 to-teal-600 text-white p-8 rounded-lg mb-6 text-center">
        <h1 className="text-5xl font-bold mb-3">Farmer Community Platform</h1>
        <p>Connect with farmers and share knowledge</p>
      </div>

      {/* Farmer Directory */}

      <div className="bg-white p-8 rounded-lg shadow-2xl mb-6">
        <h2 className="text-3xl font-bold text-green-600 mb-6">
          Farmers Directory
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <div key={farmer.id} className="p-6 bg-green-50 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-blue-600">
                {farmer.name}
              </h3>

              <p>
                <strong>Village:</strong> {farmer.village}
              </p>
              <p>
                <strong>Expertise:</strong> {farmer.expertise}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Community Posts */}

      <div className="bg-white p-8 rounded-lg shadow-2xl mb-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Community Posts
        </h2>

        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something..."
          className="w-full p-4 border rounded-lg"
        />

        <button
          onClick={addPost}
          className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg"
        >
          Post
        </button>

        <div className="space-y-6 mt-6">
          {posts.map((post) => (
            <div key={post.id} className="p-6 bg-blue-50 rounded-lg shadow">
              <p className="text-gray-700">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerCommunity;
