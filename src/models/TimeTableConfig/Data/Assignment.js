// 担当情報
export default class Assignment {
  constructor(id, studentsHomeroomId, subjectId, teacherIds, isTemporary = false) {
    this.id = id;
    this.studentsHomeroomId = studentsHomeroomId;
    this.subjectId = subjectId; // 教科ID
    this.teacherIds = teacherIds; // 担当教師のIDのリスト
    this.isTemporary = isTemporary; // 短期的な代理か否か
  }

  addTeacher(id){
    if(!this.teacherIds.includes(id)){
      this.teacherIds = [...this.teacherIds, id];
    }
  }

  removeTeacher(id){
    this.teacherIds = this.teacherIds.filter((tid) => id !== tid);
  }

  toObject(){
    return JSON.parse(JSON.stringify(this));
  }

  static fromObject(data) {
    return new Assignment(
      data.id,
      data.studentsHomeroomId,
      data.subjectId,
      data.teacherIds,
      data.isTemporary
    );
  }
}