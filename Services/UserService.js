import http from "./http-common-noauth";

const get = id => {
  return http.get(`/user/${id}`);
};

const create = data => {
  return http.post("/user", data);
};

const update = (id, data) => {
  return http.put(`/user/${id}`, data);
};


const login = (data) => {
  return http.post("/login", data);
};

const updateHouse = (id, data) => {
  return http.put(`/userhouse/${id}`, data)
}

const updateHouseStatus = (id, data) => {
  return http.put(`/userstatus/${id}`, data)
}

const updateDates = (id, data) => {
  return http.put(`/userdates/${id}`, data)
}

const updateFcmToken = (id, data) => {
  return http.put(`/userfcm/${id}`, data)
}

const UserService = {
  get,
  create,
  update,
  login,
  updateHouse,
  updateHouseStatus,
  updateDates,
  updateFcmToken
};

export default UserService;