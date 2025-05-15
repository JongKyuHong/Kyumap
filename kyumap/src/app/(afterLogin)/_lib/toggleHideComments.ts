const toggleHideComments = async (postId: number) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/toggleComments`,
      {
        method: "PATCH",
      }
    );
    const result = await res.json();
    return result;
  } catch (err) {
    console.error("API error:", err);
  }
};

export default toggleHideComments;
