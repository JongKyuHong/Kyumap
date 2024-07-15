import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NavTab from "./NavTab";

type Props = {
  me: any;
};

export default async function Nav({ me }: Props) {
  const queryClient = new QueryClient();
  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <NavTab session={me} />
    </HydrationBoundary>
  );
}
