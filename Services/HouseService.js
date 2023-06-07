import http from "./http-common-noauth";

const getAll = () => {
    return http.get("/house");
  };

const get = id => {
  return http.get(`/house/${id}`);
};

const create = (id, data) => {
  return http.post(`/house/${id}`, data);
};

const updatemembers = (id, data) => {
  return http.put(`/housemembers/${id}`, data);
};

const findByHousename = (name) => {
    return http.get(`/houses/${name}`)
}

// const login = (data) => {
//   return http.post("/login", data);
// };


const HouseService = {
  get,
  create,
  updatemembers,
  findByHousename,
  getAll
};

export default HouseService;