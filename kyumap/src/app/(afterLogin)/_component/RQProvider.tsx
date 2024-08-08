"use client";

import React, { useState } from "react";
import {
  QueryClientProvider,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
  children: React.ReactNode;
};

export default function RQProvider({ children }: Props) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, // 탭전환시 데이터 새로 가져오나?
          retryOnMount: true, // 컴포넌트가 리액트에 올라간 순간에 다시 가져옴
          refetchOnReconnect: false, // 인터넷 연결이 끉겼다가 다시 접속하면 데이터를 또 가져오는가
          retry: false, // 데이터 가져오는게 실패했을때 몇번 다시 가져오는가
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* <ReactQueryDevtools
        initialIsOpen={process.env.NEXT_PUBLIC_MODE === "local"}
      /> */}
    </QueryClientProvider>
  );
}
