import { Util, Editor } from "./_Parent";

class HomeroomEditor extends Editor {
  getObj(){
    const parent = this.relationship.get(this).data;
    return parent.classroomData.homes.find(h => h.id == this.id);
  }

  addSubject(subjectId, teacherIds){
    const parent = this.relationship.get(this).data;
    parent.addSubjectToHomeroom(subjectId, this.id, teacherIds);
    return this;
  }

  addSubjects(subjectIds, teacherIds){
    const parent = this.relationship.get(this).data;
    for(const subjectId of subjectIds){
      parent.addSubjectToHomeroom(subjectId, this.id, teacherIds);
    }
    return this;
  }

  removeSubject(id){
    const parent = this.relationship.get(this).data;
    parent.removeSubjectFromHomeroom(id, this.id);
    return this;
  }

  setMainTeacher(id){
    const parent = this.relationship.get(this).data;
    parent.setMainTeacher(this.id, id);
    return this;
  }

  setAssistantTeacher(id){
    const parent = this.relationship.get(this).data;
    parent.setAssistantTeacher(this.id, id);
    return this;
  }
}

export default class HomeroomUtil extends Util {
  constructor(relationship){
    super(relationship);
    this.editor = HomeroomEditor;
  }
  
  getList(){
    return this.relationship.get(this).data.classroomData.homes;
  }

  setByNumber(grade, classNumber){
    return this.setId(`room-${grade}-${classNumber}`);
  }
}