import { useReducer } from "react";
import { createContext } from "react";

export const PostList = createContext({
  postList: [],
  addPost: () => { },
  deletePost: () => { }
});

const postListReducer = (currPostList, action) => {
  let newPostList = currPostList;
  if (action.type === "DELETE_POST") {
    newPostList = currPostList.filter((post) => post.id !== action.payload.postId);
  }
  return newPostList;
}

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, DEFAULT_POST_LIST);

  const addPost = () => {

  }

  const deletePost = (postId) => {
    dispatchPostList({
      type: 'DELETE_POST',
      payload: {
        postId,
      }
    })
  }

  return <PostList.Provider value={
    {
      postList: postList,
      addPost: addPost,
      deletePost: deletePost
    }
  }>
    {children}
  </PostList.Provider >
}

const DEFAULT_POST_LIST = [{
  id: '1',
  title: 'Going to Mumbai',
  body: 'Hi Friends, I am going Mumbai for vacation. Hope to enjoy alot.',
  reactions: 2,
  userId: 'user-9',
  tags: ['Vacation', 'Mumbai', 'Enjoying']
},
{
  id: '2',
  title: 'Pass ho gaye bhai',
  body: '4 Sal ke masti ke bad bhi pass ho gaye. Hard to believe',
  reactions: 15,
  userId: 'user-12',
  tags: ['Graduating', 'Unbelievable']
}];
export default PostListProvider;