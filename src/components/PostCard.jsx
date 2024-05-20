import React from "react";
import storageService from "../appwrite/bucket";
import { Link } from "react-router-dom";
const PostCard = ({ $id, crimeType, crimeImage }) => {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-3">
          <img
            src={storageService.getFilePreview(crimeImage)}
            alt={crimeType}
            className="rounded-xl mx-auto"
          />
        </div>
        <h2 className="text-xl font-bold">{crimeType}</h2>
      </div>
    </Link>
  );
};

export default PostCard;
