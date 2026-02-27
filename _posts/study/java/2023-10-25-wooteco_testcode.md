---
layout: post
title: 우테코 프리코스 테스트 코드 뜯어보기🔨
subtitle: 우테코 프리코스 테스트 코드 뜯어보기🔨
date: '2023-10-25 10:45:51 +0900'
categories:
    - study
    - java
tags: []
comments: true
published: true
list: true
---

# 우테코 프리코스 테스트 코드 뜯어보기🔨

# TestCode의 필요성

- 저는 우아한 테크코스 프리코스의 1주차 과제 숫자 야구 게임을 수행하며 숫자 야구 게임의 실행은 잘 되는데 테스트 코드에서 오류를 발생하는 것을 보며 테스트 코드의 중요성을 새삼 느끼게 되었습니다!
- 그래서 저도 좋은 테스트 코드를 만들어보고자 우테코 프리코스에서 기본으로 제공해주신 테스트 코드를 분석하여 저만의 테스트 코드를 만들어 보고자 합니다 !!

# ApplicationTest 뜯어보기🔨

## NsTest 뜯어보기🔨

- 우선 이 클래스의 선언문부터 보면 NsTest를 상속받고 있습니다.
    
    ```java
    class AdditionalTest extends NsTest
    ```
    
- 그렇다면 이 NsTest라는 것을 알아봅시다!
- NsTest는 abstract로 클래스가 정의되어있고 2개의 필드와 7개의 메소드가 선언되어 있는 것을 확인할 수 있었습니다.
    
    ```java
    public abstract class NsTest {
        private PrintStream standardOut;
        private OutputStream captor;
    		@BeforeEach
        protected final void init() {...}
    		@AfterEach
        protected final void printOutput() {...}
    		protected final String output() {return captor.toString().trim();}
    		protected final void run(final String... args) {...}
    		protected final void runException(final String... args) {...}
    		private void command(final String... args) {...}
    		protected abstract void runMain();
    ```
    
    - 우선 클래스가 abstract로 선언되어 있으니 클래스 내부에 추상 메소드가 있다는 걸 유추할 수 있고 객체를 생성할 수 없다는 점을 알 수 있네요!
        - (사실 어제 head first java를 보면서 추상클래스에 대해 공부했었는데 여기서 보니 반갑네요..)
    - 그리고 필드로는 private 형태로 PrintStream, OutputStream 타입으로 선언이 되어있습니다!
    - 아래에는 “@BeforeEach”라는 친구가 있는데 이건 뭘까요..
        - 현재 클래스의 메소드들보다 먼저 메소드가 실행되어야 함을 의미한다고 합니다!
        - 여러 개의 @BeforeEach 메소드를 만들 수 있지만 실행 순서는 보장되지 않으니 순서가 필요한 경우에는 @Order 어노테이션을 사용해 순서를 지정해줘야 한다고 합니다!!
        - @BeforeEach의 클래스는 아래와 같이 되어있네요
            
            ```java
            @Target({ ElementType.ANNOTATION_TYPE, ElementType.METHOD })
            @Retention(RetentionPolicy.RUNTIME)
            @Documented
            @API(status = STABLE, since = "5.0")
            public @interface BeforeEach {
            }
            ```
            
            - 이 부분들까지 들어가면 Test코드를 뜯기도 전에 머리가 뜯길거같으니 미래의 저에게 공부를 맡기겠습니다..
    - 그렇다면 AfterEach는 무엇일까요??
    - BeforeEach와는 반대로 테스트 클래스에 있는 메소드를 모두 실행하고 그 후에 한 번만 실행된다고 합니다!
    - 그러면 우선 BeforeEach의 메소드를 봅시다..

### BeforeEach

```java
@BeforeEach
    protected final void init() {
        standardOut = System.out;
        captor = new ByteArrayOutputStream();
        System.setOut(new PrintStream(captor));
    }
```

- 우선 메소드는 protected final로 선언되어있어 같은 패키지의 클래스나 자식 클래스에게만 접근을 허용하고 오버라이드 할 수 없다는 것을 알 수 있네요!
- 그리고 메소드 내부를 보면 standardOut은 System.out으로 초기화 되어있고
- captor는 바이트 배열에 데이터를 입출력하는데 사용되는 스트림인 ByteArrayOutputStream으로 초기화가 되었습니다!
- 그리고 출력 장소를 다른 곳으로 변경해주는 System.setOut메소드에 captor를 생성자 매개변수로 전달하는 new PrintStream(captor)를 인자로 전달하고 있네요!
- 이러한 선언들을 보아 init()메소드는 이 클래스가 실행되기 전 변수들을 초기화해주고 다른 메소드들은 실행할 준비를 해주는 메소드인 것 같습니다!
- 그 다음으로는 AfterEach가 선언되어있는 printOutput()메소드를 보도록 하겠습니다!

### AfterEach

```java
@AfterEach
    protected final void printOutput() {
        System.setOut(standardOut);
        System.out.println(output());
    }
```

- 우선 이 위 메소드같이 protected final로 선언되어있어 같은 패키지의 클래스나 자식 클래스에게만 접근을 허용하고 오버라이드 할 수 없다는 것을 알 수 있네요!
- 그리고 내부를 보면 위에서 설명한 System.setOut을 통해 출력 장소를 standardOut 즉, System.out으로 넘거주고 있습니다.
- 그리고 output()메소드를 출력해주고 있네요.
- 그러면 이 output()메소드는 어떻게 구성되어있을까요?

### ouput()

```java
protected final String output() {
        return captor.toString().trim();
    }
```

- 우선 이 메소드도 protected final로 선언되어있어 같은 패키지의 클래스나 자식 클래스에게만 접근을 허용하고 오버라이드 할 수 없겠네요..
- 이 메소드는 cator의 toString()메소드를 trim()메소드를 통해 양쪽 끝 공백을 제거하고 반환해주는 메소드이네요!
- 그렇다면 printOutput()메소드에서 System.out.println(output())로 출력해준 것은 captor의 toString()메소드이겠네요

### run과 runExeption

```java
 		protected final void run(final String... args) {
        try {
            command(args);
            runMain();
        } finally {
            Console.close();
        }
    }

		protected final void runException(final String... args) {
        try {
            run(args);
        } catch (final NoSuchElementException ignore) {
        }
    }
```

- 이번에는 run메소드와 runExeption을 알아봅시다
- 둘 다 protected final로 선언되어있어 같은 패키지의 클래스나 자식 클래스에게만 접근을 허용하고 오버라이드 할 수 없다는 것을 알 수 있습니다!
- 그리고 둘 다 매개변수로 final String… args를 받고 있는데 final은 변경할 수 없다는 뜻이겠고 String…은 String 타입의 매개변수를 받기는 한데 몇개를 받을지 모르겠을 때 사용한다고 합니다! 결과적으로 String타입의 매개변수를 여러 개 받을 수 있겠죠?
    - 엥 그러면 String배열로 받아진다는 얘기일까요? 한번 사용해봅시다.
        
        ```java
        public static void minje(String... s){
            System.out.println(Arrays.toString(s));
        }
        
        public static void main(String[] args) {
            minje("kim","min","je");
        }
        }
        =>[kim, min, je]
        ```
        
        - System.out.println(s);를 사용해 출력하려고 했더니 “Implicit call to 'toString()' on array 's’”라는 에러를 띄우며 toString을 사용하라고 하네요
        - 아무튼 위 확인 테스트로 String…는 Array타입으로 전달되는 것을 확인했네요!
- 그럼 본론으로 돌아가 위 run메소드는 command라는 메소드에 String배열 타입인 args 변수를 인자로 전달하고 runMain();메소드를 실행시키고 이게 예외가 발생하던말던 Console을 close하는 메소드라고 해석할 수 있습니다!
- 그렇다면 runException메소드는 어떨까요?
- runException메소드내부를 보면 try문에는 run 메소드에 (args)를 인자로 주어 실행시키고 catch문을 통해 NoSuchElementException 에러는 무시한다고 하네요

### command

```java
private void command(final String... args) {
        final byte[] buf = String.join("\n", args).getBytes();
        System.setIn(new ByteArrayInputStream(buf));
    }
```

- command 메소드도 위와 동일하게 같은 패키지의 클래스나 자식 클래스에게만 접근을 허용하고 오버라이드 할 수 없으며 String배열을 매개변수로 전달받고 있네요.
- 메소드 내부를 보면 우선 변경 불가능한 buf라는 변수에 byte 배열로 args를 “\n”을 배열 요소 사이에 삽입하여 String으로 join해준 뒤 문자열 하나하나를 byte로 변환하여 배열로 넣어줍니다.
    - 말로는 조금 설명이 어려우니 코드로 확인해 봅시다!
    
    ```java
    static void runException(final String... args) {
        for(String i : args){
            System.out.println(i);
        }
        final byte[] buf = String.join("\n", args).getBytes();
        for(int i : buf){
            System.out.println(i);
        }
    }
    public static void main(String[] args) {
        runException("kim", "min", "je");
    }
    =>kim
    min
    je
    107
    105
    109
    10
    109
    105
    110
    10
    106
    101
    ```
    
    - 이와 같이 문자열을 쪼개서 \n을 넣어준뒤 바이트 형태로 변환해준 것을 볼 수 있습니다!
    - 위 코드를 보면 k=107, i=105, m=109, \n=10 정도의 기본 바이트 수까지 알 수 있겠네요!
- 그리고 System.setIn()메소드로 "표준" 입력 스트림을 ByteArrayInputStream(buf)으로 재할당합니다!.

### runMain()

```java
protected abstract void runMain();
```

- 마지막으로 runMain메소드가 있는데 클래스가 추상 클래스로 선언된 이유가 이 메소드 한 개 때문이었네요
- NsTest클래스를 상속받을때는 runMain메소드를 꼭 구현해줘야합니다!
- 자 이정도로 NsTest의 클래스 뜯어보기는 다 했네요 그런데 알고계셨나요? 오늘의 메인은 NsTest가 아니었습니다👏👏👏👏
- 자 이제 그러면 본격적으로 ApplicationTest 클래스를 뜯어봅시다!

## ApplicationTest 뜯어보기🔨

- 우선 ApplicationTest의 구성부터 살펴봅시다.

```java
class ApplicationTest extends NsTest {
		@Test
    void 게임종료_후_재시작() {...}
		@Test
    void 예외_테스트() {...}
		@Override
    public void runMain() {...}
```

- ApplicationTest는 총 3개의 메소드로 구성되어있습니다!
- 이 중 한개는 너무 낯이 익는데 다른 친구들에게는 미안하지만 반가우니 낯익은 runMain메소드부터 살펴봅시다!

### runMain

```java
@Override
public void runMain() {
    Application.main(new String[]{});
}
```

- NsTest를 뜯어볼때 추상 메소드로 선언되어 꼭 오버라이드 해줘야한다했던 runMain메소드입니다.
- 메소드 내부는 너무 간단한대요. Application클래스의 main메소드에 String배열 생성자를 전달해주네요!
- 그 다음은 게임종료_후_재시작()메소드를 살펴보겠습니다!

### 게임종료_후_재시작()

```java
@Test
void 게임종료_후_재시작() {
    assertRandomNumberInRangeTest(
            () -> {
                run("246", "135", "1", "597", "589", "2");
                assertThat(output()).contains("낫싱", "3스트라이크", "1볼 1스트라이크", "3스트라이크", "게임 종료");
            },
            1, 3, 5, 5, 8, 9
    );
}
```

- 우선 @Test라는 것을 통해 테스트 메소드라는 것을 선언해주는데 이를 어노테이션이라 합니다! 위의 @BeforeEach, @AfterEach, @Override같은 친구들도 어노테이션입니다!
- 이 메소드를 보면 assertRandomNumberInRangeTest()메소드를 실행시켜주는 메소드인데요. 어떤 인자를 전달해주는지는 조금 이따 보는걸로 하고 assertRandomNumberInRangeTest메소드를 한번 보도록 합시다!

### assertRandomNumberInRangeTest()

```java
public static void assertRandomNumberInRangeTest(
    final Executable executable,
    final Integer value,
    final Integer... values
) {
    assertRandomTest(
        () -> Randoms.pickNumberInRange(anyInt(), anyInt()),
        executable,
        value,
        values
    );
}
```

- assertRandomNumberInRangeTest메소드는 변경할 수 없는 변수 executable, value, values를 선언하고 assertRandomTest()메소드를 실행시켜주네요 그럼 assertRandomTest메소드를 한번 살펴봅시다…..

### assertRandomTest

```java
private static <T> void assertRandomTest(
        final Verification verification,
        final Executable executable,
        final T value,
        final T... values
    ) {
        assertTimeoutPreemptively(RANDOM_TEST_TIMEOUT, () -> {
            try (final MockedStatic<Randoms> mock = mockStatic(Randoms.class)) {
                mock.when(verification).thenReturn(value, Arrays.stream(values).toArray());
                executable.execute();
            }
        });
    }
```

- 이 메소드도 assertTimeoutPreemptively메소드를 실행해주는 메소드였네요..
- 안으로 계속 들어가면 너무 많은 연결 메소드들이 있어서 여기서 알아보도록합시다!
- 안쪽의 변수와 메소드를 살펴봅시다.
- 우선 Verification타입으로 지정된 verification은 MockedStatic.java에 위치한 interface이라고 합니다!
    - Mockito 인터페이스는 테스트 코드를 작성하는데 자주 사용되는 테스트 프레임워크입니다.

[Mokito란…](https://www.notion.so/Mokito-7f66d094fa814a57bb31b478757650ad?pvs=21)

- 그리고 Executable 타입으로 선언된 executable은  설명을 보면 “Executable is a functional interface that can be used to implement any generic block of code that potentially throws a Throwable.”. “Executable은 잠재적으로 Throwable을 발생시키는 일반 코드 블록을 구현하는 데 사용할 수 있는 기능적 인터페이스입니다.” 라고 합니다! 말그대로 해석할 수 있겠네요
- 그리고 제네릭 타입 변수 value와 위에서 공부했던 제네릭 타입의 변수의 갯수를 가변적으로 받을 수 있는 values라는 변수가 있습니다.

```java
assertTimeoutPreemptively(RANDOM_TEST_TIMEOUT() -> {})
```

- 위 코드는 우선 API의 설명을 보면 “Assert that execution of the supplied executable completes before the given timeout is exceeded.”, 주어진 시간 제한이 초과되기 전에 제공된 실행 파일의 실행이 완료되는지 확인하는 메소드라고 합니다. 해당 메서드는 RANDOM_TEST_TIMEOUT시간 안에 수행을 마쳐야한다는 뜻이고 올라가보면

```java
private static final Duration *RANDOM_TEST_TIMEOUT* = Duration.*ofSeconds*(10L);
```

- 위와 같이 Duration.*ofSeconds*(10L); 즉 10초로 선언되어있어 assertTimeoutPreemptively메소드는 10초안에 파일의 실행이 완료되어야한다! 라는 코드겠네요

```java
try (final MockedStatic<Randoms> mock = mockStatic(Randoms.class))
```

- 그리고 위 코드는 Randoms 클래스의 MockedStatic객체를 생성한다는 뜻이고 예외처리를 해주는 코드이고

```java
mock.when(verification).thenReturn(value, Arrays.stream(values).toArray());
```

- 이 코드는 mock이 객체의 반환을 가로채고 verification의 method들을 시행하며 첫 번째 반환값으로 value, 그 다음에는 values의 값들을 하나씩 반환한다는 뜻입니다. 이 말은 아래의 게임종료_후_시작()메소드를 보면 더 잘 이해가 될 겁니다1
    - thenReturn
        - Params : value – first return value
        - values – next return values
    - 라고 API에 설명되어 있습니다!
- 그리고 executable.execute()메소드로 테스트를 실행시켜주고있네요
- 정리해보면 위 메소드는 assertTimeoutPreemptively를 사용하여 10초 내에 테스트가 완료되지 않으면 테스트를 종료합니다. 그리고  MockedStatic 객체를 사용하여 Randoms 클래스를 Mock화하여 Randoms 클래스의 메서드를 호출하면 Mock 객체의 동작을 반환하도록 합니다. 마지막으로 Mock 객체를 사용하여 verification을 호출하면 value 및 values를 반환하도록 설정합니다.
- 그럼 다시 assertRandomNumberInRangeTest메소드로 돌아가봅시다

### assertRandomNumberInRangeTest 다시보기

```java
public static void assertRandomNumberInRangeTest(
    final Executable executable,
    final Integer value,
    final Integer... values
) {
    assertRandomTest(
        () -> Randoms.pickNumberInRange(anyInt(), anyInt()),
        executable,
        value,
        values
    );
}
```

- 위에서 우리는 assertRandomTest가 (verification, executable, value, values)의 네 개의 매개변수를 받는 것을 확인할 수 있었습니다.
- 위에서 assertRandomTest메소드를 사용할 때도 차례차례 인자를 전달해주는데 verification을 제외한 나머지 변수들은 자신이 매개변수로 받은 것을 차례차례 넣어주는 것을 볼 수 있습니다. verification 인자는 람다 함수를 써서 Randoms 클래스의 pickNumberInRange(anyInt(), anyInt())메소드의 결과를 전달해주고 있습니다.
- 이제 다시 게임종료_후_재시작() 메소드를 살펴봅시다..

### 게임종료_후_재시작() 진짜 알아보기

```java
void 게임종료_후_재시작() {
    assertRandomNumberInRangeTest(
            () -> {
                run("246", "135", "1", "597", "589", "2");
                assertThat(output()).contains("낫싱", "3스트라이크", "1볼 1스트라이크", "3스트라이크", "게임 종료");
            },
            1, 3, 5, 5, 8, 9
    );
}
```

- 사실 이 메소드를 뜯어보기 위해 정말 많은 길을 돌아서 왔네요..
- 하지만 이 메소드의 내부 구성을 거의 다 알아놨기 때문에 이제 쉽게 코드를 해석할 수 있겠네요!
- 기억나실지 모르겠지만 assertRandomNumberInRangeTest()메소드는 exacutable, value, values를 매개 변수로 받아들여서 그 값들을 Randoms.pickNumberInRange(anyInt(), anyInt())와 함께 assertRandomTest()메소드에 넣어주는 메소드였죠!
- executable 매개변수로는
    
    ```java
    () -> {
           run("246", "135", "1", "597", "589", "2");
           assertThat(output()).contains("낫싱", "3스트라이크", "1볼 1스트라이크", "3스트라이크", "게임 종료");
          },
    ```
    
- 위의 값을 넣어주고 있는데요.
- 위에서 공부한 run()메소드는 스트링 배열을 매개 변수로 받아 command()메소드에 인자로 전달하여 실행해주고 command()메소드는 그 스트링 배열을 받아 바이트배열로 바꿔줘서 콘솔에 입력되는 것처럼 만들어준 뒤 runMain()메소드를 실행하는 메소드였습니다.
- 그리고 assertThat(output()).contains()를 통해 출력 결과가 "낫싱", "3스트라이크", "1볼 1스트라이크", "3스트라이크", "게임 종료"를 포함하는지를 확인하고 있네요
- 그리고 그 아래 value에는 1, values에는 3,5,5,8,9를 넣어 인자로 전달해주고 있습니다!

### 게임종료_후_재시작() 구현 논리

- 이 메소드는 assertRandomNumberInRangeTest()에 인자로 executable에 player의 값을 전달하고 출력값을 비교하여 반환하는 메소드, value에 1, values에는 3,5,5,8,9을 전달하여 assertRandomTest메소드에서 mock이 Randoms.*pickNumberInRange*(*anyInt*(), ())의 반환 값을 가로채어 value와 values인 135, 589를 차례로 반환하고 이에 대한 비교로 run에 246을 넣으면 “낫싱”, 135는 3스트라이크, 1을 넣으면 재시작, 597을 넣으면 1볼 1스트라이크, 589를 넣으면 3스트라이크, 2를 넣어서 게임종료가 되는 것을 체크하는 메소드라고 코린이의 짧은 식견으로 한 번 생각해봤습니다!
- 제가 위에서 공부한 내용을 바탕으로 분석한 생각이기 때문에 틀린 점은 많은 지적 부탁드립니다…
- 그러면 아래의 예외처리를 보겠습니다!

### 예외_테스트 알아보기

```java
@Test
    void 예외_테스트() {
        assertSimpleTest(() ->
                assertThatThrownBy(() -> runException("1234"))
                        .isInstanceOf(IllegalArgumentException.class)
        );
    }
```

- 우선 이 메소드는 assertSimpleTest에 인자를 주는 용도로 사용하고 있네요. assertSimpleTest를 먼저 봅시다.

```java
private static final Duration SIMPLE_TEST_TIMEOUT = Duration.ofSeconds(1L);
public static void assertSimpleTest(final Executable executable) {
        assertTimeoutPreemptively(SIMPLE_TEST_TIMEOUT, executable);
    }
```

- 엇 근데 반가운 메소드가 보이네요. assertTimeoutPreemptively는 저희가 위에서 공부했던 주어진 시간제한 내에 제공된 실행파일이 완료되어야한다는 메소드였습니다.
- 이 클래스에서 SIMPLE_TEST_TIMEOUT=1초이니 1초안에 실행되어야한다는 뜻이겠네요
- 그럼 이 assertSimpleTest()메소드에 매개변수로 주어진 값을 봅시다!

```java
() -> assertThatThrownBy(() -> runException("1234"))
      .isInstanceOf(IllegalArgumentException.class)
```

- 우선 assertThatThrownBy에 대해서 알아보도록 할까요??
    - assertThatThrownBy의 API설명으로는 “If the provided ThrowableAssert.ThrowingCallable does not raise an exception, an error is immediately thrown, in that case the test description provided with as(String, Object...) is not honored.”
        
        → 주어진 메소드 실행에 대한 반환값이 예외를 발생시키지 않으면 오류를 발생한다고 합니다.
        
- 그리고 위에서 공부했던 runException()메소드는 주어진 인자를 run()에 전달하여 실행하고 “NoSuchElementException” 예외가 나도 무시하는 메소드였습니다.
- isInstanceOf(IllegalArgumentException.class)는 assertThatThrownBy가 반환하는 값이 IllegalArgumentException인지 확인하는 코드입니다!
- 그래서 결론적으로 정리해보면 이 코드는 runExecption에 “1234”를 주어 프로그램을 실행시켰을 때 IllegalArgumentException를 반환하는지 확인하는 테스트이겠네요!

## 회고

- 이번 테스트 코드 뜯어보기는 제 짧은 자바 공부에 있어 가장 어려웠던 부분이었던 것 같은데요! 그만큼 알게된 점도 많고 깨달은 부분도 많아서 제 실력 향상에 큰 도움이 된 것을 느낍니다! 사실 자바 언어만 공부할 때는 “어차피 이런 메소드들은 너무 많으니 필요할 때마다 찾아보면 되지” 라는 생각이었는데요 코드를 하나하나 분석해보고 공부해보고나니 제 코드를 보는 눈과 코드 독해력, 찾아보는 검색 능력 등 많은 부분에서 너무나 큰 도움이 되고 있는 것 같아서 왜 진작 하지 않았나..하는 생각이 많이 드는 것 같습니다.
- 정말 많은 어려움이 있었지만 공부하고 나니 뿌듯한 마음이 크고 사실 이렇게 한 번 공부한걸로 지식이 제 것이 될리가 없으니 꾸준히 다시 보며 수정 및 보완을 해보려 합니다!