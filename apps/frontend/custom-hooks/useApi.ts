import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
const queryClient = new QueryClient();
type Method = "GET" | "POST" | "PUT" | "DELETE" | "Infinite";
export type apiParamsType = {
  method: Method;
  queryKey: Array<string>;
  url: string;
  config?: AxiosRequestConfig<{}>;
  getQueryConfig?: Omit<
    UseQueryOptions,
    "queryKey" | "queryFn" | "refetchOnWindowFocus" | "retry" | "staleTime"
  >;
  enabledCondition?: boolean;
};

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.response.data.message !== "Invalid Credentials" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
          {
            withCredentials: true,
          }
        );

        return axiosInstance(originalRequest);
      } catch (err) {
        await axiosInstance.get("/auth/logout");
        window.location.replace(`http://${window.location.host}/login`);
      }
    }
    return Promise.reject(error);
  }
);

const api = async (url: string, method: Method, obj = {}, config = {}) => {
  switch (method) {
    case "GET": {
      return await axiosInstance.get(`${url}`).then((res) => res.data);
    }
    case "POST": {
      return await axiosInstance.post(`${url}`, obj, config);
    }
  }
};

export default function useApi({
  method,
  queryKey,
  url,
  config,
  enabledCondition = true,
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
        enabled: enabledCondition,
      });
      return { get };
    case "POST":
      const post = useMutation({
        mutationFn: (obj: any) => {
          return api(url, method, obj, config);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey });
        },
      });
      return { post };
    case "Infinite":
      const inifinite = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => api(`${url}&cursor=${pageParam}`, "GET"),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        getPreviousPageParam: (firstPage) => firstPage.nextCursor,
      });
      return { inifinite };
  }
}
