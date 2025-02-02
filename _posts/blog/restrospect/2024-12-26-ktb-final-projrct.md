---
layout: post
title: Devita, kakaotech bootcamp Final Project
subtitle: Devita, kakaotech bootcamp Final Project
date: '2024-12-26 10:45:51 +0900'
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



<a href="https://github.com/kakaotech-large-scale-challenge" class="card-link" target="_blank" rel="noopener noreferrer">
    <img width="600" alt="image" src="https://github.com/user-attachments/assets/ffe7338e-587a-4861-8bfe-449488e08a7a" />
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


### 프로젝트 개요

성장이 필요하다고 느끼는 개발자에게 맞춤형 성장 미션을 제공하는 서비스

## 추진 배경
한국 소프트웨어 산업 협회의 IT/SW 산업인력현황 분석 보고서에 따르면 소프트웨어 부문의 인력은 약 50만명이고 지원 부문의 인력을 제외하여도 39만명 수준임.

<img width="472" alt="image" src="https://github.com/user-attachments/assets/2c4232af-dab4-443c-8ba6-32be5a9f5114" />

| 한국 소프트웨어 산업 협회의 IT/SW 산업인력현황 분석 보고서

기업의 채용 수요를 확인해보면 개발자에 대한 수요는 있지만 '필요 인력이 대기업에 스카우트됨'이라는 문제가 가장 큰 것을 확인할 수 있음.

<img width="472" alt="image" src="https://github.com/user-attachments/assets/e9626912-00a1-4bdd-8160-cd7b3e9c0cbd" />

| 한국 소프트웨어 산업 협회의 IT/SW 산업인력현황 분석 보고서

취업 준비생은 취업난을 호소하고 기업은 필요 인력의 부족을 이유로 구인난을 호소하고 있음.

결국 이러한 간극을 줄이기 위해서는 취업 준비생들이 기업이 요구하는 정도의 역량을 가지는 것이 최우선으로 생각되었음.

# 주요 기능
## 1. To-Do List 

사용자는 AI로부터 받은 일일 미션을 포함해 일정을 관리할 수 있음.

기본적인 카테고리 설정을 통해 할 일을 쉽게 분류할 수 있고, 캘린더 기능으로 할 일을 쉽게 확인할 수 있음

## 2. AI 기반 미션 추천 기능

사용자가 설정한 관심 개발 분야에 따라 개인화된 성장 미션을 제공

일일 미션은 스케줄러를 통해 매일 일정시간에 자동으로 추가

자율 미션은 사용자가 카테고리를 따로 설정하여 난이도 별로 3가지 미션을 제공

## 3. SNS 기능 

사용자는 자신의 학습 성과와 미션 완료 기록을 공유하며, 비슷한 관심사를 가진 개발자들과 교류 가능

## 4. 게이미피케이션 요소

사용자는 할 일과 추천 미션 완료를 통해 경험치 획득 가능

획득한 경험치로 자신의 캐릭터를 육성할 수 있으며, 각종 업적 달성 가능

# 기대 효과
1. 미션 추천을 통해 꾸준히 개발자 역량 강화
2. SNS 기능을 통한 개발자 커뮤니티 형성
3. 게이미피케이션을 통한 동기 부여
4. 개발자 취준생과 SW 기업들 간 간극 해소
5. 전체적인 개발자들의 수준 향상

# 아키텍쳐
<img width="841" alt="image" src="https://github.com/user-attachments/assets/fec0953e-2059-4c65-a683-5359a34e2b77" />

# Ground Rule
- 매주 월, 수, 금 오프라인 대면 회의
- Jira를 활용하여 일정 및 스프린트 관리
- 팀 내 기술 교류 세미나를 통한 협업 강화

# 회고

이번 kakaotech bootcamp에서 진행한 Final Project가 끝났습니다!

저희 조는 1조였고 Devita라는 개발자 맞춤 성장 도우미 서비스를 개발하였습니다.

이러한 프로젝트는 부트캠프를 참여한 모두가 개발자 취준생으로 성장에 목말라있다는 배경과 '취업난이 심화되는 상황에서 역량을 키울 수 있는 방법이 무엇이 있을까?'라는 생각에서 비롯되었습니다.

이번 프로젝트에서 저는 '분업보다는 협업을'이라는 슬로건을 핵심 가치로 두고 협업을 진행하였습니다.

저번 프로젝트에서 소통 부족으로 인해 서비스 런칭이라는 원하는 목표에 도달하지 못했었기 때문에 이번 프로젝트에서는 새로운 팀원들과 더욱 더 유기적인 협업을 통해 목표 이상을 달성해보자는 생각을 가졌습니다.

이렇게 하여 탄생된 것이 위의 Ground Rule이었습니다.

### 오프라인 회의

저희 부트캠프는 온라인으로 출석을 해도 되고 오프라인으로 교육장에 출석을 해도 되는 과정이었습니다.

하지만 유기적인 개발을 위해서는 오프라인 회의가 필요하다고 생각하여 월, 수, 금은 교육장에 필수적으로 출근하는 날로 만들고 지각비를 거뒀습니다.

### JIRA 도입

다음으로 서로의 진행 상황을 더 잘 확인하고 이해하기 위해서는 일을 가장 작은 단위로 쪼개고 실시간으로 어떠한 일을 하고 있는지 볼 수 있어야한다고 생각했습니다.

그래서 Jira를 도입하였고 팀원들을 위해 Jira 사용 가이드를 제작하여 배포하였습니다.

<table style="border: none; border-collapse: collapse;">
 <tr style="border: none;">
   <td width="25%" align="center" style="border: none; padding: 0 4px;">
     <a href="https://alswp006.github.io/project/devita/2024-10-23-Jira/">
       <img width="1022" alt="image" src="https://github.com/user-attachments/assets/3eb9a3fd-5f74-47f7-a95c-b6f9f552d6cd" />
       <br/>
       <strong>팀 프로젝트를 위한 JIRA 가이드라인</strong>
       <br/>
       <sub>2024.10.23</sub>
     </a>
   </td>
   <td width="25%" align="center" style="border: none; padding: 0 4px;">
     <a href="https://alswp006.github.io/project/devita/2024-11-20-JIRA-Github/">
       <img width="1022" alt="image" src="https://github.com/user-attachments/assets/4214daf8-56bb-4100-8076-ad757e4374ca" />
       <br/>
       <strong>팀 프로젝트를 위한 JIRA + GITHUB 가이드라인</strong>
       <br/>
       <sub>2024.11.20</sub>
     </a>
   </td>
 </tr>
</table>

### 팀 내 기술 교류 세미나 도입

유기적인 협업을 원했지만 저희의 회의는 프론트엔드 1, 백엔드 1, 클라우드 2, AI 2로 진행하였기 때문에 서로의 진행 상황을 들어도 이해하기 힘들고 점점 회의에 대한 집중도가 떨어지는 문제가 발생하였습니다.

이러한 문제를 해결하기 위해 기술 교류회를 제안하였습니다.

<img width="1063" alt="image" src="https://github.com/user-attachments/assets/f3989528-8838-459b-a217-07a818a01cb8" />

파이널 프로젝트 마무리 기간까지 한 달도 남지않은 시점이었지만 프로젝트에 대한 이해는 필수적이라고 생각했고 넓은 도메인 지식을 갖는 것은 협업을 넘어 개발자로써 성장하는 데에도 도움이 될 것이라 생각하였습니다.

<img width="1250" alt="image" src="https://github.com/user-attachments/assets/25b47cd2-d224-4a2d-a58e-05b607af54d3" />

이후 진행도 열심히 했습니다!

이로 인해 도메인 지식이 넓어지는 것 뿐만 아니라 저도 백엔드 개발보다 다른 분야의 개발 속도가 필요할 때, 클라우드의 Nginx Reverse Proxy나 AI의 데이터 수집 등에 도움을 주며 유기적인 개발을 할 수 있었습니다.

# 서비스 회고

- 기술 교류 세미나

기술 교류 세미나를 좀 더 빨리 진행했다면 도메인 지식 향상이나 협업에 더 효과적이었을 것이라는 생각이 들었음