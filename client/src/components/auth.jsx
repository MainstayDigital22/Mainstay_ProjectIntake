export const getAuthToken = () => {
  if (!localStorage.getItem("user")) {
    window.open(`/login`, "_self");
    return;
  }
  const storage = JSON.parse(localStorage.getItem("user"));
  const token = storage.token;
  return token;
};
export const getAuthUser = () => {
  if (!localStorage.getItem("user")) {
    window.open(`/login`, "_self");
    return;
  }
  const storage = JSON.parse(localStorage.getItem("user"));
  const user = storage.user;
  return user;
};
export const getAuthId = () => {
  if (!localStorage.getItem("user")) {
    window.open(`/login`, "_self");
    return;
  }
  const storage = JSON.parse(localStorage.getItem("user"));
  const id = storage.id;
  return id;
};
export const getAuthLevel = () => {
  const ignoredPaths = ["/403", "/login", "/signup"];
  if (
    !localStorage.getItem("user") &&
    !ignoredPaths.includes(window.location.pathname)
  ) {
    window.open(`/login`, "_self");
    return;
  }
  if (!localStorage.getItem("user")) {
    return undefined;
  }
  const storage = JSON.parse(localStorage.getItem("user"));
  const perm = storage.perm;
  return perm;
};
