import http from './http-common-noauth';

const create = data => {
    return http.post("/user", data);
};

const login = (data) => {
    return http.post("/login", data);
};

const LoginRegisterService = {
    login,
    create
}

export default LoginRegisterService;