import type { UseFetchOptions } from "nuxt/app";
import { defu } from "defu";

export async function useAPI<
  T,
  U = Record<string, any>,
  V = Record<string, any>,
>(url: string, options: UseApiOptions<T, U, V> = {}) {
  const access = useCookie("accessToken");
  
  
  const router = useRouter();
  const config = useRuntimeConfig();
  const defaults: UseFetchOptions<T> = {
    baseURL:config.public.baseUrl,
    onResponse(_ctx) {},
    headers:access.value  
    ? { Authorization: `Bearer ${access.value}` }
    : {},
    async onResponseError({ response }) {
      const refreshToken = useCookie('refreshToken');
      if (response.status === 401 && refreshToken.value) {
        
        const res: { access_token: string } = await $fetch(
          `${config.public.baseUrl}/auth/refresh`,
          {
            method: "post",
            body: {
              refresh_token: refreshToken.value,
            },
          }
        );
        if (res.access_token) {
          access.value = res.access_token;
          router.push("/admin");
        } else {
          router.push("/admin/login");
        }
      }
    },
  };

  const params = defu(options, defaults);
  const fetch = await useFetch<T>(url, params as any);

  return fetch;
}

type UseApiOptions<T, U = Record<string, any>, V = Record<string, any>> = Omit<
  UseFetchOptions<T>,
  "body" | "params"
> & {
  body?: U;
  params?: V;
};