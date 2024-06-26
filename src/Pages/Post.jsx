import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import storageService from "../appwrite/bucket";
import postService from "../appwrite/post";
import { Button, Container } from "../components/index";

import { useDispatch, useSelector } from "react-redux";
import { deletePost as deletePostSlice } from "../store/postSlice";
export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  const allPosts = useSelector((state) => state.post.posts);
  useEffect(() => {
    if (slug) {
      if (allPosts)
        allPosts.map((post) => (slug === post.$id ? setPost(post) : null));
      else navigate("/");
    } else navigate("/");
  }, [slug, navigate, allPosts]);

  const deletePost = () => {
    postService.deletePost(post.$id).then((status) => {
      if (status) {
        dispatch(deletePostSlice(post.$id));
        storageService.deleteFile(post.crimeImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8 max-w-5xl m-auto rounded-xl">
      <h1 className="text-xl sm:text-none text-center text-gray-600 pb-4">
        <p className="font-bold inline"> Posted By </p>: {post.userName}
      </h1>
      <Container>
        <div className="w-full text-center grid gap-3 sm:flex  mb-2 sm:relative   p-2">
          <img
            src={storageService.getFilePreview(post.crimeImage)}
            alt={post.crimeType}
            className="rounded-xl max-wd-300 sm:max-w-md m-auto"
          />

          {isAuthor && (
            <div className="text-center mt-2 sm:absolute sm:right-6 sm:top-6 ">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6 ">
          <h1 className="text-2xl font-bold text-center">{post.crimeType} ({post.crimeLocation})  </h1>
        </div>
        <div className=" text-center browser-css">{post.crimeDescription}</div>
      </Container>
    </div>
  ) : null;
}
