import http from "./http-common-noauth";

const get = id => {
  return http.get(`/payment/${id}`);
};

const getpaymentturn = id => {
  return http.get(`/paymentturn/${id}`);
};

const getrecentpayments = id => {
  return http.get(`/paymentshouse/${id}`);
};

const create = (data) => {
  return http.post(`/payment`, data);
};

const deletepayment = id => {
    return http.delete(`/payment/${id}`)
};

// const login = (data) => {
//   return http.post("/login", data);
// };


const PaymentService = {
  get,
  create,
  deletepayment,
  getpaymentturn,
  getrecentpayments,
};

export default PaymentService;