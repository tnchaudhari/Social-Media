import { useCallback, useEffect, useReducer, useState } from "react";
import { createContext } from "react";

export const PostListContext = createContext({
  postList: [],
  fetching: false,
  addPost: () => { },
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

//Here we are using useReducer for state management of PostList and we used it due to 1. You're handling multiple actions (add, delete, load). 2. It keeps the logic in one place (the reducer).
const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);
  const [fetching, setFetching] = useState(false);

  const addPost = (post) => {
    dispatchPostList({
      type: 'ADD_POST',
      payload: post
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

  // useCallback remembers a function, so that it doesn’t get recreated every time the component re-renders — unless its dependencies change.
  const deletePost = useCallback((postId) => {
    //This dispatch will call the postListReducer and there all the function happening.
    dispatchPostList({
      type: 'DELETE_POST',
      payload: {
        postId,
      }
    })
  }, [dispatchPostList]);

  //useEffect is hook which we have used here to fetch the data when the page gets initially loaded. By giving [] empty braces after the function means this will only called once during initial stage.
  useEffect(() => {
    setFetching(true);

    //Here we have used Abort controller for clean up operation when user navigate to other page or component.
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('https://dummyjson.com/posts', { signal })
      .then(res => res.json())
      .then(data => {
        addInitialPost(data.posts);
        setFetching(false);
      });

    return () => {
      controller.abort();
    }
  }, [])

  return <PostListContext.Provider value={
    {
      postList: postList,
      fetching: fetching,
      addPost: addPost,
      deletePost: deletePost,
    }
  }>
    {children}
  </PostListContext.Provider >
}

export default PostListProvider;