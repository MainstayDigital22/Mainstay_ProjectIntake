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
export const getAuthLevel = () => {
  if (!localStorage.getItem("user")) {
    window.open(`/login`, "_self");
    return;
  }
  const storage = JSON.parse(localStorage.getItem("user"));
  const perm = storage.perm;
  return perm;
};
