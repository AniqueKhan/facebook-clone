function capitalizeFirstWord(input) {
  if (input) {
    const words = input.split(" ");
    if (words.length > 0) {
      // Capitalize the first word and discard the rest
      return words[0].charAt(0).toUpperCase() + words[0].slice(1);
    } else {
      return "Unknown";
    }
  } else {
    return "Unknown";
  }
}

export default capitalizeFirstWord;
