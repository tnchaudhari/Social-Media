import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import { PostListContext as PostListData } from "../store/post-list-store";
import WelcomeMessage from "./WelcomeMessage";
import LoadingSpinner from "./LoadingSpinner";

const PostList = () => {
  const { postList, addInitialPost } = useContext(PostListData);
  const [fetching, setFetching] = useState(false);

  //useEffect is hook which we have used here to fetch the data when the page gets initially loaded. By giving [] empty braces after the function means this will only called once during initial stage.
  useEffect(() => {
    setFetching(true);
    fetch('https://dummyjson.com/posts')
      .then(res => res.json())
      .then(data => {
        addInitialPost(data.posts);
        setFetching(false);
      });
  }, [])



  return (
    <>
      {fetching && <LoadingSpinner />}
      {
        !fetching && postList.length === 0 && <WelcomeMessage />
      }
      {
        !fetching && postList.map((post) => <Post key={post.id} post={post} />)
      }
    </>
  )
}

export default PostList;