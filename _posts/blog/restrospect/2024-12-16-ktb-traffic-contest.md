---
layout: post
title: Large-Scale Load Testing Challenge, kakao x goorm - 대상(카카오 대표이사 상)🥇
subtitle: Large-Scale Load Testing Challenge, kakao x goorm - 대상(카카오 대표이사 상)🥇
date: '2024-12-16 10:45:51 +0900'
categories:
    - blog
    - retrospect
tags:
    - AnomalyDetection
comments: true
published: true
list: true
---

<style>
.card-link {
    text-decoration: none;
    color: inherit;
    display: block;
    width: fit-content;
    transition: transform 0.2s ease;
}
.card-link:hover {
    transform: translateY(-2px);
}
.card-link img {
    border: 1px solid #e1e4e8;  /* 테두리 추가 */
    border-radius: 8px;  /* 모서리 둥글게 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);  /* 그림자 효과 */
    max-width: 100%;  /* 반응형을 위한 최대 너비 설정 */
    height: auto;  /* 비율 유지 */
}
</style>

<img width="431" alt="image" src="https://github.com/user-attachments/assets/fca306f0-1726-49dd-89d1-5c356920d027" />


<a href="https://github.com/kakaotech-large-scale-challenge" class="card-link" target="_blank" rel="noopener noreferrer">
    <img width="600" alt="image" src="https://github.com/user-attachments/assets/bd071b01-c6b5-4c6e-9919-69f919e08d18" />
</a>


### 팀원 구성

| 이름(Kakao) | 역할 |
|-------|-------|
| 김민제(Milo.Kim) | BackEnd Developer |
| 한주리(Jully.Han) | FrontEnd Developer |
| 홍진호(Jinho.Hong) | Cloud Developer |
| 박찬영(Ayaan.Park) | Cloud Developer |
| 박현혜(Winter.Park) | AI Developer |
| 김도윤(dorothy.Kim) | AI Developer |

## 대회 소개

### 대규모 서비스 개발 및 운영을 위한 실전 엔지니어링 워크숍

## 목적
- 대규모 부하를 견딜 수 있는 서비스 구현
- 실전 엔지니어링 경험 축적
- 팀원들 간의 협업 및 능력 향상
- 다른 곳에서는 할 수 없는 경험해보기

## 프로젝트 소개
각 팀은 동일한 서비스에 대해 리팩토링과 아키텍쳐 최적화 등을 3일간 진행

### 채팅 서비스에 대한 부하테스트
- 동시 접속자 수 증가
- 초기 100명에서 시작하여 매 30초마다 100명씩 증가
- 최대 3,000명까지 순차적 증가 목표
- 각 사용자당 최소 1개 이상의 WebSocket 연결 유지
- 제한된 리소스로 최대한의 효율 달성
- 최대 30대의 t3.small 인스턴스 사용

## 사용 기술 스택
- 프론트엔드: React
- 백엔드: Node.js (Express.js), Socket.IO
- 데이터베이스: MongoDB
- 캐싱: Redis

## 규칙
<img width="1538" alt="image" src="https://github.com/user-attachments/assets/3c93ae6e-9c71-4bc0-90fa-cd5b914902f2" />

## 각 역할에 대한 기대 효과
<img width="1524" alt="image" src="https://github.com/user-attachments/assets/989e12b0-caf7-40fe-98de-d7aeb9b448ab" />

## 채점 기준
- 동일한 사용자 수에 따른 요청의 성공/실패 개수로 판단

## 회고

이번 Kakao x Groom 대규모 부하테스트 대회에 참여했습니다!

이번 대회는 현재 파이널 프로젝트를 진행 중인 팀으로 진행하였습니다.

저희 팀의 구성은 프론트엔드 1, 백엔드 1, 클라우드 2, 인공지능 2였으며 인공지능 인원은 파이널 프로젝트 진행으로 인해 부하테스트에 많이 참여하지 못하는 상황이었습니다.

### JS와 Java

저의 주력 언어는 Java/Spring이지만 대회에서 제공되는 언어는 Node.JS였어서 코드 리팩토링에 관한 고민을 많이 하였습니다.

Java로 리팩토링하여 백엔드를 개편한다면 Multi Thread의 이점을 더 가져갈 수 있을 것이라 생각했습니다.

하지만 이렇게 되면 JS -> Java 코드 리팩토링에 시간을 더 써야하고 이렇게 되면 이번 대회에서만 할 수 있는 특별한 경험들은 못하게 될 것이라 생각하였습니다.

저는 조금 더 아키텍쳐적인 고민, DB에 대한 고민들을 더 가져가기 위해 Java 리팩토링은 진행하지 않기로 했습니다.

### 핵심 전략

저희는 총 30개의 인스턴스 서버를 사용할 수 있었습니다.

기본적으로 프론트는 React, 백엔드는 Node, DB는 MongoDB, Cache는 Redis를 사용한 코드가 제공되었습니다.

또한 대회에서는 최대 3500명의 사용자를 두고 E2E 테스트를 하는 것을 목표로 하고 있었습니다.

"3500명의 사용자가 채팅 방을 만들고 채팅을 하는 상황에서 굳이 MongoDB라는 대용량 DB가 필요할까?"라는 생각을 하여 MongoDB를 없애고 Redis만 사용하는 전략을 구상하였습니다.

이렇게 했을 때 Redis와 백엔드, 프론트엔드 서버의 갯수를 관리하는 것이 관건이었습니다.

우선 EC2 외의 S3, LoadBalancer와 같은 기능은 서버 갯수에 들어가지 않았기 때문에 프론트엔드는 S3에서 정적 파일을 로드해주는 방식을 사용하여 EC2를 아끼기로 했습니다.

이렇게 되었을 때 백엔드 서버와 Redis에 총 30개의 EC2를 온전히 사용할 수 있었고 백엔드 서버는 최대한으로 두기를 원했습니다.

EC2는 t3.small로 제한되었고 t3.small은 싱글 코어에 2GB의 RAM을 가지고 있었습니다.

### Redis 클러스터 갯수 선정 기준

우선 t3.small은 싱글 코어기 때문에 한 서버 내에 여러 Redis를 두는 것은 그리 효율적이지 않을 것이라는 생각을 하였습니다.

t3.small은 2GB의 RAM을 가지고 있기 때문에 한 서버 당 저장할 수 있는 대략적인 데이터의 갯수를 유추하였습니다.

우선 영어는 1바이트, 한글은 3바이트 정도로 두었을 때 한 채팅의 메시지나 유저의 토큰 값 등을 저장하는데 하나의 Key 당 100바이트를 사용한다고 가정하였습니다.

인스턴스의 RAM은 2GB이지만 OS, 프로세스 등의 사용 공간을 가정하여 Redis가 사용할 수 있는 공간은 1.5GB라고 가정하였습니다.

이렇게 단순 계산 하였을 때 데이터의 갯수를 1500만개 저장할 수 있고 넉넉하게 잡아도 500 ~ 1000만개를 저장할 수 있다는 결론을 도출하였습니다.

이번 부하 테스트에서 아무리 작업을 많이 해도 1000만개를 넘길 일은 없을 것이라 생각하였고 데이터 저장 갯수는 클러스터 갯수 선정 기준에서 제외하기로 하였습니다.

#### 작업 처리 효율 향상

그렇다면 클러스터의 갯수를 선정하는 기준 중 가장 중요한 것은 Single Thread인 Redis에서의 작업 처리 효율이라고 생각하였습니다.

그래서 최종적인 아키텍쳐는 다음과 같이 구성하였습니다.

Node.JS 20대, Redis 10대 (마스터 5 + 레플리카 5)

이에는 다음과 같은 고려 사항이 있었습니다.

###### 1. 처리량

마스터 노드 5대로 처리량의 이점을 가져가려 했습니다.

각 노드에 대한 데이터 해싱은 백엔드 서버에서 하고 마스터 노드는 작업 처리만 하면 충분히 성능 이점을 가져갈 수 있을 것이라 생각했습니다.

또한 마스터 노드는 CUD 작업을, 레플리카 노드는 R 작업을 수행하게 함으로써 처리량을 더욱 분산시켰습니다.

데이터 정합성이 중요한 대회는 아니었기 때문에 마스터 노드와 레플리카 노드의 데이터 불일치는 감수할 수 있다고 생각하였습니다.

###### 2. 성능 안정성

마스터 노드가 5대라면 한 노드에 트래픽이 몰려도 전체 성능이 한 번에 완화되는 현상을 줄일 수 있을 것이라 생각했습니다.

###### 3. 고가용성

마스터 노드 당 레플리카 노드를 한 개씩 두어 failover 발생 시 마스터 노드로 승격할 수 있도록 하였습니다.

클러스터 모드에서는 각 노드가 서로를 감시하고 있기 때문에 이 방법으로 HA를 보장할 수 있을 것이라 생각했습니다.

### Redis Clustering Test

Redis Clustering을 로컬에서 테스트해보기 위해 Docker Compose yml 파일을 구성하여 각각의 가상환경에 Redis를 띄워 테스트해보았습니다.

이 후 EC2에 띄운 뒤 클러스터를 엮고 테스트하였습니다.

### Redis Clustering Hashing

기본적인 Redis Cluster에서의 작업 분배는 해시 슬롯을 사용합니다.

16384개의 Hash Slot이 있고 이를 노드 별로 잘 분배하여 사용합니다.

저는 다음과 같이 Hash Slot을 균등하게 분배하였습니다.

<img width="425" alt="image" src="https://github.com/user-attachments/assets/0c4def74-f29e-4023-b0a8-3ea27f81b382" />

0-3276, 3277-6553, 6554-9829, 9830-13106, 13107-16383

이와 같이 분배하였습니다.

제가 이해한 바로는 이는 다음과 같이 분배됩니다.

1. 키 문자열에 대해 CRC16 해시를 계산
2. 그 결과를 16384로 나눈 나머지가 그 키의 해시 슬롯
3. 이 해시 슬롯은 미리 노드별로 할당된 슬롯 범위 중 하나에 속하고, 해당 슬롯을 가진 마스터 노드가 키를 관리한다.

추가적으로 HashTag를 사용하거나 슬롯 분배를 조정해주는 작업은 하지 않았습니다.

### 백엔드 서버 내 Docker를 이용한 리소스 최적화

이렇게 Redis 클러스터링 후 자체적으로 부하 테스트를 진행해보았을 때 각 서버의 리소스 사용량이 10% 내외인 것을 확인하였습니다.

그래서 백엔드 서버 내 Docker를 이용하여 5개의 컨테이너를 이용하여 Node.JS 서버를 띄우는 것을 생각해보았습니다.

Docker로 서버를 띄운 뒤 LoadBalancer에 각 서버를 연결하여 트래픽을 분산시켰습니다.

거의 막바지에 생각해낸 방법이라 최적화된 정도는 측정해보지 못했지만 서버 리소스 사용량은 증가하였습니다.

t3.small이 싱글 코어라서 실질적인 도움이 되었는지는 잘 모르겠습니다.

직접 성능에 대한 측정을 해보지 못한 것이 아쉬웠습니다.

### 메시지 큐, 이벤트 큐에 대한 고민

소켓 통신을 할 때 Kafka나 RabbitMQ를 사용하는 것을 고민하였습니다.

추가적으로 Kafka와 RabbitMQ 고려했을 때 소켓 통신에 RabbitMQ 유리할 것이라 생각하였습니다.

하지만 메시지 큐 시스템을 활용했을 때, 어쨌든 t3.small 서버에 구현을 해야하고 이 서버의 성능이 병목 지점이 될 것을 우려하였습니다.

최종적으로 메시지 큐를 사용하지 않았습니다.

## 최종 아키텍쳐

<img width="1727" alt="image" src="https://github.com/user-attachments/assets/09b1469d-8f34-486e-860c-bc2f17507958" />


## 개발 회고

- 한 인스턴스 내 Docker로 Node 서버를 나눈 것에 대한 성능 측정을 해보지 못해 아쉬웠음

이번 대회에서는 비용 문제로 자체적인 테스트를 해보지 못했지만 만약 기회가 된다면 직접 성능 측정을 해보고 싶다!

- 각 Redis의 작업 처리량을 모니터링해보지 못하여 아쉬웠음

Redis가 터지지 않고 작업 처리를 무난하게 잘 했기 때문에 서버 갯수가 모자라지는 않았던 것으로 예상됨

하지만 작업 처리량을 모니터링할 수 있었다면 좀 더 최적의 마스터 노드 갯수로 조정할 수 있었을 것이고 그만큼 백엔드 서버를 스케일 아웃할 수 있었을 것 같음

- Java를 이용한 서비스에서 쓰레드 풀 조정을 했다면 더 좋은 경험이 되었을 것 같음

시간이 없어 JS 코드를 Java로 리팩토링하지 못했지만 다음에는 Java를 이용하여 멀티 쓰레드의 이점을 살려서 더 많은 부하를 견딜 수 있는 서비스를 만들어보고 싶음

- 시간을 넉넉히 들여 각 수정사항마다 성능을 측정하여 정량적으로 최적화된 지표를 비교하였으면 추후 서비스 개발에 더 도움이 되었을 것 같음

현재 프로젝트에서는 node.js 적응, 첫 redis clustering 등 시간이 소요되는 부분이 많았고 시간이 부족하였기 때문에 각 최적화마다 성능을 측정해보지 못했음

결과는 좋았지만 추후 서비스와 내 개발 실력에 도움이 되려면 각 최적화 구간의 성능을 측정하였으면 좋았을 것 같음