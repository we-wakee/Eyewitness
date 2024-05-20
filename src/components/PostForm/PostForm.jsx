import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import storageService from "../../appwrite/bucket";
import postService from "../../appwrite/post";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button,  Input,  } from "../index";
import { addPost, updatePost } from "../../store/postSlice";
const PostForm = ({ post }) => {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        crimeType: post?.crimeType || "",
        crimeImage: post?.crimeImage || "",
        crimeLocation: post?.crimeLocation || "",
        crimeDescription: post?.crimeDescription || "",
      },
    });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const submit = async (data) => {
    if (post) {
      const file = data.crimeImage[0]
        ? await storageService.uploadFile(data.crimeImage[0])
        : null;

      if (file) {
        setError("");
        try {
          storageService.deleteFile(post.crimeImage);
        } catch (error) {
          setError(error.message);
        }
      }

      const dbPost = await postService.updatePost(post.$id, {
        ...data,
        crimeImage: file ? file.$id : undefined,
      });

      if (dbPost) {
        dispatch(updatePost(dbPost));
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = data.crimeImage[0]
        ? await storageService.uploadFile(data.crimeImage[0])
        : null;
      if (file) {
        const fileId = file.$id;
        data.crimeImage = fileId;
        const dbPost = await postService.createPost({
          ...data,
          userId: userData.$id,
          userName: userData.name,
        });

        if (dbPost) {
          dispatch(addPost(dbPost));
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

 

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-full  px-2">
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <Input
          label="Crime Type :"
          className="mb-4 "
          placeholder="Robbery/Murder/Kidnap..."
          {...register("crimeType", { required: true })}
        />
        
        
      </div>
      <div className="w-full p-2">
        <Input
          label="Crime Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("crimeImage", {
            required: !post,
          })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={storageService.getFilePreview(post.crimeImage)}
              alt={post.crimeType}
              className="rounded-lg"
            />
          </div>
        )}
        <div className="w-full md:w-2/3 px-2">
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <Input
          label="Crime Location :"
          className="mb-4"
          placeholder="location"
          {...register("crimeLocation", { required: true })}
        />
        
        <Input
          label="Crime Description :"
          className="mb-4"
          placeholder="description"
          {...register("crimeDescription", { required: true })}
        />
        
        
      </div>

        

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-30"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
