import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client"; 

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);

      const { data: postData, error: postError } = await supabase
        .from("Posts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (postError) {
        console.error("Error fetching post:", postError.message);
      } else {
        setPost(postData);
      }

      const { data: commentsData, error: commentsError } = await supabase
        .from("Comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: false });
      
      if (commentsError) {
        console.error("Error fetching comments:", commentsError.message);
      } else {
        setComments(commentsData);
      }

      setLoading(false);
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (commentText.trim() === '') return;

    const newComment = {
      post_id: id,
      comment: commentText,
      created_at: new Date(),
    };

    const { error } = await supabase
      .from("Comments")
      .insert([newComment]);
    
    if (error) {
      console.error("Error adding comment:", error.message);
    } else {
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    }
  };

  const handleUpvote = async () => {
    const newUpvotes = post.upvotes + 1;
    setPost({ ...post, upvotes: newUpvotes }); // Optimistic UI update

    const { error } = await supabase
      .from("Posts")
      .update({ upvotes: newUpvotes })
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error updating upvotes:", error.message);
      // Optionally handle rollback or error state
      setPost({ ...post, upvotes: post.upvotes - 1 }); // Rollback on error
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="PostDetail">
      <h2>{post.title}</h2>
      <p>Created on: {new Date(post.created_at).toLocaleDateString()}</p>
      <p>By: {post.author}</p>
      <p>{post.description}</p>
      <button onClick={handleUpvote}>Upvote</button>
      <span>Upvotes: {post.upvotes}</span>

      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Leave a comment..."
          rows={3}
        />
        <button type="submit">Submit Comment</button>
      </form>

      <div className="comments">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>{comment.comment}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
