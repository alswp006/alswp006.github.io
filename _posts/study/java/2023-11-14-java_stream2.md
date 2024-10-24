---
layout: post
title: for문에 Stream을 적용해보자!👊
subtitle: for문에 Stream을 적용해보자!👊
date: '2023-11-14 10:45:51 +0900'
categories:
    - study
    - java
tags:
    - AnomalyDetection
comments: true
published: true
list: true
---

# for문에 Stream을 적용해보자!👊

- 앞서 Stream을 공부하였으니 이제는 적용을 해보도록 하겠습니다!
- 앞서 Stream을 공부한 기록은 여기 있습니다!👇
	[Stream을 부숴보자👊](https://velog.io/@alswp006/Stream%EC%9D%84-%EB%B6%80%EC%88%B4%EB%B3%B4%EC%9E%90)

# Stream 적용해보기

### EnumMap의 요소 초기화

```java
for (Winning winning : Winning.values()) {
            result.put(winning, 0);
        }
```

- 변경 후

```java
Arrays.stream(Winning.values())
                .forEach(value -> result.put(value, 0));
```

- stream의 첫 사용이 아주 뿌듯합니다!!!

### string을 int로 변환가능하다면 변환해서 list로 만들어주는 메소드

```java
public List<Integer> stringToList(String input) throws IllegalArgumentException {
    List<Integer> player = new ArrayList<>();
    String[] numbers = input.split(",");

    for (String number : numbers) {
        int playerNumber = inputToInt(number);
        player.add(playerNumber);
    }

    return player;
}
```

- 변경 후

```java
public List<Integer> stringToList(String input) throws IllegalArgumentException {
        return Arrays.stream(input.split(","))
                .map(this::inputToInt)
                .collect(Collectors.toList());
    }
```

- 우선 input을 “,”로 잘라 Stream<String>으로 만들어줍니다.
- 그리고 현재 객체의 inputToInt메소드를 통해 Stream<Integer>로 매핑해줍니다.
- 그리고 List로 반환해줍니다.
- 이번 코드는 꽤나 간결하게 잘 만든 것 같습니다!
- 이번 코드를 만들면서는 꽤나 고생을 했는데 만들고 나니 너무 쉬워보여서 어이가 살짝 없는 느낌입니다…
- 원래의 코드는 input을 잘라서 String[]에 넣고 유효성 검사를 하여 List에 추가해준 뒤 List를 반환해주었습니다.
- 바뀐 코드는 input을 잘라서 Stream<String>에 넣고 유효성 검사를 하여 Stream<Integer>에 넣어준 뒤 List로 반환해주었습니다!

### 당첨 통계를 출력하는 메소드

```java
public void printResult(int purchasePrice) {
    int totalPrice = 0;
    System.out.println("\n" + PrintOutput.RESURLT_LOTTO + "\n---");

    for (Winning winning : Winning.values()) {
        totalPrice += winning.getWinningPrice() * result.get(winning);
        printMatch(winning);
    }

    System.out.printf("총 수익률은 %,.1f%%입니다.", (double) totalPrice / purchasePrice * 100);
}
```

- 여기서 for 문을 Arrays.stream으로 바꾸고 싶은데 아직은 도저히 방법이 생각나지 않습니다..

### 일치 갯수와 보너스 볼을 이용한 당첨 등수 반환 메소드

```java
public static Winning result(int matchNumber, int checkBonusBall){
    if (matchNumber == SECOND.matchNumber && checkBonusBall == SECOND.checkBonusBall){
        return SECOND;
    }
    for (Winning winning : values()){
        if (winning.matchNumber == matchNumber){
            return winning;
        }
    }
    return No_Match;
}
```

- 변경 후

```java
public static Winning result(int matchNumber, int checkBonusBall){
    if (matchNumber == SECOND.matchNumber && checkBonusBall == SECOND.checkBonusBall){
        return SECOND;
    }

    return Arrays.stream(Winning.values())
            .filter(winning -> winning.matchNumber == matchNumber)
            .findAny()
            .orElse(No_Match);
}
```

### 당첨 번호와 사용자의 로또 번호, 보너스 볼을 비교하는 메소드

```java
private void matchResult(List<Lotto> randomLottoNumbers, int bonusNumber) {
    for (Lotto userLottoNumbers : randomLottoNumbers) {
        int[] matchNumber = winningNumbers.matchNumber(userLottoNumbers, bonusNumber);

        winningData.winningResult(matchNumber[0], matchNumber[1]);
    }
}
```

- 우선 userLottoNumbers를 Stream<Lotto>로 만들어주고 int배열로 mapping…?

### 정수 List를 받아 1~45까지 수인지 검사

```java
private void number_check(List<Integer> numbers) {
    for (Integer number : numbers) {
        if (number < MIN_NUMBER || number > MAX_NUMBER) {
            System.out.println("[ERROR] 로또 번호 1부터 45까지의 수로 입력해주세요.\n");
            throw new IllegalArgumentException();
        }
    }
}
```

- 우선 stream에서 sout을 사용하는 방법과 예외를 던지는 방법을 찾아보자..

### 입력 받은 번호와 보너스 볼에 대해 일치하는 결과 반환

```java
public int[] matchNumber(Lotto lottoNumbers, int bonusBall){
    int[] matchResult = new int[]{0,0};

    for (int number : lottoNumbers.numbers){
        if (numbers.contains(number)){
            matchResult[0] += 1;
        }
    }
    if (lottoNumbers.numbers.contains(bonusBall)){
        matchResult[1] = 1;
    }

    return matchResult;
}
```

- lottoNumbers.numbers를 stream으로 바꿔서 filter로 조건을 주고 count로 matchResult[0]에 저장
- 변경 후

```java
matchResult[0] = (int) lottoNumbers.numbers.stream()
        .filter(number -> numbers.contains(number))
        .count();
```

- 위 count의 반환 값이 long으로 반환되어 int로 캐스팅해줬습니다!
- intellij가 numbers.contains(number)를 바꿀 수 있다고 하여 option + enter로 바꿔줬더니 아래와 같은 코드가 되었습니다!

```java
matchResult[0] = (int) lottoNumbers.numbers.stream()
        .filter(numbers::contains)
        .count();
```