---
layout: post
title: StringTokenizer와 StreamTokenizer(feat.StringTokenizer뜯어보기🔨)
subtitle: StringTokenizer와 StreamTokenizer(feat.StringTokenizer뜯어보기🔨)
date: '2023-10-19 10:45:51 +0900'
categories:
    - study
    - java
tags: []
comments: true
published: true
list: true
---

# StringTokenizer와 StreamTokenizer(feat.StringTokenizer뜯어보기🔨)

# 사건 발단의 B15552

- [백준 15552번 문제](https://www.acmicpc.net/problem/15552)를 BufferedReader로 받아 StringTokenizer로 잘라주고 BufferedWriter를 통해 출력해줘서 푼 나는 문제를 맞히고 다른 사람들의 코드를 보다가 신기한 함수를 발견했습니다.
- 바로 StreamTokenizer라는 함수입니다.
- StringTokenizer가 가장 빠른 줄 알았는데 StreamTokenizer를 쓴 코드가 메모리 효율이 6배 수준으로 좋고 속도도 빨랐습니다.
- 우선 저는 BufferedReader, InputStreamReader, StringTokenizer를 통해 받았으므로 더 메모리가 많이 소비된 것일 수도 있지만 시간 효율이 더 안좋다는 것은 정말 이해가 안 가는 것 같습니다..
- 우선 코드를 보겠습니다.

## 문제 풀이 코드

- BufferedReader를 사용

```java
import java.io.*;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));
        int n = Integer.parseInt(br.readLine());

        for (int i = 0; i<n; i++){
            StringTokenizer st = new StringTokenizer(br.readLine());
            int x = Integer.parseInt(st.nextToken());
            int y = Integer.parseInt(st.nextToken());

            bw.write(x+y+"\n");
        }

        bw.flush();
        bw.close();
    }
}
```

- 메모리 : 258212kb, 시간 : 764ms
- StreamTokenizer 사용

```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        StreamTokenizer st = new StreamTokenizer(System.in);
        StringBuilder sb = new StringBuilder();
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));
        st.nextToken();
        int n = (int)st.nval;
        for(int i = 0; i < n; i++) {
            st.nextToken();
            int a = (int)st.nval;
            st.nextToken();
            int b = (int)st.nval;
            sb.append(a + b).append('\n');
        }
        bw.write(sb.toString());
        bw.flush();
        bw.close();
    }
}
```

- 메모리 : 40768kb, 시간 : 472ms
- 위와 같은 측정값이 나왔다.
- 그렇다면 StringTokenizer와 StreamTokenizer의 차이를 알아보겠습니다.

# StringTokenizer와 StreamTokenizer

## StringTokenizer

- 참고 문서
    - [StringTokenizer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html)
- 공식 API를 보면 첫 두 문장이 아래와 같이 나와있는 것을 볼 수 있습니다.
- ‘The string tokenizer class allows an application to break a string into tokens. The tokenization method is much simpler than the one used by the `StreamTokenizer` class. The `StringTokenizer` methods do not distinguish among identifiers, numbers, and quoted strings, nor do they recognize and skip comments.’
    - ‘문자열 토크나이저 클래스를 사용하면 애플리케이션이 문자열을 토큰으로 나눌 수 있습니다. 토큰화 방법은 StreamTokenizer 클래스에서 사용하는 방법보다 훨씬 간단합니다. StringTokenizer 메서드는 식별자, 숫자 및 인용된 문자열을 구별하지 않으며 주석을 인식하고 건너뛰지도 않습니다.’
- 놀랍게도 StringTokenizer의 설명인데 StramTokenizer와 비교하는 설명이 있습니다.
- StreamTokenizer보다 사용방법이 간단하다고 합니다.
- **우선 API의 설명을 정리해보면 문자열을 토큰으로 나누어주는 클래스이고 숫자, 문자 및 인용된 문자열을 구분하지 않으며 토큰을 구분하는 문자는 별도로 지정해줄 수 있는 클래스라고 한다.**
- 그렇다면 StringTokenizer의 매개변수로는 어떤 값을 넣을 수 있는지 알아보겠습니다.

### StringTokenizer의 생성자

- **`[StringTokenizer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#%3Cinit%3E(java.lang.String))**(**[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** str)`
- **`[StringTokenizer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#%3Cinit%3E(java.lang.String,java.lang.String))**(**[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** str, **[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** delim)`
- **`[StringTokenizer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#%3Cinit%3E(java.lang.String,java.lang.String,boolean))**(**[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** str, **[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** delim, boolean returnDelims)`
- StringTokenizer는 이렇게 3개의 생성자가 있습니다.
- 우선 한개씩 알아보겠습니다.
- **`[StringTokenizer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#%3Cinit%3E(java.lang.String))**(**[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** str)`
    - “지정된 문자열에 대한 StringTokenizer를 구성한다. StringTokenizer는 " \t \n \r \f"공백 문자, 탭 문자, 개행 문자, 캐리지 리턴 문자, 용지 공급 문자 등 기본 구분 기호 세트를 사용합니다. 구분 기호 문자 자체는 토큰으로 처리되지 않습니다.”라는 설명이 되어 있습니다.
    - String만 넣어주면 문자열로 토큰을 생성하고 구분자는 공백으로 구분, 구분자는 토큰으로 처리되지 않는다는 말인 것 같습니다.
    - 하지만 프로그래머는 코드로 말하는 법. 한번 직접 사용해보겠습니다!!
    
    ```java
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        while (st.hasMoreTokens()) {
            System.out.println(st.nextToken());
        }
    }
    //입력
    coding is very    hard.but,this,is,very,funny
    //출력
    coding
    is
    very
    hard.but,this,is,very,funny
    ```
    
    - 설명대로 공백으로 구분하여 토큰을 잘라준 것을 볼 수 있습니다. 공백이 아무리 많아도 구분자는 토큰으로 처리되지 않기 때문에 구분자는 다 사라진 것도 확인할 수 있습니다.
    - 그렇다면 이번에는 delim을 사용해보겠습니다.
- **`[StringTokenizer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#%3Cinit%3E(java.lang.String,java.lang.String))**(**[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** str, **[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** delim)`
    - “지정된 문자열에 대한 문자열 토크나이저를 구성합니다. 인수 의 문자는 `delim`토큰을 구분하기 위한 구분 기호입니다. 구분 기호 문자 자체는 토큰으로 처리되지 않습니다.’”라는 설명이 있습니다.
    - delim을 통해 문자열을 구분하는 구분자를 지정해줄 수 있는 것 같습니다.
    - 한번 사용해보겠습니다.
    
    ```java
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine(),",");
        while (st.hasMoreTokens()) {
            System.out.println(st.nextToken());
        }
    }
    //입력
    coding is very    hard.but,this,is,very,funny
    //출력
    coding is very    hard.but
    this
    is
    very
    funny
    ```
    
    - “,”를 구분자로 지정해주었더니 “,”를 기준으로 문자열이 잘린 것을 볼 수 있습니다.
    - 그렇다면 공백과 “,”를 둘 다 구분자로 해줄 수는 없는것일까…..
    - 이것 저것 만져보다가 드디어 찾아냈습니다!
    - 문자열의 “+” 기능을 사용하면 됩니다!!!!👍
    
    ```java
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine()," "+",");
        while (st.hasMoreTokens()) {
            System.out.println(st.nextToken());
        }
    }
    //입력
    coding is very    hard.but,this,is,very,funny
    //출력
    coding
    is
    very
    hard.but
    this
    is
    very
    funny
    ```
    
    - 이건 여러모로 많이 사용할 수 있을 것 같습니다!!
    - 그럼 다음으로 boolean returnDelims까지 사용해보겠습니다.
- **`[StringTokenizer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#%3Cinit%3E(java.lang.String,java.lang.String,boolean))**(**[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** str, **[String](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)** delim, boolean returnDelims)`
    - “플래그 returnDelims가 이면 true구분 기호 문자도 토큰으로 반환됩니다. 각 구분 기호 는 구분 기호의 단일 [유니코드 코드 포인트](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Character.html#unicode)char (1개 또는 2 개일 수 있음)로 구성된 문자열로 반환됩니다. 플래그가 인 경우 false구분 기호 문자는 건너뛰고 토큰 사이의 구분 기호로만 사용됩니다.delimis 인 경우 null이 생성자는 예외를 발생시키지 않습니다. 그러나 결과에 대해 다른 메서드를 호출하려고 StringTokenizer하면 NullPointerException이 발생합니다.”
    - “returnDelims- 구분 기호를 토큰으로 반환할지 여부를 나타내는 플래그입니다.”
    - 위와 같은 설명이 있습니다.
    - 그럼 코드로 말해보겠습니다.
    
    ```java
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine()," "+",", true);
        while (st.hasMoreTokens()) {
            System.out.println(st.nextToken());
        }
    }
    //입력
    coding is,funny
    //출력
    coding
     
    is
    ,
    funny
    ```
    
    - 위와 예제들과 같은 입력을 넣으니 출력이 너무 길어져서 조금 줄였습니다..
    - returnDelims를 true로 해주니 제가 지정한 구분자인 공백과 “,“도 함께 토큰에 들어간 것을 확인할 수 있습니다.
    - 이것도 어딘가 모르게 유용하게 사용할 수 있을 것만 같은 냄새가 납니다…🤔
- 그렇다면 이번에는 StringTokenizer의 메소드들을 한번 살펴보겠습니다.

## StringTokenizer의 메소드

| Modifier and Type | Method | Description |
| --- | --- | --- |
| int | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#countTokens()() | 토큰의 갯수를 int 형태로 반환해준다! |
| boolean | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#hasMoreElements()() | hasMoreTokens 메소드 와 동일한 값을 반환합니다 . (이거 왜 있지..) |
| boolean | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#hasMoreTokens()() | 더 반환할 토큰이 있으면 true, 없으면 false를 반환한다. |
| Object | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#nextElement()() | 다음 토큰을 Object 형태로 반환한다 |
| String | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#nextToken()() | 다음 토큰을 반환한다. |
| String | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringTokenizer.html#nextToken(java.lang.String)(https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html delim) | StringTokenizer의 문자열에서 다음 토큰을 반환합니다. |
- 위와 같은 메소드들이 있습니다.
- 다른 건 다 이해가 되는데 hasMoreTokens()와 hasMoreElements()는 왜 같이 존재하는지 모르겠습니다.
- 내가 모르는 다른 기능이 있는걸까??
- 한번 사용해보자!

```java
public static void main(String[] args) throws IOException {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    StringTokenizer st = new StringTokenizer(br.readLine()," "+",", true);
    System.out.println(st.hasMoreTokens());
    System.out.println(st.hasMoreElements());
}
//입력
kim min je
//출력
true
true
```

- umm… 뭐지…
- 여기저기 뜯어보다가 hasMoreElements()메소드를 보고 찾았습니다.

```java
|Returns the same value as the hasMoreTokens method. 
|It exists so that this class can implement the Enumeration interface.
|Returns : true if there are more tokens; false otherwise.
|See Also : Enumeration, hasMoreTokens()

public boolean hasMoreElements() {
        return hasMoreTokens();
    }
```

- hasMoreElements()는 그냥 내부적으로 hasMoretokens()메소드를 호출하여 반환해주는 기능을 하고 있습니다.
- 그리고 코드의 주석에 “**hasMoreTokens 메소드와 동일한 값을 반환합니다. 이 클래스가 Enumeration 인터페이스를 구현할 수 있도록 존재합니다.”**라는 설명이 있습니다.
- 우선 hasMoreTokens()만 쓰도록 하겠습니다..
- 이렇게 뜯어본 StringTokenizer는 문자열을 slicing할 때 아주 좋은 클래스인 것 같습니다!
- 그렇다면 이번엔 StreamTokenizer에 대해서 알아보겠습니다.

## StreamTokenizer

- 참고문서
    - [StreamTokenizer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html)
- StreamTokenizer의 API 중 첫 줄을 보면 “The `StreamTokenizer` class takes an input stream and parses it into "tokens", allowing the tokens to be read one at a time. The parsing process is controlled by a table and a number of flags that can be set to various states. The stream tokenizer can recognize identifiers, numbers, quoted strings, and various comment styles.”과 같은 설명이 있습니다.
- 이를 해석해보면 “클래스 `StreamTokenizer`는 입력 스트림을 가져와 "토큰"으로 구문 분석하여 토큰을 한 번에 하나씩 읽을 수 있도록 합니다. 구문 분석 프로세스는 테이블과 다양한 상태로 설정할 수 있는 여러 플래그에 의해 제어됩니다. 스트림 토크나이저는 식별자, 숫자, 인용 문자열 및 다양한 주석 스타일을 인식할 수 있습니다.”라고 합니다.
- 그렇다면 StreamTokenizer의 생성자를 통해 어떤 값을 인자로 전달받고 어떤 값을 반환하는지 확인해보겠습니다.

### StreamTokenizer의 생성자

- StreamTokenizer는 한개의 생성자가 있습니다.

```java
public StreamTokenizer(Reader r) {
        this();
        if (r == null) {
            throw new NullPointerException();
        }
        reader = r;
    }
```

- StreamTokenizer의 생성자를 살펴보면 Reader 타입의 매개변수 r을 받아 r이 null이라면 NullPointerException()을 발생, 아니라면 reader에 r값을 넣어줍니다.
- reader는 StreamTokenizer안에 Reader 타입으로 선언되어있는 값입니다.
    
    ```java
    private Reader reader = null;
    ```
    
- API에서의 이 생성자의 설명을 보면 “Create a tokenizer that parses the given character stream.”이라고 설명되어 있습니다.
- 이 문장을 번역해보면 “주어진 문자 스트림을 구문 분석하는 토크나이저를 만듭니다.”라고 합니다.
- 이 생성자는 문자 스트림을 받아서 Tokenizer로 만드는 역할을 한다고 볼 수 있습니다.

### StreamTokenizer의 주요 필드와 메소드

- 필드

| Modifier and Type | Method | Description |
| --- | --- | --- |
| double | nval | 현재 토큰이 숫자인 경우 이 필드에는 해당 숫자의 값이 포함된다 |
| String | sval | 현재 토큰이 단어 토큰인 경우 이 필드에는 단어 토큰의 문자를 제공하는 문자열이 포함된다. |
| int | ttype | 메소드 호출 후 nextToken이 필드에는 방금 읽은 토큰 유형이 포함됩니다. |
- 메소드

| Modifier and Type | Method | Description |
| --- | --- | --- |
| void | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html#lowerCaseMode(boolean)(boolean fl) | 단어 토큰이 자동으로 소문자로 표시되는지 여부를 결정한다. |
| int | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html#nextToken()() | 이 토크나이저의 입력 스트림에서 다음 토큰을 구문 분석한다. |
| void | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html#parseNumbers()() | 이 토크나이저가 숫자를 구문 분석해야 함을 지정한다. |
| void | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html#whitespaceChars(int,int)(int low, int hi) | 범위의 모든 문자 low≤hi를 공백 문자로 지정한다. |
| void | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html#wordChars(int,int)(int low, int hi) | 범위의 모든 문자 low≤hi를 단어 구성요소로 지정합니다. |
| String | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/StreamTokenizer.html#toString()() | 현재 스트림 토큰의 문자열 표현과 그것이 발생하는 줄 번호를 반환한다. |

# 정리

- StringTokenizer와 StreamTokenizer는 각각 String과 Reader를 받는다는 차이가 있고 사용 방법도 다릅니다.
- StringTokenizer의 API 공식문서에서도 “토큰화 방법은 StreamTokenizer 클래스에서 사용하는 방법보다 훨씬 간단합니다”라고 말하는것처럼 StringTokenizer의 사용이 훨씬 편한 것 같습니다.
- 하지만 StreamTokenizer의 메모리나 속도적인 측면을 보면 유용성을 무시 못할거같아서 지속적인 공부가 필요할 것 같습니다.

## 후기
- 사실 StreamTokenizer를 공부하려 했지만 하다보니 StringTokenizer에 대해서 더 자세하게 공부해버린 것 같습니다.(오히려 좋아..?🤔)
- 사실 StreamTokenizer에 대한 정보가 API문서 외에는 찾기가 꽤나 힘들어서 고생했지만 공부하고 나니 굉장히 뿌듯합니다.
- 다른 문제들에서 StreamTokenizer를 사용할 수 있도록 노력해봐야 할 것 같습니다!!