import conf from "../conf/conf";
import { Client, Databases, Query , ID} from "appwrite";

export class PostService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
  }

  async createPost({
  crimeType,
  crimeImage,
  crimeLocation,
  crimeDescription,
  userName,
  userId,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          crimeType,
  crimeImage,
  crimeLocation,
  crimeDescription,
  userName,
  userId,
        }
      );
    } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
    }
  }

  async updatePost($id, { crimeType,
    crimeImage,
    crimeLocation,
    crimeDescription 
  
  }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        $id,
        {
          crimeType,
          crimeImage,
          crimeLocation,
          crimeDescription
        }
      );
    } catch (error) {
      console.log("Appwrite :: updatePost :: error", error);
    }
  }

  async deletePost($id) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        $id
      );
      return true;
    } catch (error) {
      console.log("Appwrite :: deletePost :: error", error);
      return false;
    }
  }

  async getPost($id) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        $id
      );
    } catch (error) {
      console.log("Appwrite :: getPost :: error", error);
    }
  }

  async getPosts() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        
      );
    } catch (error) {
      console.log("Appwrite :: getPosts :: error", error);
    }
  }
}

const postService = new PostService();

export default postService;
