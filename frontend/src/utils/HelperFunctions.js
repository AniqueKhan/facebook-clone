function capitalizeFirstWord(input) {
  if (input) {
    const words = input.trim().split(" "); // Trim input to remove leading/trailing spaces
    if (words.length > 0) {
      // Capitalize the first word and discard the rest
      return words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
  }
  return ""; // Handle empty input or input with only spaces
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
  if (
    post &&
    user &&
    post.user &&
    post.user.id &&
    user.user_id &&
    post.user.id === user.user_id
  ) {
    return true;
  }
  if (post.privacy === "friends") {
    // Check if the post.friends array exists and if any object has an 'id' that matches user.user_id.
    if (post.user && post.user.friends && Array.isArray(post.user.friends)) {
      return post.user.friends.some((friend) => friend === user.user_id);
    }
  }
  return false;
};

const canEditDelete = (user, post) => {
  if (
    post.shared &&
    post.shared_by &&
    post.shared_by.id &&
    user &&
    user.user_id
  ) {
    return post.shared_by.id === user.user_id;
  } else {
    if (post.user && post.user.id && user && user.user_id) {
      return post.user.id === user.user_id;
    }
  }
};

export {
  canEditDelete,
  capitalizeFirstWord,
  gatherConfiguration,
  userIsFriend,
};
