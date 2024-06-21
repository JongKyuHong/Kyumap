import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NavTab from "./NavTab";
import { auth } from "../../../auth";

export default async function Nav() {
  const queryClient = new QueryClient();
  const session = await auth();

  if (session) {
    await queryClient.prefetchQuery({
      queryKey: ["users", session!.user!.email],
    });
  }

  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <NavTab me={session} />
    </HydrationBoundary>
  );
}
