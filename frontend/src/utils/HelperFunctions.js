function capitalizeFirstWord(input) {
  if (input) {
    const words = input.split(" ");
    if (words.length > 0) {
      // Capitalize the first word and discard the rest
      return words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
  }
}

const gatherConfiguration = (authTokens) => {
  // Setting configuration for sending authenticated requests
  return {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
    },
  };
};

const userIsFriend = (user, post) => {
  if (post.user.id === user.user_id) {
    return true;
  }
  if (post.privacy === "friends") {
    // Check if the post.friends array exists and if any object has an 'id' that matches user.user_id.
    if (Array.isArray(post.user.friends)) {
      return post.user.friends.some((friend) => friend === user.user_id);
    }
  }
  console.log("123", post.user.id);
  console.log("1234", user.user_id);

  return false;
};

export { capitalizeFirstWord, gatherConfiguration, userIsFriend };
