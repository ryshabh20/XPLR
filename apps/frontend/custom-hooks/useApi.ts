import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";

const queryClient = new QueryClient();
type Method = "GET" | "POST" | "PUT" | "DELETE";
export type apiParamsType = {
  method: Method;
  queryKey: Array<string>;
  url: string;
  config?: AxiosRequestConfig<{}>;
};

const api = async (url: string, method: Method, obj = {}, config = {}) => {
  switch (method) {
    case "GET": {
      return await axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/${url}`)
        .then((res) => res.data);
    }
    case "POST": {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
        obj,
        config
      );
    }
  }
};

export default function useApi({
  method,
  queryKey,
  url,
  config,
}: apiParamsType) {
  switch (method) {
    case "GET":
      // eslint-disable-next-line
      const get = useQuery({
        queryKey,
        queryFn: () => api(url, method),
        retry: 0,
        refetchOnWindowFocus: false,
        staleTime: 30000,
      });
      return { get };
    case "POST":
      const post = useMutation({
        mutationFn: (obj: any) => api(url, method, obj, config),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey });
        },
      });
      return { post };
  }
}
