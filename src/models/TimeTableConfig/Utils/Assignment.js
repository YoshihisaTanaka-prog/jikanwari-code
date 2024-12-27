import { Util, Editor } from "./_Parent";
import Assignment from "../Data/Assignment"
import { Subject, SubSubject } from "../Data/Subject";

class AssignmentEditor extends Editor {
  getObj(){
    const parent = this.relationship.get(this).data;
    return parent.getAssignmentObj(this.id);
  }
  
  addTeacher(id){
    const parent = this.relationship.get(this).data;
    parent.assignTeacher(this.id, id);
    return this;
  }

  removeTeacher(id){
    const parent = this.relationship.get(this).data;
    parent.unassignTeacher(this.id, id);
    return this;
  }
}

export default class AssignmentUtil extends Util {
  constructor(relationship){
    super(relationship);
    this.editor = AssignmentEditor;
  }
  
  add(homeroomId, subjectId) {
    const parent = this.relationship.get(this).data;
    const assignment = parent.assignments.find(a => a.studentsHomeroomId == homeroomId && a.subjectId == subjectId);
    if(assignment){
      return this.setId(assignment.id);
    } else{
      const id = parent.generateId("assignment");
      parent.assignments.push(new Assignment(id, homeroomId, [], subjectId));
      return this.setId(id);
    }
  }
  
  find(homeroomId, subjectId){
    const parent = this.relationship.get(this).data;
    const assignment = parent.assignments.find(a => a.studentsHomeroomId == homeroomId && a.subjectId == subjectId);
    return this.setId(assignment?.id);
  }

  getListByHomeroom(homeroomInfo={grade: 0, classNumber: 0}, isOnlyShown=true){
    const parent = this.relationship.get(this).data;
    const homeroomId = typeof homeroomInfo === "string" ? homeroomInfo : `room-${homeroomInfo.grade}-${homeroomInfo.classNumber}`;
    const homeroom = parent.classroomData.homes.find(h => h.id == homeroomId);
    if(homeroom){
      const assignments = parent.assignments
        .filter(a => a.studentsHomeroomId == homeroomId )
        .map(a => parent.getAssignmentObj(a.id))
        .sort((a, b) => {
          if(a.subject.genre == "main"){
            return b.subject.genre == "main" ? 0 : -1;
          }
          if(b.subject.genre == "main"){
            return 1;
          }
          if(["sub", "pe"].includes(a.subject.genre)){
            return ["sub", "pe"].includes(b.subject.genre) ? 0 : -1;
          }
          if(["sub", "pe"].includes(b.subject.genre)){
            return 1;
          }
        });
      if(isOnlyShown){
        return assignments.filter(function(a){
          const homeroom = parent.classroomData.homes.find(h => h.id == a.studentsHomeroomId);
          if(homeroom){
            return homeroom.subjectIds.includes(a.subject.id);
          }
          return false;
        });
      } else {
        return assignments;
      }
    }
    return [];
  }

  getListBySubject(subjectId, isOnlyShown=true){
    const parent = this.relationship.get(this).data;
    if(parent.mode == "high"){
      const subject = parent.subjects.find(s => s.id == subjectId);
      if(subject instanceof SubSubject){
        const assignments = parent.assignments
          .filter(a => a.subjectId == subjectId)
          .map(a => parent.getAssignmentObj(a.id))
          .sort((a, b) => {
            if(a.subject.genre == "main"){
              return b.subject.genre == "main" ? 0 : -1;
            }
            if(b.subject.genre == "main"){
              return 1;
            }
            if(["sub", "pe"].includes(a.subject.genre)){
              return ["sub", "pe"].includes(b.subject.genre) ? 0 : -1;
            }
            if(["sub", "pe"].includes(b.subject.genre)){
              return 1;
            }
          });
        if(isOnlyShown){
          return assignments.filter(function(a){
            const homeroom = parent.classroomData.homes.find(h => h.id == a.studentsHomeroomId);
            if(homeroom){
              return homeroom.subjectIds.includes(a.subject.id);
            }
            return false;
          });
        } else {
          return assignments;
        }
      } else if(subject instanceof Subject) {
        const subSubjectIds = parent.filter(s => s.mainSubjectId == subjectId).map(s => s.id);
        const assignments = parent.assignments
          .filter(a => subSubjectIds.includes(a.subjectId))
          .map(a => parent.getAssignmentObj(a.id))
          .sort((a, b) => {
            if(a.subject.genre == "main"){
              return b.subject.genre == "main" ? 0 : -1;
            }
            if(b.subject.genre == "main"){
              return 1;
            }
            if(["sub", "pe"].includes(a.subject.genre)){
              return ["sub", "pe"].includes(b.subject.genre) ? 0 : -1;
            }
            if(["sub", "pe"].includes(b.subject.genre)){
              return 1;
            }
          });
        if(isOnlyShown){
          return assignments.filter(function(a){
            const homeroom = parent.classroomData.homes.find(h => h.id == a.studentsHomeroomId);
            if(homeroom){
              return homeroom.subjectIds.includes(a.subject.id);
            }
            return false;
          });
        } else {
          return assignments;
        }
      } else {
        return [];
      }
    } else {
      const assignments = parent.assignments
        .filter(a => a.subjectId == subjectId)
        .map(a => parent.getAssignmentObj(a.id))
        .sort((a, b) => {
          if(a.subject.genre == "main"){
            return b.subject.genre == "main" ? 0 : -1;
          }
          if(b.subject.genre == "main"){
            return 1;
          }
          if(["sub", "pe"].includes(a.subject.genre)){
            return ["sub", "pe"].includes(b.subject.genre) ? 0 : -1;
          }
          if(["sub", "pe"].includes(b.subject.genre)){
            return 1;
          }
        });
      if(isOnlyShown){
        return assignments.filter(function(a){
          const homeroom = parent.classroomData.homes.find(h => h.id == a.studentsHomeroomId);
          if(homeroom){
            return homeroom.subjectIds.includes(a.subject.id);
          }
          return false;
        });
      } else {
        return assignments;
      }
    }
  }

  getList(isOnlyShown=true){
    const parent = this.relationship.get(this).data;
    const assignments = parent.assignments
      .map(a => parent.getAssignmentObj(a.id))
      .sort((a, b) => {
        if(a.subject.genre == "main"){
          return b.subject.genre == "main" ? 0 : -1;
        }
        if(b.subject.genre == "main"){
          return 1;
        }
        if(["sub", "pe"].includes(a.subject.genre)){
          return ["sub", "pe"].includes(b.subject.genre) ? 0 : -1;
        }
        if(["sub", "pe"].includes(b.subject.genre)){
          return 1;
        }
      });
    if(isOnlyShown){
      return assignments.filter(function(a){
        const homeroom = parent.classroomData.homes.find(h => h.id == a.studentsHomeroomId);
        if(homeroom){
          return homeroom.subjectIds.includes(a.subject.id);
        }
        return false;
      });
    } else {
      return assignments;
    }
  }
}