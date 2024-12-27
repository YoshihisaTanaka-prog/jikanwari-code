import { Util, Editor } from './_Parent';
import { Subject, SubSubject } from '../Data/Subject';

class SubjectEditor extends Editor {
  getObj(){
    const parent = this.relationship.get(this).data;
    return parent.getSubjectObj(this.id);
  }

  addSub(name){
    const parent = this.relationship.get(this).data;
    const subject = parent.subjects.find((subject) => subject.name === name && subject.mainSubjectId != null);
    if(subject){
      this.id = subject.id;
      return this;
    } else {
      const newId = parent.generateId("subject");
      parent.subjects.push(new SubSubject(newId, this.id, name, []));
      this.id = newId;
      return this;
    }
  }

  update(name, genre){
    const parent = this.relationship.get(this).data;
    for(let i=0; i<parent.subjects.length; i++){
      if(parent.subjects[i].id === this.id){
        parent.subjects[i].name = name;
        if(![null, undefined].includes(genre)){
          parent.subjects[i].genre = genre;
        }
        break;
      }
    }
    return this;
  }

  addToHomeroom(homeroomId, teacherIds){
    const parent = this.relationship.get(this).data;
    parent.addSubjectToHomeroom(this.id, homeroomId, teacherIds);
    return this;
  }

  removeFromHomeroom(id){
    const parent = this.relationship.get(this).data;
    parent.removeSubjectFromHomeroom(this.id, id);
    return this;
  }

  addTeacher(id){
    const parent = this.relationship.get(this).data;
    parent.addTeacherToSubject(this.id, id);
    return this;
  }

  removeTeacher(id){
    const parent = this.relationship.get(this).data;
    parent.removeTeacherFromSubject(this.id, id);
    return this;
  }

  addSpecialClassroom(id){
    const parent = this.relationship.get(this).data;
    parent.addSpecialClassroomToSubject(this.id, id);
    return this;
  }

  removeSpecialClassroom(id){
    const parent = this.relationship.get(this).data;
    parent.removeSpecialClassroomFromSubject(this.id, id);
    return this;
  }
  
  isIncludesSpecialClassroom(id){
    const parent = this.relationship.get(this).data;
    const subject = parent.subjects.find(s => s.id === this.id);
    return subject?.specialClassroomIds?.includes(id);
  }
  isIncludesTeacher(id){
    const parent = this.relationship.get(this).data;
    const subject = parent.subjects.find(s => s.id === this.id);
    if(subject instanceof SubSubject){
      const mainSubject = parent.subjects.find((s) => s.id === subject.mainSubjectId);
      return mainSubject.teacherIds.includes(id);
    } else if(subject instanceof Subject){
      return subject.teacherIds.includes(id);
    } else {
      return null;
    }
  }
}

export default class SubjectUtil extends Util {
  constructor(relationship){
    super(relationship);
    this.editor = SubjectEditor;
  }
  
  add(name, genre){
    const parent = this.relationship.get(this).data;
    const subject = parent.subjects.find((subject) => subject.name === name);
    if(subject){
      return this.setId(subject.id);
    } else {
      const id = parent.generateId("subject");
      parent.subjects.push(new Subject(id, name, genre));
      return this.setId(id);
    }
  }
    
  getList(){
    const parent = this.relationship.get(this).data;
    return parent.subjects.filter(s => s.mainSubjectId == null).map(s => parent.getSubjectObj(s.id)).sort((a, b) => {
      if(a.genre == "main"){
        return b.genre == "main" ? 0 : -1;
      }
      if(b.genre == "main"){
        return 1;
      }
      if(["sub", "pe"].includes(a.genre)){
        return ["sub", "pe"].includes(b.genre) ? 0 : -1;
      }
      if(["sub", "pe"].includes(b.genre)){
        return 1;
      }
    });
  }
}