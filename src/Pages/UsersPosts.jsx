import React, { useState, useEffect } from "react";
import { Container, PostCard, Button } from "../components/index";
import postService from "../appwrite/post";
import { Query } from "appwrite";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const UsersPosts = () => {
  const [posts, setPosts] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const allposts = useSelector((state) => state.post.posts);
  
  useEffect(() => {
    setPosts(allposts.filter((post) => post.userId === userData.$id));
  }, [allposts]);
  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <h1 className="text-2xl font-bold ">
            No Crime Added by You.
          </h1>
          <Button
            className="hover:bg-blue-800 mt-5"
            onClick={() => navigate("/add-post")}
          >
            Add Crime
          </Button>
        </Container>
      </div>
    );
  }
  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid sm:flex sm:flex-wrap">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="p-2 mx-auto text-center sm:w-1/4 sm:m-0"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default UsersPosts;
