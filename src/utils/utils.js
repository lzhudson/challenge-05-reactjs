export const findRepository = (repositories, repository) => {
  const repositoryIsExistsInRepository = repositories.findIndex(
    (repo) => repo.name === repository
  );
  return repositoryIsExistsInRepository;
};
