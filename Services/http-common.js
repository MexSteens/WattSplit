import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default axios.create({
  baseURL: "http://10.0.2.2:8080/api",
  headers: {
    "Content-type": "application/json",
    "Authorization": `Bearer ${AsyncStorage.getItem('@jwt')}`
  }
});