---
layout: post
title: 아직도 공통 응답 포맷을 모르시나요?
subtitle: 아직도 공통 응답 포맷을 모르시나요?
date: '2024-11-10 10:45:51 +0900'
categories:
    - project
    - tradeham
    - study
    - spring
tags:
    - AnomalyDetection
comments: true
published: true
list: true
order: 6
---

# [API 공통 응답 포맷] 아직도 Envelope Pattern만 사용하시나요? ResponseBodyAdvice를 사용해보세요!

안녕하세요!

저번 포스팅에서는 **Envelope Pattern**을 통해 공통 응답 포맷을 만들고 사용해보았습니다.

이러한 **Envelope Pattern**에도 단점은 존재합니다.

그래서 이를 AOP를 통해 제가 생각하는 Best Practice를 만들어보려합니다!

# 기존 방식의 단점

우선 제가 생각하는 기존 방식의 단점은 다음과 같습니다.

## 1. 코드의 중복이 생긴다.

기존의 방식은 다음과 같이 모든 컨트롤러에 반환 타입을 ApiResponse를 붙여주어야 합니다.

<img width="947" alt="image" src="https://github.com/user-attachments/assets/642cae0c-c716-4aac-9293-0c1693fa9fea">

하지만 이 또한 코드의 중복이라는 생각이 들어서 중복을 최대한 피하고 싶습니다.

## 2. 코드의 규약이 추가된다.

기존의 방식은 말 그대로 코드의 규약이 추가됩니다.

기존의 방식을 사용하려면 리턴 타입을 ApiResponse로 반환한다는 규칙이 생기고 신입 개발자가 들어올 때마다 이에 대한 규약을 전해야 합니다.

이러한 규약을 지키지 않은 채 개발하고 배포하는 개발자가 생긴다면 금새 혼란스러워질 것입니다.

이에 대한 전체적인 흐름을 학습해야 하고 시간이 지나서 이를 처음에 개발한 개발자들이 떠난다면 아무 이유 없이 이를 사용하거나 기존 코드에는 이 방식이 적용되어 있고 새로운 코드에는 이 방식이 적용되지 않는 등의 문제가 생길 수 있을 것입니다.

이러한 규약이 생기는 것을 최대한 피하고 싶습니다.

## 3. 테스트 코드에서도 ApiResponse를 고려해주어야 한다.

기존의 방식은 다음과 같이 Controller Test 시에도 ApiResponse를 고려해주어야 합니다.

``` java
@Test
void testGetUser() {
    ApiResponse<UserDto> response = userController.getUser(1L);
    assertTrue(response.isSuccess());
    assertNotNull(response.getData());
    assertEquals("John", response.getData().getName());
}
```

이러한 문제는 혼란을 야기할 수도 있다고 생각합니다.

# ResponseBodyAdvice를 이용한 해결

위와 같은 문제를 해결하기 위해 ResponseBodyAdvice의 구현체를 만들어볼 수 있습니다!

ResponseBodyAdvice는 생성된 응답을 클라이언트로 보내기 전에 응답 본문을 포맷팅하는 역할을 합니다.

이 방법을 진행해보기 전 ResponseBodyAdvice를 먼저 알아보도록 하겠습니다.
## ResponseBodyAdvice 알아보기

ResponseBodyAdvice로 들어가보면 다음과 같은 설명이 있습니다.

<img width="756" alt="image" src="https://github.com/user-attachments/assets/eca6c5e9-afd3-4812-ad3e-a46bf990b736">

> @ResponseBody 또는 ResponseEntity 컨트롤러 메서드의 실행 후, 본문이 HttpMessageConverter로 작성되기 전에 응답을 커스터마이징할 수 있도록 허용합니다. 구현체는 RequestMappingHandlerAdapter 및 ExceptionHandlerExceptionResolver에 직접 등록될 수 있으며, 더 일반적으로는 @ControllerAdvice로 주석이 달린 경우 자동으로 두 곳 모두에 의해 감지됩니다.

말 그대로 컨트롤러 메서드가 반환하는 응답 객체가 HttpMessageConverter로 작성되기 전에 가로채어 원하는 대로 가공할 수 있는 인터페이스입니다!

해당 인터페이스의 메서드까지 보겠습니다.

<img width="872" alt="image" src="https://github.com/user-attachments/assets/1abb7f5f-f32e-4854-8b53-e0e7ad8deda1">

두 가지의 메서드가 있습니다.

#### supports
> 이 구성요소가 주어진 컨트롤러 메서드 반환 타입과 선택된 HttpMessageConverter 타입을 지원하는지 여부

이 메서드는 주어진 컨트롤러 메서드의 반환 타입과 HTTP 메시지 컨버터 타입에 대해 beforeBodyWrite 메서드를 실행할지 여부를 결정하는 메서드입니다.

해당 메서드가 true를 반환하면 beforeBodyWrite가 실행되고 해당 메서드가 false를 반환하면 beforeBodyWrite를 실행하지 않습니다!

저는 이를 이미 ApiResponse로 감싸져있는 응답에 대해 예외 처리를 위해 사용할 수 있을 것 같습니다.

#### beforeBodyWrite
> HttpMessageConverter가 선택되고 그의 write 메서드가 호출되기 직전에 호출됩니다.

응답 본문을 가공할 때 사용하는 메소드입니다!

응답을 ApiResponse로 매핑할 때 사용하면 될 것 같습니다!

이제 ResponseBodyAdvice를 구현해보겠습니다!

## ResponseBodyAdvice 구현해보기



- ApiResponseAdvice 생성

``` java
@RestControllerAdvice
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // ApiResponse로 이미 감싸진 응답은 제외
        return !ApiResponse.class.isAssignableFrom(returnType.getParameterType());
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        return ApiResponse.success(body);
    }
}
```

@RestControllerAdvice 사용하여 성공 응답

컨트롤러의 응답을 자동으로 ApiResponse로 감싸줍니다.

- Controller 수정

기존 코드

``` java
@RestController
public class TestController {

    @GetMapping("/api/success")
    public ApiResponse<String> success() {
        return ApiResponse.success("성공!!");
    }

    @GetMapping("/api/fail")
    public ApiResponse<String> fail() {
        throw new IllegalArgumentException("잘못된 요청입니다.");
    }

    @GetMapping("/api/error")
    public ApiResponse<String> error() {
        throw new RuntimeException("알 수 없는 에러가 발생하였습니다.");
    }
}
```

수정된 코드

``` java
@RestController
public class TestController {

    @GetMapping("/api/success")
    public String success() {
        return "성공!!";
    }

    @GetMapping("/api/fail")
    public String fail() {
        throw new IllegalArgumentException("잘못된 요청입니다.");
    }

    @GetMapping("/api/error")
    public String error() {
        throw new RuntimeException("알 수 없는 에러가 발생하였습니다.");
    }
}
```

하지만 문제가 발생하였습니다.

### String을 반환하지 못하는 에러 발생

저 상태에서 /api/success로 API 요청 시 다음과 같은 에러가 발생하였습니다.

<img width="1171" alt="image" src="https://github.com/user-attachments/assets/17f4fe38-95ad-4413-8492-9242cd1e5dbe">

그래서 혹시 DTO로 객체를 감싸서 요청하면 될까 싶어 다음과 같이 수정해보았습니다.

- Controller의 요청 메소드
``` java
@GetMapping("/api/success")
public Dto success() {
    return new Dto("성공!!");
}
```

- DTO
``` java
@Data
@AllArgsConstructor
public class Dto {
    private final String success;
}
```

<img width="1171" alt="image" src="https://github.com/user-attachments/assets/bb3a88ad-eca9-4205-b820-61dddb4c6039">

다음과 같이 잘 반환하는 것을 확인할 수 있습니다.

혹시나 해서 Long과 원시 타입인 int로도 테스트 해보았습니다.

- Long
``` java
@GetMapping("/api/success")
public Long success() {
    return 1L;
}
```

<img width="1171" alt="image" src="https://github.com/user-attachments/assets/aed88d34-d20e-425f-a24d-3bef2e5789d5">

- int
``` java
@GetMapping("/api/success")
public int success() {
    return 1;
}
```
<img width="1171" alt="image" src="https://github.com/user-attachments/assets/aa521d06-7a41-4755-baec-ecdc7478ca61">

String 이외의 타입으로는 모두 성공하는 것을 확인할 수 있었습니다.

StringHttpMessageConverter의 문제가 발생하는 것 같은 의심이 들지만 우선 디버깅 모드로 에러를 확인해보기로 했습니다.

## Debugging & Optimizing

<img width="1070" alt="image" src="https://github.com/user-attachments/assets/7a708fa3-5ff5-403a-8580-d7c0c9b5298a">

- 실행

<img width="1070" alt="image" src="https://github.com/user-attachments/assets/db185462-b601-40ba-8f81-dbfb346ff1c1">

우선 return까지는 잘 가고 있습니다!

<img width="1070" alt="image" src="https://github.com/user-attachments/assets/73b35bff-05e8-419e-a7ba-470cf278643f">

beforeBodyWrite 메서드의 로직이 성공적으로 적용되어 processBody 메서드가 잘 실행되고 있는 것을 볼 수 있습니다.

<img width="1070" alt="image" src="https://github.com/user-attachments/assets/d4388a68-2e7d-46c1-a78a-f706fce1bcfe">

직렬화가 가능한지 확인하기 위해 body가 null이 아닌지 확인합니다.

디버깅 로그를 남기고 출력 메시지에 Content-Disposition 헤더를 추가합니다.

<img width="1070" alt="image" src="https://github.com/user-attachments/assets/e074ef14-ce5f-47e9-beaf-bbd7a4400aea">

genericConverter가 null이기 때문에 기본 HttpMessageConverter를 사용하여 write 메서드를 호출하고 body를 직렬화합니다.

이 부분에서 에러가 발생하였습니다.

<img width="1070" alt="image" src="https://github.com/user-attachments/assets/86817afb-f7c7-492b-a9ae-889d05fe8b26">

ClassCastException이 발생한 것을 확인할 수 있습니다. 예외 메시지로 ApiResponse 객체를 String으로 처리할 수 없음을 알 수 있습니다.

문제는 StringHttpMessageConverter가 실행되어 String을 처리해야하는데 이를 ApiResponse 객체로 감싸서 보냈기 때문에 StringHttpMessageConverter가 ApiResponse를 처리하지 못해서 발생한 에러였습니다!

그렇다면 이를 해결하기 위해 beforeBodyWrite에서 String에 대한 처리를 따로 해주도록 하겠습니다!
### beforeBodyWrite 수정

``` java
@Override
public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                ServerHttpRequest request, ServerHttpResponse response) {
    if (body instanceof String) {
        // ApiResponse를 JSON 문자열로 수동 변환
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(ApiResponse.success(body));
        } catch (JsonProcessingException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "응답 변환 중 에러 발생");
            }   
    }
    return ApiResponse.success(body);
}
```

<img width="1179" alt="image" src="https://github.com/user-attachments/assets/3d856f29-fe30-493d-b850-3fef7f455d2c">


### Json을 보기 좋게 포맷팅 옵션 추가

``` java
@Override
public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                ServerHttpRequest request, ServerHttpResponse response) {
    if (body instanceof String) {
        // ApiResponse를 JSON 문자열로 수동 변환
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        try {
            return objectMapper.writeValueAsString(ApiResponse.success(body));

        } catch (JsonProcessingException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "응답 변환 중 에러 발생");
            }   
    }
    return ApiResponse.success(body);
}
```

<img width="1179" alt="image" src="https://github.com/user-attachments/assets/310f5d16-4c7b-4d95-b990-ed61e6701e83">

### Content Type을 Json으로 변경
Postman의 결과 바디에서 색이 이상해서 확인해봤더니 ContentType이 plane text로 설정된 것을 확인할 수 있었습니다.

<img width="1179" alt="image" src="https://github.com/user-attachments/assets/ea26c580-eeca-4c7b-b948-5fd064776512">

ContentType을 Json으로 변경해주는 코드를 추가하였습니다.

``` java
@Override
public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                ServerHttpRequest request, ServerHttpResponse response) {
    if (body instanceof String) {
        // ApiResponse를 JSON 문자열로 수동 변환
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        try {
            return objectMapper.writeValueAsString(ApiResponse.success(body));
        } catch (JsonProcessingException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "응답 변환 중 에러 발생");
            }   
    }
    return ApiResponse.success(body);
}
```

<img width="1179" alt="image" src="https://github.com/user-attachments/assets/3ee938c9-a5b4-4a95-a8b4-a18674814ddf">

<img width="1179" alt="image" src="https://github.com/user-attachments/assets/48fe9602-556e-4ba3-a0de-7e6b162d46c6">

잘 나오는 것을 확인할 수 있습니다!

### ObjectMapper 빈 주입

- 기존 코드

``` java
@RestControllerAdvice
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // ApiResponse로 이미 감싸진 응답은 제외
        return !ApiResponse.class.isAssignableFrom(returnType.getParameterType());
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (body instanceof String) {
            // ApiResponse를 JSON 문자열로 수동 변환
            response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            try {
                return objectMapper.writeValueAsString(ApiResponse.success(body));
            } catch (JsonProcessingException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "응답 변환 중 에러 발생");
            }   
        }
        return ApiResponse.success(body);
    }
}
```

현재 코드는 메서드를 실행할 때 마다 ObjectMapper 객체를 생성하여 사용 중입니다.

이를 빈으로 주입받아 재사용하면 더 효율적일 것 같습니다!


- 수정 후

``` java
@RestControllerAdvice
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper;

    public ApiResponseAdvice(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        // 이미 ApiResponse로 감싸진 경우 처리하지 않음
        return !ApiResponse.class.isAssignableFrom(returnType.getParameterType());
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {
        if (body instanceof String) {
            // Content-Type을 JSON으로 변경
            response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            try {
                // ApiResponse를 JSON 문자열로 변환
                return objectMapper.writeValueAsString(ApiResponse.success(body));
            } catch (JsonProcessingException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "응답 변환 중 에러 발생");
            }
        }
        // ApiResponse로 감싸서 반환
        return ApiResponse.success(body);
    }
}
```

# 정리

오늘은 ResponseBodyAdvice를 사용하여 이전 포스트에서 구현한 Envelop Pattern을 고도화해보았습니다.

"이 방법이 무조건 더 좋다!"가 아니라 상황에 맞게 두 방법 중 하나를 골라서 사용하면 되는 것입니다!

왜냐하면 두 방법 모두 장단점이 있기 때문입니다!

(저는 ResponseBodyAdvice를 사용한 방법을 선호하긴 합니다..)

긴 글 읽어 주셔서 감사합니다!!

---

제가 만든 **Envelope-Pattern**의 링크는 이 곳을 클릭해주세요!

<a href="https://github.com/alswp006/API_Response_Format-Envelope_Pattern_ResponseBodyAdvice" class="card-link">
   <img width="597" alt="image" src="https://github.com/user-attachments/assets/447b047b-103f-4f55-8465-0c15d8ef0333">
</a>

PR이나 의견, 피드백을 환영합니다!!!

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