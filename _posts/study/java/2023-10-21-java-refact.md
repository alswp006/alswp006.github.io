---
layout: post
title: 객체지향 생활체조(feat. 코드 리팩토링)
subtitle: 객체지향 생활체조(feat. 코드 리팩토링)
date: '2023-10-21 10:45:51 +0900'
categories:
    - study
    - java
tags:
    - AnomalyDetection
comments: true
published: true
list: true
---

# 객체지향 생활체조(feat. 코드 리팩토링)

- 우아한 테크코스 6기 프리코스를 하며 다시 한 번 제 코드의 조잡합을 느꼈습니다…
- 그러던 와중 디스코드 함께 나누기 칸에서 객체지향 생활체조를 사용하면 클린 코드를 더 잘 만들 수 있다는 정보를 얻었고 예전에 한번 훑듯이 이 규칙들을 봤던 저는 이를 공부하여 제 코드에 적용해보기로 하였습니다!!

## 규칙 1 : 메소드 당 들여쓰기 한 번

- 각 메서드가 정확히 한 가지 일을 하는지, 즉 메서드당 하나의 제어 구조나 하나의 문장 단락(block)으로 되어 있는지를 지키려고 노력합니다.
- 한 메서드 안에 중첩된 제어구조가 있다면 다단계의 추상화를 코드로 짠 것이며, 고로 한 가지 이상의 일을 하고 있다는 뜻입니다.
- 정확히 한 가지 일을 하는 메서드들로 작업을 하면 애플리케이션의 각 단위가 더 작아짐에 따라 재사용의 수준은 기하급수적으로 상승하기 시작합니다.
- 00줄로 구현된 5가지 작업을 맡은 하나의 메서드 안에서 재사용의 가능성을 골라내기란 어려울 수 있습니다.
- 주어진 컨텍스트에서 단일 객체의 상태를 관리하는 3줄짜리 메서드라면 많은 다양한 컨텍스트에서 쓸 수 있습니다.

- 변경 전

```java
class MyName{
    String[][] s_list = { {"k","i","m"}, {"m","i","n"}, {"j","e"} };
    List<String> list = new ArrayList<>();
    public void insert(){
        for (int i = 0; i<s_list.length; i++){
            for (int j = 0; j<s_list[i].length; j++){
                list.add(s_list[i][j]);
            }
        }
    }
}
```


- 변경 후

```java
 
class MyName{
    String[][] s_list = { {"k","i","m"}, {"m","i","n"}, {"j","e"} };
    List<String> list = new ArrayList<>();
    public void insert(){
        for (int i = 0; i<s_list.length; i++){
            insert(i);
        }
    }
    public void insert(int i){
        for (int j = 0; j<s_list[i].length; j++){
            list.add(s_list[i][j]);
        }
    }
}
```

- 이렇게 더 적어진 코드에서 버그의 존재를 판별하기나 변경하기가 대체로 훨씬 쉽습니다.
- **메소드를 잘게 쪼개는 것!!**

## 규칙 2 : else 예약어를 쓰지 않는다.

- 프로그래머라면 if/else 구문에 익숙하고 더군다나 문법공부를 이제 막 한 프로그래머라면 여러가지 예제에서 if/else 구문을 많이 사용하여 익숙할 것입니다. (저요..)
- 코드의 분기가 하나 더 추가된다면 코드를 리팩토링 하는 것보다는 당연히 조건문의 구문을 추가하는 것이 편할 것입니다.
- 하지만 객체지향 생활체조에서는 조건문은 코드 중복의 원흉이 될 수도 있기 때문에 else 예약어를 사용하지 말라고 합니다.
- 변경 전

```java
class Student{
    public static void main(String[] args) {
        int x = 3;
        if (x == 3){
            System.out.println(x);
        }else{
            System.out.println("3이 아닙니다");
        }
    }
}
```

- 변경 후

```java
class Student{
    public static void main(String[] args) {
        int x = 3;
        if (x == 3){
            System.out.println(x);
						System.exit(0);
        }
        System.out.println("3이 아닙니다");
    }
}
```

- return 문을 일찍 쓰는 것을 너무 많이 하면 간결함을 잃을 수도 있으니 조심히 사용해야 합니다.
- 객체지향 언어는 다형성을 통해서 복잡한 조건문을 처리할 수 있습니다.

## 규칙 3 : 모든 원시값과 문자열의 포장한다.

- 원시값과 문자열을 캡슐화해서 작은 객체만이 그 값들에 접근할 수 있게 해주는 것입니다!
- 변경 전

```java
public class info{
	public int infoA;
}
```

- 변경 후

```java
public class info{
	private int infoA;
	public int getInfoA(){
		return infoA;
	}
	public int setInfoA(int infoA){
		this.infoA = infoA
	}
}
```

## 규칙 4 : 코드 한 줄에 점 하나만을 사용한다.

- 한 줄의 코드에서 여러 개의 점이 있으면 책임 소재의 오류를 많이 발견합니다.
- 객체의 모든 점들이 연결되어 있다면 대상 객체는 다른 객체에 깊숙이 관여하고 있는 셈입니다.
- 이런 중복된 점들은 캡슐화를 어기고 있다는 방증이기도 합니다.
- 객체는 자기 작업만 잘 하면 됩니다.
- 변경 전

```java
public class Student {
    public static void main(String[] args) {
        String s = "kimminje";
        List<String> list = new ArrayList<>(Arrays.asList(s.split("")));
        System.out.println(list.get(s.indexOf(list.get(s.length()-1))));
    }
}
```

- 변경 후

```java
public class Student {
    public static void main(String[] args) {
        String s = "kimminje";
        List<String> list = Arrays.asList(s.split(""));
        int lastIndex = s.length()-1;
        System.out.println(list.get(lastIndex));
    }
}
```

- 뭔가 예제를 만들다보니 굉장히 복잡해졌는데 한눈에 봐도 아래에 있는 코드가 오류를 잡기도 쉽고 가독성도 좋으며 코드 변경에도 용이해보입니다!

## 규칙 5 : 축약 금지

- 클래스와 메서드 이름을 한두 단어로 유지하려고 노력하고 문맥을 중복하는 이름을 자제해야 합니다.
- 만약 클래스 이름이 Order라면 shipOrder라고 메서드 이름을 지을 필요가 없습니다.
- 짧게 ship()이라고 하면 간결하게 뜻을 담을 수 있습니다.

## 규칙 6: 모든 엔티티를 작게 유지한다.

- 이 말은 50줄 이상 되는 클래스와 파일이 10개 이상인 패키지는 없어야 한다는 뜻이라고 합니다.
- 보통 50줄 이상이 되는 클래스는 여러가지 일을 하고 있는 경우가 많고 패키지도 동일합니다.
- 한 가지 이상의 일을 하는 클래스를 묶지 않아야하고 패키지도 클래스처럼 단일한 목표가 있어야 합니다.

## 규칙 7 : 3개 이상의 인스턴스 변수를 가진 클래스 사용 금지

- 하나의 클래스는 작은 단위여야 합니다.
- 한 클래스의 인스턴스 변수가 너무 많다면 그 클래스의 목적이 무엇인지 이해하기 어렵습니다. 추후 유지보수도 쉽지가 않습니다.
- 대부분 클래스들에서는 변수를 최대한 적게 사용하는 것이 좋습니다.
- 변경 전

```java
public class Student {
    private String name;
    private int id;
    private String address;
    private int birthDate;
    private String grade;
}
```

- 변경 후

```java
public class Student {
    private String name;
    private int id;
    
    public void setNameId(String name,int id) {
        this.name = name;
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public int getId() {
        return id;
    }
}
class Address{}
class BirthDate{}
class Grade{}
```

## 규칙 8 : 일급 콜렉션을 사용한다.

- 콜렉션을 포함한 클래스는 반드시 다른 멤버 변수가 없어야 합니다.
- Collection을 Wrapping하면서, 그 외 다른 멤버 변수가 없는 상태를 일급 컬렉션이라 합니다.

```java
class Student{}
public class Class {
    private List<Class> student;

    public void Store(List<Class> students) {
        validCheck(students);
        this.student = students;
    }

    private void validCheck(List<Class> students) {
        if(students.size() > 10) {
            throw new IllegalArgumentException("한 반에는 열 명의 학생까지만!!!!");
        }
    }
}
```

## 규칙 9 : 게터(getter), 세터(setter) 프로퍼티들을 사용하지 않는다.

- 이는 원칙에 따르면 묻지말고 객체에게 행위를 시키라고 합니다.
    - 이 말은 객체에서 변수 등을 물어서 사용하지 말고 내가 그 변수를 가져와서 해야하는 행동을 객체에게 시키라는 말인 것 같습니다.
- 위와같이 게터, 세터 프로퍼티를 사용하지 않고 객체에게 행위를 시키면 해당 객체가 어떤 행동에 대한 책임이 분명해집니다.
- 이는 캡슐화를 생각했을 때처럼 유지보수에 더 용이해집니다.
- 변경 전

```java
public class Exam {
    private int a;
    private int b;
    public int getA() {
        return a;
    }
    public void setA(int a) {
        this.a = a;
    }
    public int getB() {
        return b;
    }
    public void setB(int b) {
        this.b = b;
    }
}

class Main{
    public static void main(String[] args) {
        Exam exam = new Exam();
        exam.setA(1);
        exam.setB(2);
        System.out.println(exam.getA()+exam.getB());
    }
}
```

- 변경 후

```java
public class Exam {
    public int add (int a,int b){
        return a+b;
    }
}

class Main{
    public static void main(String[] args) {
        Exam exam = new Exam();
        System.out.println(exam.add(1,2));
    }
}
```

## 정리

- 이들을 공부하며 제 코드가 얼마나 조잡한지를 다시 한 번 느끼고 이들을 적용하려고 노력하면서 코드가 많이 깔끔해진 것을 알 수 있습니다.
- 그리고 변경된 코드를 다방면으로 수정해가며 진정한 객체 지향 프로그래밍의 장점, 유지보수가 용이하다는 말이 무슨 뜻인지를 알게 되었습니다.
- 코드는 짧다고 다 좋은게 아니니 다음부터는 객체지향 생활체조의 규칙들을 잘 지켜가며 객체 지향 프로그래밍의 장점을 살린 코드를 만들어보겠습니다!!!👍
