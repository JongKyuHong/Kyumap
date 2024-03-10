import React from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getPostRecommends } from "../_lib/getPostRecommends";
import MSection from "./MSection";

export default async function MainSection() {
  // const [clickedEmotionMenu, setEmotionMenu] = useState(false);
  // const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "recommends"],
    queryFn: getPostRecommends,
    initialPageParam: 0,
  });
  const dehydrateState = dehydrate(queryClient);
  // const svgRef = useRef(
  //   Array.from({ length: 10 }, () => React.createRef<SVGSVGElement>())
  // );

  // const handleSvgClick = useCallback(
  //   (index: number) => {
  //     const currentRef = svgRef.current[index];
  //     if (currentRef && currentRef.current) {
  //       const svgRect = currentRef.current.getBoundingClientRect();
  //       const modalTop = svgRect.top + window.scrollY;
  //       const modalLeft = svgRect.right + window.scrollX;
  //       setModalPosition({ top: modalTop, left: modalLeft });
  //       setEmotionMenu(!clickedEmotionMenu);
  //     }
  //   },

  //   [clickedEmotionMenu]
  // );

  return (
    <HydrationBoundary state={dehydrateState}>
      <MSection />
    </HydrationBoundary>
  );
}
