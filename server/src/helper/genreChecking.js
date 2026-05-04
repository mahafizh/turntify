export const genreChecking = async (Genre, genres) => {
  if (genres === undefined) return undefined;

  let formattedGenres = genres;

  if (!Array.isArray(formattedGenres)) {
    formattedGenres = [formattedGenres];
  }

  if (formattedGenres.length === 0) {
    throw new AppError("Genre can't be empty", 400);
  }

  const existingGenre = await Genre.find({ _id: { $in: formattedGenres } });

  if (existingGenre.length !== formattedGenres.length) {
    throw new AppError("One or more genres are not valid", 400);
  }

  return formattedGenres;
};
