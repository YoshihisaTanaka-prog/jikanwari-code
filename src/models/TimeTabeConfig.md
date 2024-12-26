# TimetableConfig クラス ドキュメント

## 概要
TimetableConfig クラスは、中学校の時間割を作成および管理するための主要なクラスです。このクラスは学年情報、教科情報、担当情報、教師情報、教室情報を統合的に管理します。また、学年進行に伴うデータ移行や、ユニークなID生成機能を提供します。

## 主な機能
- 学年情報の設定および管理
- 教科情報の追加
- 担当情報の追加
- ユニークなIDの生成
- 学年進行に伴うデータ移行
- JSONデータ形式への変換

---

## コンストラクタ

複雑なので、代わりにファクトリメソッドcreateを使ってください。

```javascript
static create(data)
```
#### 引数
- `data`: JSON文字列、オブジェクト、小学校かどうか、または未指定（新しいインスタンスを作成）
#### 戻り値
- TimetableConfig インスタンス

---

### 引数
- `gradesData`: 学年情報を管理する GradesData インスタンスまたは学年数（数値）
- `subjectData`: 教科情報を管理するオブジェクト（ID をキー）
- `assignmentData`: 担当情報を管理するオブジェクト（ID をキー）
- `teacherNameData`: 教師名情報を管理するオブジェクト（ID をキー）
- `classroomData`: 教室情報を管理するオブジェクト（特別教室情報とホームルーム情報）
- `idCounter`: ID生成用のカウンタ（数値）
- `schoolYear`: 学校年度（数値、未指定の場合は自動計算）

---

## メソッド一覧

### 学年データを設定
```javascript
setGradesData(gradeNumber, numberOfClasses)
```
#### 引数
- `gradeNumber`: 学年番号（数値）
- `numberOfClasses`: クラス数（数値）

---

### 教科を追加
```javascript
addSubject(name)
```
#### 引数
- `name`: 教科名（文字列）
#### 戻り値
- 生成された教科のID（文字列）

---

### 担当情報を追加
```javascript
addAssignment(studentsHomeroomId, teacherInfo, subjectId, classroomInfo)
```
#### 引数
- `studentsHomeroomId`: 対象クラスのID（文字列）
- `teacherInfo`: 担当教師名またはその配列（文字列 or 配列）
- `subjectId`: 教科ID（文字列）
- `classroomInfo`: 使用する教室名またはその配列（文字列 or 配列）
#### 戻り値
- 生成された担当情報のID（文字列）

---

### 教師を追加
```javascript
addTeacher(assignmentId, teacherName)
```
#### 引数
- `assignmentId`: 担当情報のID（文字列）
- `teacherName`: 教師名（文字列）

---

### 教師を削除
```javascript
removeTeacher(assignmentId, teacherName)
```
#### 引数
- `assignmentId`: 担当情報のID（文字列）
- `teacherName`: 教師名（文字列）

---

### 特別教室を追加
```javascript
addSpecialClassroom(assignmentId, classroomName)
```
#### 引数
- `assignmentId`: 担当情報のID（文字列）
- `classroomName`: 教室名（文字列）

---

### 特別教室を削除
```javascript
removeSpecialClassroom(assignmentId, classroomName)
```
#### 引数
- `assignmentId`: 担当情報のID（文字列）
- `classroomName`: 教室名（文字列）

---

### JSON形式に変換
```javascript
toJSON()
```
#### 戻り値
- JSONオブジェクト形式のデータ

---

### 学年進行によるデータ移行
```javascript
updateYear(stayTeacherNames)
```
#### 引数
- `stayTeacherNames`: 次年度も在籍する教師名の配列（文字列配列）
#### 戻り値
- 更新された TimetableConfig インスタンス

---

## GradesData クラス

学年のクラス情報を管理するクラスです。

### プロパティ
- `gradeLength`: 学年の数

---

## Subject クラス

教科情報を管理するクラスです。

### プロパティ
- `id`: 教科ID
- `name`: 教科名
- `teacherIds`: 教師IDの配列
- `specialClassroomIds`: 特別教室IDの配列

---

## Assignment クラス

担当情報を管理するクラスです。

### プロパティ
- `id`: 担当情報ID
- `studentsHomeroomId`: 対象クラスのID
- `teacherIdList`: 担当教師IDの配列
- `subjectId`: 教科ID
- `specialClassroomIds`: 使用する教室IDの配列
- `isTemporary`: 臨時担当かどうか（真偽値）

