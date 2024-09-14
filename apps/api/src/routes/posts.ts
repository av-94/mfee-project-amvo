import express from 'express';
import { getCategory } from '../routes/categories';

const router = express.Router();
// Initialize posts array to save data in memory
const posts = [];
// Initialize comments array to save data in memory
const comments = [];

// GET /posts Return an array of all the posts with status code 200
router.get('/', (req, res) => {
  res.status(200).json(posts);
});

//   POST /posts Create a new post and return the created post with status code 201
router.post('/', (req, res) => {
  // Retrieve the values from the request body
  const { title, image, description, category } = req.body;

  if (!title || !image || !description || !category) {
    // If it is empty or undefined return a 400 status code with a message
    return res.status(404).json({ message: 'Missing body data' });
  }
  const newPost = {
    id: Date.now().toString(), // Convert id to string to match the value in get by id endpoint
    title,
    image,
    description,
    category,
    comments: []
  };
  // Add the new post to our array
  posts.push(newPost);

  res.status(201).json(newPost);
});

export const getPost = (id: string) => {
  posts.find((p) => p.id === id);
  return posts.find((p) => p.id === id);
};

// GET /posts/:id Return a post by id with category object and each comment object in the array with status code 200
router.get('/:id', (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Check if we have a post with that id
  const post = getPost(id);

  if (!post) {
    // If we don't find the post return a 404 status code with a message
    return res.status(404).json({ message: 'Post not found' });
    // Note: Remember that json method doesn't interrupt the workflow
    // therefore is important to add a "return" to break the process
  }

  const currentComment = comments.find((p) => p.id === id);
  if (currentComment) {
    post.comments = comments;
  }

  const currentCategory = getCategory(post.category);
  if (currentCategory) {
    post.category = currentCategory;
  }

  res.status(200).json(post);
});

//GET /posts/category/:category Return an array of all the posts by category with status code 200
router.get('/category/:category', (req, res) => {
  // Retrieve the category from the route params
  const { category } = req.params;

  if (!category) {
    // If we don't find the post return a 404 status code with a message
    return res.status(404).json({ message: 'Category not found' });
    // Note: Remember that json method doesn't interrupt the workflow
    // therefore is important to add a "return" to break the process
  }

  const postsByCategory = posts.map((p) => {
    if (p.category?.id === category) return p;
  });

  res.status(200).json(postsByCategory);
});

// POST /posts/:id/comments Create a comment inside the post and return the comment with status code 201
router.post('/:id/:comments', (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Retrieve the index of the category in the array
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    // If we don't find the post return a 404 status code with a message
    return res.status(404).json({ message: 'Post not found' });
  }

  // Retrieve the values from the request body
  const { author, content } = req.body;
  const comment = {
    id,
    author,
    content
  };
  // Add the new post to our array
  comments.push(comment);
  // Return the created comment with a 201 status code
  res.status(201).json(comment);
});

//PATCH /posts/:id Update post information and return the updated post with status code 200
router.patch('/:id', (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Retrieve the index of the post in the array
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    // If we don't find the post return a 404 status code with a message
    return res.status(404).json({ message: 'Post not found' });
  }

  // Generate a copy of our post
  const updatedPost = { ...posts[postIndex] };

  // Retrieve the values from the request body
  const { title } = req.body;

  // Check if we have a title, if so update the property
  if (title) {
    updatedPost.title = title;
  }

  // Update the post in our array
  posts[postIndex] = updatedPost;

  // Return the updated post with a 200 status code
  res.status(200).json(updatedPost);
});

// DELETE /posts/:id Delete the post and return the deleted post with status code 200 or 204
router.delete('/:id', (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Retrieve the index of the post in the array
  const postIndex = posts.findIndex((p) => p.id === id);

  // "findIndex" will return -1 if there is no match
  if (postIndex === -1) {
    // If we don't find the category return a 404 status code with a message
    return res.status(404).json({ message: 'Post not found' });
  }

  // Remove the post from the array
  posts.splice(postIndex, 1);

  // Retrieve the index of the comment in the array
  const commentsIndex = comments.findIndex((p) => p.id === id);
  // Remove the comment from the array
  comments.splice(commentsIndex, 1);

  // Return a 204 status code
  res.status(204).send();
});

export default router;
