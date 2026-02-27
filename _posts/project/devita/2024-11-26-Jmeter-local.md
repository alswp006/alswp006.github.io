---
layout: post
title: Jmeter 사용 방법
subtitle: Jmeter 사용 방법
date: '2024-11-26 10:45:51 +0900'
categories:
    - project
    - devita
tags: []
comments: true
published: true
list: true
order: 6
---

# 성능 테스트도 하셔야죠?(Jmeter Local)

서비스를 개발할 때 많은 문제 상황을 사전에 고려하여 고치는 것은 아주 중요한 일이라고 생각합니다.

서비스를 운영하며 많은 문제들과 직면하겠지만 트래픽이 많은 상황에서의 문제도 발생할 수 있을 것입니다.

이에 대한 문제를 사전에 찾기 위해 부하 테스트, 성능 테스트를 진행합니다!

저는 성능 테스트를 Jmeter로 진행하려 합니다!

## 선택 이유

Jmeter를 선택한 이유는 다음과 같습니다.

##### 1. 설치 및 사용이 쉬워 빠른 출시를 해야하는 현재 저희 서비스 상황에 맞았다.

저희는 빠른 서비스 개발 및 출시를 목표로 하여 테스트도 빠르게 진행하고 싶었습니다.

이를 위해 설치와 사용이 쉬운 Jmeter를 사용하려 했습니다!

##### 2. 팀원 중 Ngrinder를 사용해본 팀원이 있다.

저희 팀 클라우드 팀원 중 Ngrinder를 사용해봤던 팀원이 있었습니다.

저희 팀은 매 주 기술 교류회를 하는데 제가 Jmeter를 학습하여 이에 대해 발표한다면 서로에게 좋은 지식 공유가 될 것이라 생각했습니다.

## 사용 방법 고려

저는 총 3가지 방법을 고려했습니다.

##### 1. Local 환경에 바로 설치하여 사용

##### 2. Docker를 이용하여 가상 환경에서 사용

##### 3. AWS Spot Instance를 이용하여 사용

사실 1, 2번을 많이 고려하였고 3번에 대해서는 테스트 과부하가 생길 때 사용하려고 고려했습니다.

2번은 관련 레퍼런스가 많이 없고 설치 및 사용에 시간이 꽤나 걸릴 것 같아 저는 최종적으로 1번을 결정하였습니다.

추 후 테스트 규모가 커지면 3번 방법을 사용하려 합니다.

## 설치 방법

> HomeBrew를 이용하여 설치하는 방법입니다.

저는 M1 환경입니다!!

M2 환경에서는 오류가 발생하여 아카이브 파일을 이용하여 설치해야한다는 얘기가 있습니다!


##### 1. HomeBrew를 이용하여 jmeter 설치

``` shell
brew install jmeter
```

##### 2. jmeter 실행

``` sh
open /opt/homebrew/bin/jmeter
```

<img width="1382" alt="image" src="https://github.com/user-attachments/assets/582cca9c-39f0-4588-b12d-80e1b64cf763">

Jmeter GUI 등장..!!!!!

(GUI 오류 안나고 한 번에 딱 뜰 때 뭔가 기분 좋았습니다)

## 사용 방법

원래는 테스트할 때 GUI를 사용하지 않고 테스트를 해야 부하가 적다고 합니다.

GUI가 생각보다 많은 리소스를 차지하기 때문인데 저는 간단한 테스트를 해볼 것이라 GUI를 통해 테스트해보겠습니다.

저는 이를 위해 스프링 부트 프로젝트를 한 개 만들어서 테스트를 진행해보았습니다.

Spring Controller Code
``` java
@RestController
@Slf4j
public class TestController {

    @GetMapping("/test1")
    public ResponseEntity<String> test() {
        log.info("test123");

        return ResponseEntity.ok("test123");
    }
}
```

### Thread Group 및 HttpRequest 추가 후 테스트 해보기
- Thread Group 추가

add - Thread - Thread Group

<img width="1915" alt="image" src="https://github.com/user-attachments/assets/db69a1cb-656e-4401-b8e4-88dc4cf23c79">

- HTTP Request 추가

add - Sampler HTTP Request

<img width="1915" alt="image" src="https://github.com/user-attachments/assets/191f09fc-b542-408c-a632-68be5dd6a6aa">

- HTTP Request 설정

Protocol: Http인지 Https인지

Server Name or IP: 서버의 주소

Port Number: 포트 번호

HTTP Request: HTTP 메소드

Path: 요청 보낼 주소의 경로

<img width="1915" alt="image" src="https://github.com/user-attachments/assets/03fcecb6-63d5-4203-8e4c-ddce09287289">

- Thread Group 설정

Number of Thread: 쓰레드(유저) 수

Ramp-up Period(seconds): 지정된 유저가 모두 로딩될 시간

Loop Count: 반복 횟수

<img width="1915" alt="image" src="https://github.com/user-attachments/assets/536f3236-2ee6-4035-b30d-d4bca06e21b9">

만약 이와 같이 설정한다면 10초에 100번의 부하를 1번 반복하도록 하는 것입니다.

<img width="1915" alt="image" src="https://github.com/user-attachments/assets/4a4497ad-7643-4741-84d8-0965fc4e5b71">

테스트는 상단 초록색 재생 버튼을 누르면 됩니다.

위의 메시지 창은 파일을 저장할건지 묻는 건데 저는 간단한 테스트이니 NO로 설정했습니다.

<img width="1281" alt="image" src="https://github.com/user-attachments/assets/652bbdb7-7ed0-4255-a8af-04f241b4a625">

<img width="1281" alt="image" src="https://github.com/user-attachments/assets/04fc7c28-1c1d-40b2-87a9-e429618053f5">

위와 같이 테스트가 잘 수행되는 것을 확인할 수 있습니다.

추가적으로 자바는 5개 정도의 쓰레드로 해당 요청을 처리한 것 같습니다.

### Monitor 추가

그렇다면 이 테스트에 대한 정보를 시각화하여 보겠습니다.

- View Results Tree, Summary Report, Graph Result 추가

add - Listener - View Results Tree

add - Listener - Summary Report

add - Listener - Graph Results

<img width="1917" alt="image" src="https://github.com/user-attachments/assets/5a4d58ae-4d71-4ab3-b53d-29364457708f">

- 테스트 후 확인

- View Results Tree

<img width="1917" alt="image" src="https://github.com/user-attachments/assets/138a912f-bf86-4977-9f0e-240fe3fb7d87">

- Summary Report

<img width="1917" alt="image" src="https://github.com/user-attachments/assets/8c145acf-ac45-4b45-897d-df6aeb449122">

- Graph Results

<img width="1917" alt="image" src="https://github.com/user-attachments/assets/d6132cc4-1e54-4b90-86e6-b646645f2cec">
<img width="1917" alt="image" src="https://github.com/user-attachments/assets/c3867e51-0867-49c5-a862-5ebdb61c7a3f">

그래프의 가시성이 굉장히 별로라는 것을 확인할 수 있습니다.

제가 보고 싶은 것은 TPS(Transaction Per Second)이므로 이를 보기 위해 추가 플러그인을 설치해주겠습니다.

### jpgc-graphs-basic 설치

이를 설치해주기 위해 [링크](https://jmeter-plugins.org/?search=jpgc-graphs-basic)를 방문하여 파일을 다운로드 받아줍니다.

그리고 이후 본인 jmeter에 맞는 폴더에 이를 옮겨 줍니다.

저는 homebrew로 jmeter를 설치해주었기 때문에 /opt/homebrew/Cellar에 jmeter 폴더가 있었고, 직접 원하는 폴더로 이동하여 Finder로 켜주고 파일을 옮겨주었습니다.

폴더 이동 후 열기

``` sh
cd /opt/homebrew/Cellar/jmeter/5.6.3/libexec/lib/ext
open .
```

<img width="820" alt="image" src="https://github.com/user-attachments/assets/f5e37b30-5ef6-4ada-963e-17d1b1f1f410">

- 재실행 후 추가

재실행했다면 add - Listener - jp@gc - Transactions per Second를 추가해줍니다.

<img width="1917" alt="image" src="https://github.com/user-attachments/assets/f7945cf4-4f94-4736-a1b0-98bc5e11670c">

- 다시 테스트

<img width="1909" alt="image" src="https://github.com/user-attachments/assets/21699c06-0202-4aa7-890c-dc47948f1a3d">

깔끔한 디자인으로 잘 나오는 것을 확인할 수 있습니다!!

실시간으로 트래픽을 확인할 수 있습니다.

## Spring 확인

<img width="1909" alt="image" src="https://github.com/user-attachments/assets/ecc17a8a-ca10-430c-a0e8-3154f3249aa7">

## Header 설정하기

저희 서비스는 HTTP 요청을 할 때 Access Token을 Header에 담아서 인가 작업을 수행합니다.

Header는 다음과 같이 설정할 수 있습니다.

<img width="1909" alt="image" src="https://github.com/user-attachments/assets/6d502904-be55-48a8-bc64-e6071a8baee1">

HTTP Header Manager를 만들고 아래의 add 버튼을 눌러 헤더를 설정해주면 됩니다.

<img width="1780" alt="image" src="https://github.com/user-attachments/assets/b356b885-55a3-4339-9b7f-6a26312cac99">

저는 액세스 토큰을 직접 넣어줬는데 루프를 통해 테스트하는 방법이 있다고 해서 추후 고도화할 계획입니다.

## Body 설정하기

HTTP Request에서 바디를 JSON 형태로 넣어줄 수 있습니다.

<img width="1780" alt="image" src="https://github.com/user-attachments/assets/1a8bb0ed-0480-47c8-9fbd-119ab097c82f">
