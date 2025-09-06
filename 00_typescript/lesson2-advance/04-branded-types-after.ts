type Brand<K, T> = K & { __brand: T }
type UserID = Brand<string, "UserId">
type PostID = Brand<string, "PostId">
type CommentID = Brand<string, "CommentId">

type User = {
  id: UserID;
  name: string
}
type Post = {
  id: PostID;
  ownerId: string;
  comments: Comments[]
}
type Comments = {
  id: CommentID
  timestamp: string
  body: string
  authorId: UserID
}
async function getCommentsForPost(postId: PostID, authorId: UserID) {
  console.log("Now both post and user id has its own type");
}
//ERROR
//const comments = await getCommentsForPost(user.id,post.id) 

export{}