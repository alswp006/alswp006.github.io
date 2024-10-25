---
layout: post
title: 페어 프로그래밍으로 프로젝트를..?
subtitle: 페어 프로그래밍으로 프로젝트를..?
date: '2024-10-23 10:45:51 +0900'
categories:
    - project
    - devita
tags:
    - AnomalyDetection
comments: true
published: true
list: true
order: 6
---
# 페어 프로그래밍으로 프로젝트를..?

- 이번 카카오테크 부트캠프에서 백엔드 프로젝트 스터디를 만들었습니다!
- 이미 CS스터디와 알고리즘 스터디를 참여하고 있지만 저에게 필요할 것 같아서 직접 스터디를 만들기로 했습니다!
- 마침 카카오 현직자 특강에서 들은 “카카오가 협업하는 방법”이 있는데 이를 적용해보고 싶기도 하였습니다!
- 제가 처음에 만들기로 한 기획 의도를 기억하고 공개적인 블로그에 글을 올림으로써 프로젝트를 더 열심히 진행하기 위해 글을 올리기로 마음 먹었습니다!

# 스터디 창설 이유

## 1. 원하는 사이드 프로젝트를 하고싶은데 파이널 프로젝트로 할 만한 크기는 아니라서

- 카카오 테크 부트캠프에서 책을 제공받았는데 풀스택이라서 Figma 디자인, 프론트엔드, 백엔드, DB, Cloud 책이 왔습니다.
→ 하지만 저는 백엔드라서 프론트엔드나 디자인 책이 필요없습니다!
→ 하지만 Cloud나 AI 파트에서 프론트엔드를 병행하는 사람이 있습니다
→ 책을 그들에게 팔고 싶습니다
→ 커뮤니티에서는 올리기는 번거롭고 받은 책을 판다는 것이 뭔가 부끄럽습니다!
- 카부캠 내에서 커뮤니티 안에서 물품 나눔같은 것을 진행하는데 이에 대한 알림같은 것들이 왔으면 좋겠어서.

![](https://velog.velcdn.com/images/alswp006/post/2fe28295-c30a-4a16-8310-59b95c9204cb/image.png)
    
- 카부캠 내에서 사물함을 배정해주는데 인원에 비해 사물함이 많아서 비는 사물함이 많아서.
    - 카부캠 사물함은 비밀번호를 닫을 때마다 새로 설정해줄 수 있고 사물함을 열면 비밀번호는 초기화됩니다
![](https://velog.velcdn.com/images/alswp006/post/4a29ec3d-23ef-4813-b66f-caa4449c1b98/image.png)
    

### → 카부캠 내의 중고 거래 플랫폼을 만드는데 사물함을 통해 비대면으로 거래를 하자!
판매자는 물품을 올리고 사물함 번호와 비밀번호를 배정받으면 물품을 넣어둔 뒤 우리가 물품을 검수하고 구매자에게는 사물함 번호와 비밀번호를 알려주자!

## 2. 유튜브에 올라오는 세션 영상을 프로젝트에 적용해보고 싶어서

- **[NHN FORWARD 2021] Redis 야무지게 사용하기**
- **[Data] Batch Performance 극한으로 끌어올리기: 1억 건 데이터 처리를 위한 노력 / if(kakao)dev2022**
- 위와 같은 세션을 보고 프로젝트에 적용해보고싶은데 혼자서는 이해하기 조차 힘들었습니다!
- 백엔드 팀원들과 함께 보고 함께 적용 방법을 고민해보고 적용해보면 더 효율적이고 깊이있는 학습이 될 것이라 생각했습니다!

## 3. 페어 프로그래밍과 유사하게 프로젝트를 만들고 코드리뷰를 필수적으로 진행한다면 실력 성장에 좋을 것 같고 프로젝트 완성도도 괜찮을 것 같아서

- 우선 처음 스터디 기획은 백엔드 개발자 3~4명을 모아서 같은 기능을 다른 브랜치로 구현하고 일주일마다 코드리뷰를 진행해서 논의 후 메인 브랜치에 통합된 코드를 올려 프로젝트를 완성하는 것이었습니다.
- 그 후 같은 기능에 대한 성능 최적화를 다 같이 진행하며 최적화 방법을 찾아와 각자 발표를 하고 논의합니다.
- 순전히 제 상상에 의해 기획된 것이라 효과가 괜찮을 지 모르겠지만 제가 기대하는 효과는 다음과 같습니다!
    - 프로젝트에 참여한 백엔드 개발자 모두가 프로젝트의 전문가가 된다.
        - 기능 구현, 코드 리뷰, 코드 통합을 진행하며 해당 기능에 이해도를 깊게 가져간다.
    - 성능 최적화를 진행할 때 여러명이 방법을 찾아오면 가장 효율적인 최적화 방법을 찾을 수 있고 각자 여러 방법을 공유하며 다른 최적화 방법도 간략하게 이해할 수 있다.
    - 같은 기능을 구현한 다른 사람들의 코드 리뷰를 진행하며 다른 사람의 코드를 배우고 내 코드를 피드백 받을 수 있다.
        - 해당 기능 구현 지식에 대한 이해도가 크기 때문에 더 세세한 코드리뷰를 할 수 있다.

## 4. 부트캠프 내에 인원들에게 홍보하면 확정적으로 사용할 수 있는 인원들이 생길 것 같아서
- 사실 밖에서 프로젝트를 진행한다하면 사용자가 생길지 안생길지조차 정확하지 않습니다.
- 하지만 카부캠 내에서 사용할 프로젝트를 진행하고 홍보한다면 사용하는 인원이 무조건적으로 생길 수 있기 때문에 이는 좋은 기회라고 생각했습니다.
# 스터디 기획

## 스터디 시간 및 인원 기획

- 저는 부트캠프 정규 시간과 현재 진행중인 스터디나 프로그램의 시간이 다음과 같았습니다!
    - 월: 부트캠프 정규시간(9시 ~ 18시)
    - 화: 부트캠프 정규시간(9시 ~ 18시), 오픈소스 컨트리뷰션 아카데미 온라인(20시~), 오픈소스 기여 프로젝트 스터디(21시~)
    - 수: 부트캠프 정규시간(9시 ~ 18시), 알고리즘 스터디(19시~)
    - 목: 부트캠프 정규시간(9시 ~ 18시), CS 스터디(19시~)
    - 금: 부트캠프 정규시간(9시 ~ 18시), 오픈소스 컨트리뷰션 아카데미 온라인(20시~)
    - 토: 오픈소스 컨트리뷰션 아카데미 오프라인(10시~)
- 정규 시간에는 파이널 프로젝트에 집중해야하니 스터디 프로젝트는 평일 4시간, 주말 8시간 정도 진행하려고 했습니다!
- 그래서 이번 스터디는 월요일 20시, 토요일 14시, 일요일 13시에 진행하기로 했습니다!
- 월요일 20시에는 우선 코드 통합, 프로젝트가 어느정도 진행되었다면 성능 테스트를 진행합니다.
- 토요일에는 모각코를 진행하며 논의할 부분이 생기면 논의를 진행합니다.
- 일요일에는 세션 영상을 함께 보고 모각코, 성능 최적화나 프로젝트 방향에 대해서 다같이 모여 논의를 진행합니다.
- 토요일은 자율 참여로 하였고 월요일/일요일은 확실히 참여할 수 있다는 확언을 받고 인원을 모집하였습니다!
- 처음에는 2명을 모집하여 저 포함 3명으로 생각하였지만 주변에서 얘기를 듣고 들어오고 싶다는 인원이 생각보다 많아 2명만 더 모집하여 총 5명으로 진행하고 있습니다!
- 5명인 이유는 화, 수, 목, 금동안 다른 사람의 코드를 1시간씩 강제로 코드리뷰하게 하면 딱 시간 분배가 괜찮을 것 같다는 생각이였습니다!
- 그래서 나온 스터디 방식은 다음과 같습니다!

## 스터디 방식

- 월요일 20시에는 코드 리뷰가 끝난 기능을 통합하여 main 브랜치에 올립니다.
    - 5주차 부터는 각각이 구현한 기능의 성능을 테스트하고 비교합니다.
    - 성능 테스트 결과는 코드 통합 시간에 공유합니다.
- 화, 수, 목, 금은 1시간 씩 각각 다른 팀원의 코드를 반드시 리뷰합니다.
- 토요일과 일요일 모각코와 관련 세션 영상을 함께 시청하고 프로젝트에 대한 논의를 진행합니다.

# 프로젝트 기획

- 프로젝트 주제는 제가 생각한 것으로 하고 구체화는 처음에 모인 인원 3명에서 진행하였습니다!
- 얼마전 카카오 현직자 분이 특강을 진행하며 말씀해주신 것은 카카오는 업무 별로 티켓을 나눠 점수를 분배하고 일주일 분량의 업무를 진행한다고 합니다.
- 이를 벤치마킹하여 기능 요구 사항을 정리하고 점수를 분배하여 주차별 일정을 짜는 식으로 기획을 하였습니다!

## 프로젝트의 대략적인 서비스 흐름

- 판매자는 물건을 올리면 사물함과 비밀번호를 배정받는다.
- 관리자는 사물함의 물건을 검수한다.
- 물건의 상태는 검수 중 -> 판매 중(검수 완료) -> 판매 완료로 나눠진다.
- 구매자가 대금을 결제하면 판매자에게 대금이 전달되고, 사물함과 비밀번호를 알려준다.

## 프로젝트 기능 요구 사항(점수 분배)

- 회원 기능
    - 로그인 → 5점
        - OAuth + jwt + Redis
    - 로그아웃 → 1점
    - 마이페이지
        - 구매 내역 → 2점
        - 판매 내역 → 2점
- 알림 → 7점
    - 스프링 배치 학습
- 중고 물품 거래 페이지
    - 중고 물품 구매
        - 결제 → 10점
            - 우선 결제에 대한 도메인 지식이 없어 학습에 시간이 소요될 것 같음
        - 사물함 별 비밀번호 전달 → 1점
        - 사물함 상태 풀기 → 1점
        - 물품 DB 상태 변경 → 1점
        - 구매자 구매 내역에 추가 → 1점
            - 사용자 구매 내역 컬럼에 물품 ID 추가
    - 중고 물품 판매
        - 중고 물품 올리기 → 1점
        - 사물함 상태 잠그기 → 3점
            - 트랜잭션 동시성 학습
        - 판매자 판매 내역에 추가 → 1점
            - 사용자 판매 내역 컬럼에 물품 ID 추가
    - 사물함 관리
        - 관리자 페이지 → 5점
            - 스프링 시큐리티 Role 관리
        - 사용 중인 사물함 기록 → 3점
    - 소셜 기능 (찜하기, 관심, 조회)
        - 찜하기 → 1점 (최적화 포텐이 있다. 너 재능 있어)
        - 조회 수 → 4점
    - 검색, filter
        - 물품 검색 → 3점 (최적화 포텐이 있다. 너 재능 있어)
- 성능 테스트 환경 구축 및 최적화 방안 논의 → 4점
- 52점 / 8주 → 한 주에 6.5점

## 프로젝트 일정

1주차: 로그인 및 로그아웃 → 6점

2주차:  사물함 관리 → 8점

3주차:  중고 물품 판매, 판매 내역 → 7점

4주차:  중고 물품 구매(결제) → 7점

5주차:  중고 물품 구매(결제 및 나머지) → 7점

6주차:  구매 내역, 소셜 기능 → 7점

7주차:  알림 → 7점

8주차:  검색, filter, 성능 테스트 환경 구축 및 최적화 방안 논의 → 7점

9주차:  운영 모니터링 및 성능 최적화

10주차: 운영 모니터링 및 성능 최적화

11주차: 운영 모니터링 및 성능 최적화

12주차: 운영 모니터링 및 성능 최적화

# 정리

- 오늘은 제가 오랜만에 주도적으로 만든 스터디를 공개적인 곳에 적음으로써 다짐하고자 글을 적어봤습니다!
- 흐지부지되지 않게 하기 위해 인원도 빡빡하게 뽑았고 기획도 점수를 분배하며 하는 방식은 처음이라 쉽지 않았었던 것 같은데 그래도 기획을 얼추 마무리 했으니 프로젝트를 시작해보려 합니다!!
- 꼭 열심히 해서 좋은 결과(프로젝트 결과와 팀원들의 큰 성장..?)를 들고 오겠습니다!


👉[백엔드 프로젝트 스터디 Organization](https://github.com/Dream-Backend-Study)입니다!
나중에 보시는 분들이 봤을 때 유의미한 결과가 있도록 열심히 하겠습니다!