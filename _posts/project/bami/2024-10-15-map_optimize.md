---
layout: post
title: \[최적화 및 알고리즘\] API 호출 최적화
subtitle: 추천 여행지 경로 최적화
date: '2024-10-15 10:45:51 +0900'
categories:
    - project
    - bami
    - java
    - spring
    - study
tags:
    - AnomalyDetection
comments: true
published: true
list: true
order: 6
---


# [API 호출 최적화] API 호출을 420번에서 14번으로?

## 문제 상황: [[프로젝트 최적화 및 알고리즘] 추천 여행지 경로 최적화 문제](https://alswp006.github.io/project/bami/java/spring/study/2024-10-10-map/)

- 이전 포스트에서 얘기했던 해결해야할 문제는 다음과 같습니다.

1. 너무 가까운 거리는 계산할 수 없다.
2. API호출이 너무 많고 이 때문에 비용이 너무 많이 발생한다.

- 우선 가까운 거리를 계산할 수 없는 문제는 API 변경 외에는 해결할 수 없으니 2번째 문제부터 해결해보겠습니다.

# 문제 해결
## 너무 많은 API를 호출해서 시간이 너무 오래걸림

<img width="1662" alt="image" src="https://github.com/user-attachments/assets/aa69a2e3-0df4-4012-91fa-44f27d95feef">

- 이전 포스트에서 작성한 문제점인 20개의 장소가 주어지고 출발지까지 21개의 장소가 있을 때 API를 420번 요청하고 있었습니다.

    -> n * (n - 1)
- 난지 한강공원에서 출발해서 서울랜드로 가는 거리와 서울랜드에서 출발해서 난지 한강공원에 가는 거리가 다르다고 생각해서 이를 고려해주려고 했지만 큰 차이는 없기 때문에 둘을 한 번의 요청으로 묶어주고 똑같게 만들어주기로 했습니다.

```java
// 원래 코드
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        if (i != j) {
            dist[i][j] = (int) getDistanceBetweenPlaces(places.get(i), places.get(j));
            count += 1;
        } else {
            dist[i][j] = 0;
        }
    }
}

//수정한 코드
for (int i = 0; i < n; i++) {
	  for (int j = i; j < n; j++) {
	      if (i != j) {
	          int distance = (int) getDistanceBetweenPlaces(places.get(i), places.get(j));
	          dist[i][j] = distance;
	          dist[j][i] = distance;
	          count += 1;
	      } else {
	          dist[i][j] = 0;
	      }
	  }
}
```

- 결과

<img width="1662" alt="image" src="https://github.com/user-attachments/assets/a06efb2d-9679-45b6-a723-00cc6f5c489a">

<img width="1662" alt="image" src="https://github.com/user-attachments/assets/164cf009-eba2-4174-80dc-e7174eeb0ab0">

- 일단 시간과 API 요청이 반으로 줄었습니다.
- 하지만 구글 API에는 다음과 같은 문제가 또 있었습니다..
    - 한국 정부에서는 국가 안보를 이유로 국내 지도 데이터를 구글에 제공하고 있지 않습니다.
    - 이로 인해 매우 가까운 거리에서의 거리를 영영 구할 수 없다.
    - 구글 API의 무료 평가판 사용 기간이 끝나간다..
- 그래서 저는 Naver API로 변경을 하기로 했습니다!!

## Naver API로 변경

1. Google Geocoding API → Naver Geocoding API로 변경
2. Google Distance Matrix API → Naver Direction API 사용

# API 호출 횟수 최적화

## Naver Maps Directions API 적용

- 기존 Google Distance Matrix API를 Naver Distances API 로 변경하였습니다.
- 왜인지는 모르겠지만 구글보다 네이버의 API 호출 속도가 2.5배 정도 더 느렸습니다..
- Google Distance Matrix API 사용
    - 210 번 호출: 45초
    - 420번 호출: 100초
- Naver Maps Directions API 사용
    - 210번 호출: 123초
    - 420번 호출: 260초

## 기존의 API 호출 로직

- 만약 하루에 5개의 장소를 가고 4일의 여행을 간다고 하면 총 20개의 장소가 반환되고 출발지까지 포함하여 총 21개의 장소 간의 거리를 각각 구해줘야합니다
- 이는 21 * 21 - 20 = 420 번의 호출이 필요하고 260초가 소요되었습니다.

<img width="1665" alt="image" src="https://github.com/user-attachments/assets/87a08ef4-372a-47b9-b64a-a0d8a75d634d">


<img width="1665" alt="image" src="https://github.com/user-attachments/assets/13cd3cc0-36af-4018-97ec-99656d3370ba">


- 그래서 위에서 했던 것처럼 A에서 B까지 가는 거리를 구하면 B에서 A까지 가는 거리에도 저장해주어 API 호출 횟수를 반으로 줄일 수 있었습니다.

<img width="1665" alt="image" src="https://github.com/user-attachments/assets/49e56d0e-a1b3-47f4-ab59-cef231cbf52e">


<img width="1665" alt="image" src="https://github.com/user-attachments/assets/d0effb48-8f62-4dc1-afbd-68d83f2330a4">


- 하지만 이마저도 많은 느낌이고 위치를 구하는 데에만 123초가 걸리는 것이 문제였습니다.
- 그래서 더 많은 방법을 찾아보기로 했습니다!

## Naver Maps Directions API의 경유지 기능을 사용한 API 호출 최적화

- Google Distance Matrix API에서는 경유지를 추가 기능을 한국에서의 보안 문제 때문에 사용하지 못했지만 Naver Directions API는 경유지 기능을 사용할 수 있었습니다.

<img width="1665" alt="image" src="https://github.com/user-attachments/assets/408048ce-2872-4a95-a397-fd603e0f2fc9">


- 우선 Naver Maps Directions API에는 5와 15가 있는데 저는 API 호출을 최대한 줄이기 위해 경유지가 최대 15개까지 지원되는 15를 사용하기로 했습니다!
- [Naver Maps Directions 15 API 학습](https://api.ncloud-docs.com/docs/ai-naver-mapsdirections15-driving)

### 경유지 사용 노드 간 거리 계산 테스트

```java
https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving?start=126.9783882,37.5666103&goal=127.027583,37.497942&waypoints=126.987621,37.563616|126.990432,37.554738|126.995621,37.548616&option=trafast
```

- 출발지와 도착지를 설정하고 경유지를 추가하여 테스트

<img width="702" alt="image" src="https://github.com/user-attachments/assets/293de0f4-4148-4a80-a67c-ad9eada3b598">


- route - trafast - summary - start: 출발지 정보
- route - trafast - summary - goal: 마지막 경유지에서 목적지까지의 정보
- route - trafast - summary - waypoints: 경유지 정보

<img width="702" alt="image" src="https://github.com/user-attachments/assets/f55d69b3-c84c-4c29-b93a-26d75eaf1b90">


- 총 15개의 장소를 넣어 구하는 테스트도 성공하였습니다!

## 경유지를 이용한 거리 최적화

- 우선 저는 아래의 A부터 S까지의 위치가 있다고 생각하고 이에 대한 거리를 구해줘야 합니다

<img width="710" alt="image" src="https://github.com/user-attachments/assets/9d9e4120-10dd-498e-aaa5-38bd1a646217">

### 1. 대각선끼리 경유지에 넣기
- 제가 생각한 첫 번째 방법은 다음과 같습니다.
1. 우선 출발지 A, 도착지 S, 경유지에 그 사잇값들을 넣어줘서 A-B, B-C, C-D, …, R-S의 거리를 구해줍니다.
    
    ⇒ 총 API 호출 1번
    

<img width="710" alt="image" src="https://github.com/user-attachments/assets/b9f2f920-b82f-42b1-851b-02309aa5c683">


2. 그 다음 아래의 반복문과 같이 A-C, C-E, E-G, …, Q-S의 거리를 구해줍니다.
    
    ⇒ 총 API 호출 2번
    

```java
for (A부터 : S까지 : 2)
```

<img width="710" alt="image" src="https://github.com/user-attachments/assets/239c5f72-dd5d-4213-b9a1-fdc39016a0bd">


3. 그 다음 동일하게 아래의 반복문과 같이 B-D, D-F, F-H, …, P-R의 거리를 구해줍니다.
    
    ⇒ 총 API 호출 3번
    

```java
for (B부터 : S까지 : 2)

```

<img width="710" alt="image" src="https://github.com/user-attachments/assets/dedb11bf-d19b-4b78-ba72-46dec23f7b8e">


---

- 이 방식대로 계속 진행한다면 다음과 같은 규칙성이 생깁니다.
    - (0, 0)부터 대각선으로 거리를 채울 때 필요한 API 호출 횟수는 0
    - (1, 1)부터 대각선으로 거리를 채울 때 필요한 API 호출 횟수는 1
    - (2, 2)부터 대각선으로 거리를 채울 때 필요한 API 호출 횟수는 2
    - (3, 3)부터 대각선으로 거리를 채울 때 필요한 API 호출 횟수는 3
    - …
    - (10, 10)부터 대각선으로 거리를 채울 때 필요한 API 호출 횟수는 10
    - (11, 11)부터 대각선으로 거리를 채울 때 필요한 API 호출 횟수는 9
    - …
    - (19, 19)부터 대각선으로 거리를 채울 때 필요한 API 호출 횟수는 1
- 그러면 구글 API를 사용했을 때와 같은 예시로 출발지까지 고려하여 21개의 장소에 대해 각 거리값을 구해주면 1 + 2 + … + 9 + 10 + 10 + 9 + … + 2 + 1 = 110으로 API 호출 횟수를 절반 가까이 줄일 수 있습니다.
- 이를 코드로 나타내면 다음과 같습니다.
    
    ```java
    // n = 21
    // 1~10까지는 경유지를 통해 거리 구하기
    for (i = 1부터: 20/2까지){
        for (j = 0부터 : i - 1까지){
            for (k = j부터 : n - i까지 : i 스텝으로){
                경유지 추가
            }
            거리 구하기
        }
    }
    
    // 11~20까지는 각각 개별로 거리 구하기
    for (i = 11부터 : 20까지){
        for (j = n/2+1+i부터 : n 까지 : j++){
            거리 구하기
        }
    }
    ```
    
- API 호출 횟수로 테스트 해보기
    - 구현 코드
    
    ```java
    int count = 0;
    for (int i = 1; i < n / 2 + 1; i++){
        for (int j = 0; j < i; j++){
            List<String> arr = new ArrayList<>();
            arr.add(places.get(j).getName());
            for (int k = j; k < n - i; k += i){
                arr.add(places.get(k+i).getName());
                dist[k][k + i] += 1;
    
            }
            for (String s : arr){
                System.out.print(s + "   ");
            }
            count += 1;
            System.out.println();
        }
    }
    
    for (int i = 0; i < n; i++){
        for (int j = n / 2 + 1 + i; j < n; j ++){
            dist[i][j] += 1;
            count += 1;ㄱ
        }
    }
    
    System.out.print("API 호출 횟수 = ");
    System.out.println(count);
    printDistanceMatrix(dist, places);
    ```
    
    <img width="1647" alt="image" src="https://github.com/user-attachments/assets/a74a5772-3ea4-4971-87dc-de762c9b5c8b">

    
    모두 1번씩 거리를 구하고 API 호출은 총 110회로 계산과 동일한 것을 확인하였습니다.
    
- 하지만 이 방법 또한 너무 많은 API를 호출한다고 생각하였습니다.
- 더 줄여보겠습니다!!

## 최적의 알고리즘 개발

- 현재는 대각선을 기준으로 경유지를 정해서 거리를 구하고 있습니다.
- 위의 1→2→3→4→5→…→8→9→10의 방법으로 진행하면 경유지를 꽉 채워서 사용하지 못하고 비는 경유지가 생깁니다.
- 경유지를 최적으로 사용하는 알고리즘을 만드는 것을 목표로 생각하였습니다.

### 가로 2줄을 한 개로 묶어서 경유지로 만들기

- 그렇게 생각해서 나온 최적의 방법은 다음과 같습니다.
    
    → 위에서 두 줄씩 묶어서 경유지로 만들어주자!
    
- 1 → 2 → 3 → 1 → 4 → 2 → 5 → 1 → 6 → 2 → 7 → 1 → 8 → 2 → 9 → 1 → 10 → 2
- 위와 같이 출발지를 1, 목적지를 2 경유지를 2, 3, 1, 4, 2, 5,…, 1, 10으로 넣어준다면 다음과 같이 거리를 구할 수 있습니다!
- 이 로직의 경유지 흐름은 다음과 같습니다.

<img width="705" alt="image" src="https://github.com/user-attachments/assets/32f526ef-257a-4425-8683-32da1a8edf22">


### 구현 시 생각해야 할 부분

1. 끝에 도달해서 다음 라인으로 이동할 때 아래와 같은 경우 S → C로 가는 거리가 생기는데 이에 대한 예외 처리를 해주어 데이터를 잘 버려줘야 합니다.

<img width="705" alt="image" src="https://github.com/user-attachments/assets/bf9bbc5d-8d9c-498a-90a9-2bb6c13ecb4d">


2. 경유지에 넣을 수 있는 최대 갯수가 15개 이기 때문에 이를 잘 처리해줘야 합니다.

<img width="705" alt="image" src="https://github.com/user-attachments/assets/2ea7e31c-78fc-4d45-adaf-0355af27e87c">


## 최적 경로지를 구하는 알고리즘 구현

- 해당 결과에도 규칙성이 있습니다.
- 1 → 2 → 3 → 1 → 4 → 2 → 5 → 1 → 6 → 2 → 7 → 1 → 8 → 2 → 9 → 1 → 10 → 2
- 처음 두개를 보면 가로 줄의 행 번호가 나오고 4개씩 규칙이 반복되고 있습니다.
    - 3 → 1 → 4 → 2, 5 → 1 → 6 → 2, …
    - 위의 순서를 가져와서 리스트에 숫자로 저장해놓습니다.
- 이를 구현해보면 다음과 같습니다.
#### 1. 순서를 가져와서 저장하기
    
    ```java
    public List<Integer> getApiSequence(int n) {
        int n = 10;
        List<List<Integer>> answer = new ArrayList<>();
        int[][] b = new int[n][n];
    
        for (int i = 1; i <= n; i += 2) {
            List<Integer> arr = new ArrayList<>();
            arr.add(i);
            if (i + 1 > n) break;
            arr.add(i + 1);
    
            for (int j = i + 2; j <= n; j += 2) {
                arr.add(j);
                arr.add(i);
                if (j + 1 > n) break;
                arr.add(j + 1);
                arr.add(i + 1);
            }
            answer.add(arr);
        }
    
        for (List<Integer> a : answer) {
            int prev = a.get(0) - 1;
            for (int j = 1; j < a.size(); j++) {
                b[prev][a.get(j) - 1]++;
                b[a.get(j) - 1][prev]++;
                prev = a.get(j) - 1;
            }
        }
    }
    ```
    
    - 행렬 결과 확인
    
<img width="495" alt="image" src="https://github.com/user-attachments/assets/42cdd29e-7d77-4fea-b61b-92527abe5601">

    
    - 출력 결과
    
<img width="1664" alt="image" src="https://github.com/user-attachments/assets/7baac9a8-8a6a-414a-958a-0e609fdb9717">

    
#### 2. 위 순서들을 파싱하기
- 각 api 요청에 넣을 순서를 파싱해줍니다.
    - 첫 번째 api 요청, start: 1, waypoints = [2, 3, 1, 4, 2, 5, 1, 6, 2, 7, 1, 8, 2, 9, 1], end: 10
    - 두 번째 api 요청, start: 10(이전의 끝 값), waypoints = [2, 3, 4, 5, 3, 6, 4, 7, 3, 8, 4, 9, 3, 10, 4], end: 5
    - 세 번째 api 요청, start: 5(이전의 끝 값), waypoints = [5, 6, 7, 5, 8, 6, 9, 5, 10, 6, 7, 8, 9, 7, 10], end: 8
    - 네 번째 api 요청, start: 8(이전의 끝 값), waypoints = [9], end: 10
- 추천 장소들을 {숫자 : 장소 DTO}의 Map으로 매핑하여 위 순서대로 API에 넣어줍니다.

```java
private int[][] computeDistanceMatrix(List<PlaceDTO> places) {
        Map<Integer, PlaceDTO> placeMap = getPlaceMap(places);
        List<Integer> sequences = getApiSequence(places.size());
        int[][] distanceMatrix = new int[places.size()][places.size()];

        log.debug("순서");
        StringBuilder sb = new StringBuilder();
        for(int i : sequences){
            sb.append(i).append(" ");
        }
        log.debug(sb.toString());

        final int MAX_WAYPOINTS = 15;  // Naver API 제한
        
        for (int i = 1; i < sequences.size(); i += MAX_WAYPOINTS + 1){
            // 각 노드에 대한 인덱스 가져오기
            int start = sequences.get(i - 1);
            int end_num = i + MAX_WAYPOINTS;
            if (end_num >= sequences.size()){
                end_num = sequences.size() - 1;
            }
            int end = sequences.get(end_num);

            List<Integer> waypoints = sequences.subList(i, end_num);

            // 각 노드에 대한 정보를 가져오기
            PlaceDTO startPlace = placeMap.get(start);
            PlaceDTO endPlace = placeMap.get(end);
            List<PlaceDTO> waypointsList = new ArrayList<>();

            for (int waypoint : waypoints) {
                waypointsList.add(placeMap.get(waypoint));
            }

            // 이번 API 호출에 대한 순서 따로 만들기
            List<Integer> sequence = new ArrayList<>();
            sequence.add(start);
            sequence.addAll(waypoints);
            sequence.add(end);

            // API 요청
            Map<String, Object> response = getDistanceBetweenPlaces(startPlace, endPlace, waypointsList);
            
            // 2차원 배열에 업데이트
            updateDistanceMatrix(distanceMatrix, sequence, response);
        }

        // 2차원 배열 출력해보기
        printDistanceMatrix(distanceMatrix, places);
        
        return distanceMatrix;
    }
```

#### 3. API 요청하기
- 이후 이 리스트로 네이버 API를 요청합니다.

```java
private Map<String, Object> getDistanceBetweenPlaces(PlaceDTO place1, PlaceDTO place2, List<PlaceDTO> waypoints) {
    // DTO 리스트를 위경도 데이터로 변환
    String start = place1.getLongitude() + "," + place1.getLatitude();
    String goal = place2.getLongitude() + "," + place2.getLatitude();
    StringBuilder waypointsParam = new StringBuilder();

    for (PlaceDTO waypoint : waypoints) {
        waypointsParam.append(waypoint.getLongitude()).append(",").append(waypoint.getLatitude()).append("|");
    }
    if (!waypointsParam.isEmpty()) {
        waypointsParam.setLength(waypointsParam.length() - 1);  // 마지막 '|' 제거
    }

    String url = "https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving?"
            + "start=" + start
            + "&goal=" + goal
            + "&waypoints=" + waypointsParam
            + "&option=traoptimal";

    HttpHeaders headers = new HttpHeaders();
    headers.set("x-ncp-apigw-api-key-id", naverApiKeyId);
    headers.set("x-ncp-apigw-api-key", naverApiKey);

    HttpEntity<String> entity = new HttpEntity<>(headers);
    RestTemplate restTemplate = new RestTemplate();
    ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

    // api 호출 요청 카운트 용도
    apiRequestCount++;

    return response.getBody();
}
```

#### 4. 2차원 배열 업데이트
- 다음으로 2차원 배열 업데이트해줍니다.

```java
private void updateDistanceMatrix(int[][] distanceMatrix, List<Integer> sequence, Map<String, Object> response) {
        // 응답 데이터 꺼내오기
        Map<String, Object> route = ((List<Map<String, Object>>) ((Map<String, Object>) response.get("route")).get("traoptimal")).get(0);
        Map<String, Object> summary = (Map<String, Object>) route.get("summary");
        List<Map<String, Object>> waypoints = (List<Map<String, Object>>) summary.get("waypoints");
        Map<String, Object> goal = (Map<String, Object>) summary.get("goal");

        // 현재 API 경유지의 순서 출력
        log.debug("순서");
        StringBuilder sb = new StringBuilder();
        for (int num : sequence){
            sb.append(num).append(" ");
        }
        log.debug(sb.toString());
        log.debug("Sequence size: {}, Waypoints size: {}", sequence.size(), waypoints.size());

        // waypoints의 duration 처리
        for (int i = 0; i < sequence.size() - 2; i++) {
            int from = sequence.get(i) - 1;
            int to = sequence.get(i + 1) - 1;

            int duration = ((Number) waypoints.get(i).get("duration")).intValue() / 1000; // 밀리초 -> 초

            distanceMatrix[from][to] = duration;
            distanceMatrix[to][from] = duration;

            log.debug("Updated matrix: {} -> {}: {}ms", from + 1, to + 1, duration);
        }

        // goal의 duration 처리 (마지막 목적지의 소요 시간을 꺼내는 방법이 달라서 따로 처리)
        int from = sequence.get(sequence.size() - 2) - 1;
        int to = sequence.get(sequence.size() - 1) - 1;

        int duration = ((Number) goal.get("duration")).intValue() / 1000; // 밀리초 -> 초

        distanceMatrix[from][to] = duration;
        distanceMatrix[to][from] = duration;

        log.debug("Updated matrix: {} -> {}: {}ms", from + 1, to + 1, duration);
    }
```

- 총 장소 방문 순서와 순서를 파싱하는 것이 잘 되는 것을 확인합니다.

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/761f8bff-03b2-4445-93e1-06f95d9bd8f2">

- 2차원 배열에 거리가 잘 저장 되는 것을 확인합니다.

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/4041f159-a1c6-4723-8ff8-84b452820a55">

- 이전 테스트와 동일하게 장소를 20개 넣어서 성능 확인합니다.

<img width="1664" alt="image" src="https://github.com/user-attachments/assets/08b243a7-90c7-4f0e-8727-d19f8fa208e2">

- API 요청 14번에 57초가 소요되는 것을 확인했습니다.

<img width="1779" alt="image" src="https://github.com/user-attachments/assets/38685f49-0233-4247-b66a-992433b0ca59">

# 정리
- 20개의 장소를 불러왔을 떄 처음 API 호출 420번에서 210번 -> 110번 -> 14번까지 줄였습니다.
- 네이버 API가 느리기도 하고 경유지를 추가할수록 API 응답 시간이 느려져 성능적인 이점은 크게 없지만 네이버 API 무료 호출 횟수가 하루에 6000번, 한 달에 60000번인 것을 고려하면 시간을 들여 API 호출 횟수를 줄인  것이 좋은 노력이었다고 생각합니다.
- 이제 이를 이용해서 알고리즘으로 경로 최적화를 진행해보겠습니다.

## 머리박기의 흔적들..

<img width="988" alt="image" src="https://github.com/user-attachments/assets/115e0058-560b-49a6-a33c-c28aceca02b1">