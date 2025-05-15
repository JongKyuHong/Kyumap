2024.02 ~ 2024.07 (약 5달)

### 🎉 프로젝트 소개

<aside>
💡 자신의 맛집을 공유하는 SNS 토이 프로젝트입니다.
디자인은 인스타를 착안하였으며, Next.js를 사용해서 구현하였습니다.

</aside>

### 깃허브 주소

https://github.com/JongKyuHong/Kyumap

### 배포 주소

https://kyumap.vercel.app/

### 🎨 주제 선정 이유

- 평소에 맛집을 찾아보고 찾아가는것에 관심이 많았고
- 인터넷에는 광고성 글이 많아서 주로 지인들이 추천해준 맛집을 더 신뢰하는데 친구들끼리 서로 맛집을 공유하면 어떨까해서 만들게 되었습니다.

### 💡 기술 스택

- TypeScript
- Next.js
- react-query
- MongoDB

### ✨ 이모저모

- Next.js을 사용한 이유
  - 풀스택 개발이 가능할 것으로 생각하여 Next.js를 선택하였습니다.
    - next의 API Routes 기능을 활용하여 API를 만들었고, 데이터베이스는 Mongodb를 활용하였습니다.
  - 각 페이지마다 SSR(Server-Side Rendering), CSR(Client-Side Rendering)을 알맞게 적용할 수 있다고 생각하였습니다.
    - SSR을 적용하는 경우
      - 초기 렌더링 속도가 중요한 메인 페이지
      - 검색엔진이 읽어줬으면 하는 내용을 담은 페이지
- React-Query를 사용한 이유
  - 데이터를 캐싱 하여 불필요한 요청을 줄이기 위함이었습니다.
    - 캐시 된 데이터를 통해 동일한 요청에 대한 응답 시간을 단축하고, 네트워크 비용을 절감할 수 있었습니다.
    - 쿼리의 staleTime, cacheTime 등의 설정을 통해 데이터의 유효 기간을 관리하고, 성능을 최적화할 수 있었습니다.
      - 데이터에 따라 staleTime을 유동적으로 변경하였습니다. (게시글 1분, 사용자 정보 5분)
  - 서버와의 동기화를 위해서 사용하였습니다.
    - 무한 스크롤을 사용하는 메인화면에서 useInfiniteQuery를 통해 스크롤 시 자동으로 데이터를 더 로드하므로 사용자 경험 향상에 좋다고 생각하였습니다.
      - 사용자가 스크롤 할 때 필요에 따라 데이터를 로드하여, 페이지 전환 없이 연속적인 탐색이 가능하게 하여 사용자 만족도를 높였습니다.
    - 백그라운드에서 데이터가 변경되었을 때 자동으로 리패치하는 기능을 통해 항상 최신 데이터를 유지할 수 있습니다.
      - 이는 특히 실시간 데이터가 중요한 SNS 서비스에서 유용하며, 사용자가 항상 최신 정보를 확인할 수 있도록 합니다.
- 성능향상

  - [https://velog.io/@kongi7064/Lighthouse분석을-통해-프로젝트-개선하기](https://velog.io/@kongi7064/Lighthouse%EB%B6%84%EC%84%9D%EC%9D%84-%ED%86%B5%ED%95%B4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0)
  - Lighthouse 분석 점수를 확인하고 개선해 나간 기록입니다.
  - 주요 최적화 내용으로는

    - 이미지 최적화
    - 메타데이터 설정으로 SEO 최적화
    - React Query로 데이터 페칭 최적화
    - form 태그의 속성 설정 및 스크립트 보안 개선
    - 정적인 부분은 서버 컴포넌트에 상호작용이 필요한 부분은 클라이언트 컴포넌트에 배치해 성능 최적화
    - 렌더링 방식에 따른 차이

      - 빌드하고 나서 차이를 비교했을 때 (메인 화면 기준)

        - CSR

          ![빌드하고csr.png](/kyumap/public/빌드하고csr.png)

        - SSR

          ![빌드하고ssr.png](/kyumap/public/빌드하고ssr.png)

        - 크게 차이가 없어서 사용자 경험 측면에서 loading 스피너를 사용할 수 있는 CSR이 낫다고 판단하여 CSR을 적용하였습니다.

### 📌 주요 기능

- 로그인 전 메인화면

  ![로그인전메인화면.png](/kyumap/public/로그인전메인화면.png)

- 회원가입

  ![회원가입.png](/kyumap/public/회원가입.png)

- 로그인

  ![로그인.png](/kyumap/public/로그인.png)

- 메인화면
  ![메인화면.png](/kyumap/public/메인화면.png)

- 새로운 게시물

  - 새로운 게시물 클릭 시

    ![새로운게시물클릭.png](/kyumap/public/새로운게시물클릭.png)

  - 사진 업로드 시

    ![사진업로드시.png](/kyumap/public/사진업로드시.png)

  - 다음 버튼 누른 후 게시물 정보 입력

    ![다음버튼후게시물정보입력.png](/kyumap/public/다음버튼후게시물정보입력.png)

  - 공유하기

    ![공유하기.png](/kyumap/public/공유하기.png)

- 게시글 상세 페이지

  ![게시글상세페이지.png](/kyumap/public/게시글상세페이지.png)

- 검색

  ![검색.png](/kyumap/public/검색.png)

- 사용자 검색

  ![사용자검색.png](/kyumap/public/사용자검색.png)

- 릴스

  ![릴스.png](/kyumap/public/릴스.png)

- 릴스에서 게시물로 이동 클릭 시

  ![릴스에서게시물로이동.png](/kyumap/public/릴스에서게시물로이동.png)

  - 옵션 클릭 시

    ![옵션클릭시.png](/kyumap/public/옵션클릭시.png)

  - 자기 자신의 게시글이면

    ![자기자신의게시글이면.png](/kyumap/public/자기자신의게시글이면.png)

- 프로필

  - 내 프로필

    ![내프로필.png](/kyumap/public/내프로필.png)

  - 다른사람 프로필

    ![다른사람프로필.png](/kyumap/public/다른사람프로필.png)

  - 지도 보기

    ![지도보기.png](/kyumap/public/지도보기.png)
