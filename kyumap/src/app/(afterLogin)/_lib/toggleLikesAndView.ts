const toggleLikesAndViews = async (postId: number) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/toggleLikesAndViews`,
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

export default toggleLikesAndViews;
