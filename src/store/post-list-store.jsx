import { useReducer } from "react";
import { createContext } from "react";

export const PostListContext = createContext({
  postList: [],
  addPost: () => { },
  addInitialPost: () => { },
  deletePost: () => { }
});

const postListReducer = (currPostList, action) => {
  let newPostList = currPostList;
  if (action.type === "DELETE_POST") {
    newPostList = currPostList.filter((post) => post.id !== action.payload.postId);
  }
  else if (action.type === "ADD_POST") {
    newPostList = [action.payload, ...currPostList]
  }
  else if (action.type === "ADD_INITIAL_POSTS") {
    newPostList = action.payload.posts;
  }
  return newPostList;
}

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);

  const addPost = (userId, postTitle, postBody, reactions, tags) => {
    dispatchPostList({
      type: 'ADD_POST',
      payload: {
        id: Date.now(),
        title: postTitle,
        body: postBody,
        reactions: reactions,
        userId: userId,
        tags: tags
      }
    })
  }

  const addInitialPost = (posts) => {
    dispatchPostList({
      type: 'ADD_INITIAL_POSTS',
      payload: {
        posts
      }
    })
  }

  const deletePost = (postId) => {
    //This dispatch will call the postListReducer and there all the function happening.
    dispatchPostList({
      type: 'DELETE_POST',
      payload: {
        postId,
      }
    })
  }

  return <PostListContext.Provider value={
    {
      postList: postList,
      addPost: addPost,
      deletePost: deletePost,
      addInitialPost: addInitialPost,
    }
  }>
    {children}
  </PostListContext.Provider >
}

export default PostListProvider;