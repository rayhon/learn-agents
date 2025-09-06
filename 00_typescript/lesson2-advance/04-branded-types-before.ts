type User = {
  id: string;
  name: string;
};

type Post = {
  id: string;
  ownerId: string;
  comments: Comments[];
};

type Comments = {
  id: string;
  timestamp: string;
  body: string;
  authorId: string;
};


async function getCommentsForPost(postId: string, authorId: string) {
    console.log("Typescript is ok postId and authorId are passed in wrong order as they are both string in type")
}

export{}