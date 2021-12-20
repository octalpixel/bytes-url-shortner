export const getHostFromURL = (urlPath: string) => {
  return new URL(urlPath).host;
};
