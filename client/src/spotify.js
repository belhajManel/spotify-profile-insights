const LOCALSTORAGE_KEYS = {
  access_token: "spotify_access_token",
  refresh_token: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timeStamp: "spotify_token_timestamp",
}

const LOCALSTORAGE_VALUES = {
  access_token: window.localStorage.getItem(LOCALSTORAGE_KEYS.access_token),
  refresh_token: window.localStorage.getItem(LOCALSTORAGE_KEYS.refresh_token),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timeStamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timeStamp),
}

const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const access_token = urlParams.get("access_token");
  const refresh_token = urlParams.get("refresh_token");

  return access_token;
};

export const access_token = getAccessToken();
