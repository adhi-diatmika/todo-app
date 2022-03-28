import axios from "axios";

// api base url
export const api = axios.create({
    baseURL: "http://localhost:30006"
})

// capital first character "hello world" => "Hello World"
export const ucwords = (text: string) => {
    return text.replace(/(?:^|\s)\S/g,(res)=>{ return res.toUpperCase();})
}
