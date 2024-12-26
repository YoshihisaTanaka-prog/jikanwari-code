// 教科情報
export class Subject {
  constructor(id, name, genre="", teacherIds = [], specialClassroomIds = []) {
    this.id = id;
    this.name = name; // 教科名
    this.genre = genre;
    this.teacherIds = teacherIds; // 教科の担当教師の一覧
    this.specialClassroomIds = specialClassroomIds; // ホームルーム以外に使う可能性のある教室の一覧
  }

  addTeacher(id){
    if(this.genre != "other" && !this.teacherIds.includes(id)){
      this.teacherIds = [...this.teacherIds, id];
    }
  }

  removeTeacher(teacherId){
    this.teacherIds = this.teacherIds.filter((id) => id!== teacherId);
  }

  addSpecialClassroom(id) {
    if(!this.specialClassroomIds.includes(id)){
      this.specialClassroomIds = [...this.specialClassroomIds, id]
    }
  }

  removeSpecialClassroom(classroomId){
    this.specialClassroomIds = this.specialClassroomIds.filter((id) => id!== classroomId);
  }

  toObject(){
    const myJson = JSON.stringify(this);
    return JSON.parse(myJson);
  }

  static fromObject(data) {
    return new Subject(data.id, data.name, data.genre, data.teacherIds, data.specialClassroomIds);
  }
}

export class SubSubject extends Subject {
  constructor(id, mainSubjectId, name, specialClassroomIds = []) {
    super(id, name, null, null, specialClassroomIds);
    this.mainSubjectId = mainSubjectId;
  }
  static fromObject(data) {
    return new SubSubject(data.id, data.mainSubjectId, data.name, data.specialClassroomIds);
  }
}