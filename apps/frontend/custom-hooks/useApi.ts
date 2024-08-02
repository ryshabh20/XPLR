import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();
type Method = "GET" | "POST" | "PUT" | "DELETE";
type apiParamsType = {
  method: Method;
  queryKey: Array<string>;
  url: string;
};

const api = async (url: string, method: Method, obj = {}) => {
  switch (method) {
    case "GET": {
      return await axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/${url}`)
        .then((res) => res.data);
    }
    case "POST": {
      return await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, obj);
    }
  }
};

export default function useApi({ method, queryKey, url }: apiParamsType) {
  switch (method) {
    case "GET":
      const get = useQuery({
        queryKey,
        queryFn: () => api(url, method),
      });
      return { get };
    case "POST":
      const post = useMutation({
        mutationFn: (obj: any) => api(url, method, obj),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey });
        },
      });
      return { post };
  }
}
