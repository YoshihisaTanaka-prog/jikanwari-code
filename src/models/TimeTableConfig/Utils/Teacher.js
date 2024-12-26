import { Util, Editor } from "./_Parent";
import { Subject, SubSubject } from "../Data/Subject";

class TeacherEditor extends Editor {
  getObj(){
    const parent = this.relationship.get(this).data;
    return parent.getTeacherObj(this.id);
  }
  
  update(name){
    const parent = this.relationship.get(this).data;
    for(let i=0; i<parent.teachers.length; i++){
      if(parent.teachers[i].id == this.id){
        parent.teachers[i].name = name;
        break;
      }
    }
    return this;
  }

  setHead(grade){
    const parent = this.relationship.get(this).data;
    parent.headTeacherData[`${grade}`] = this.id;
    return this;
  }

  addToSubject(id){
    const parent = this.relationship.get(this).data;
    parent.addTeacherToSubject(id, this.id);
    return this;
  }

  removeFromSubject(id){
    const parent = this.relationship.get(this).data;
    parent.removeTeacherFromSubject(id, this.id);
    return this;
  }

  setToClassroomAsMain(grade, classNumber){
    const parent = this.relationship.get(this).data;
    parent.setMainTeacher(`room-${grade}-${classNumber}`, this.id);
    return this;
  }
  setToClassroomAsAssistant(grade, classNumber){
    const parent = this.relationship.get(this).data;
    parent.setAssistantTeacher(`room-${grade}-${classNumber}`, this.id);
    return this;
  }

  assignTo(id){
    const parent = this.relationship.get(this).data;
    parent.assignTeacher(id, this.id);
    return this;
  }

  unassignFrom(id){
    const parent = this.relationship.get(this).data;
    parent.unassignTeacher(id, this.id);
    return this;
  }
}

export default class TeacherUtil extends Util {
  add(name){
    const parent = this.relationship.get(this).data;
    const teacher = parent.teachers.find(t => t.name == name);
    if(teacher){
      return this.setId(teacher.id);
    } else {
      const teacherId = parent.generateId("teacher");
      parent.teachers.push({id: teacherId, name: name});
      return this.setId(teacherId);
    }
  }

  getHead(grade){
    return this.relationship.get(this).data.headTeacherData[`${grade}`];
  }

  getChargersOfHomeroom(grade, classNumber){
    const parent = this.relationship.get(this).data;

    const returnObj = {};
    
    const headTeacherId = parent.headTeacherData[`${grade}`];
    const headTeacher = parent.getTeacherObj(headTeacherId);
    returnObj.head = headTeacher;
    
    const homeroom = parent.classroomData.homes.find(h => h.id == `room-${grade}-${classNumber}`);
    const mainTeacherId = homeroom?.mainTeacherId;
    const mainTeacher = parent.getTeacherObj(mainTeacherId);
    returnObj.main = mainTeacher;

    const assistantTeacherId = homeroom?.assistantTeacherId;
    const assistantTeacher = parent.getTeacherObj(assistantTeacherId);
    returnObj.assistant = assistantTeacher;
    
    return returnObj
  }

  getListByHomeroom(homeroomInfo={grade: 0, classNumber: 0}){
    const parent = this.relationship.get(this).data;

    const returnObj = {charger: [], head: [], sameGrade: [], other: [], unset: []};
    const usedTeacherIds = [""];

    const homeroomId = typeof homeroomInfo == "string" ? homeroomInfo : `room-${homeroomInfo.grade}-${homeroomInfo.classNumber}`;
    const grade = homeroomId.split("-")[1];
    // 学年主任を取得
    const headTeacher = parent.getTeacherObj(parent.headTeacherData[grade]);
    if(headTeacher){
      returnObj.head.push(headTeacher);
      usedTeacherIds.push(headTeacher.id);
    }

    // 担任・副担任を取得
    const homeroom = parent.classroomData.homes.find(h => h.id == homeroomId);
    if(homeroom){
      for(const teacher of [homeroom.mainTeacherId, homeroom.assistantTeacherId].map(id => parent.getTeacherObj(id)).filter(t => t != null)){
        returnObj.charger.push(teacher);
        usedTeacherIds.push(teacher.id);
      }
    }

    // 同学年の他クラスの教師一覧
    for(let i=1; i<=parent.gradesData.get(Number(grade)); i++){
      const currenrHomeroomId = `room-${grade}-${i}`;
      if(currenrHomeroomId == homeroomId) {
        continue;
      }
      const homeroom = parent.classroomData.homes.find(h => h.id == currenrHomeroomId);
      if(homeroom){
        for(const teacher of [homeroom.mainTeacherId, homeroom.assistantTeacherId]
          .filter(id => !usedTeacherIds.includes(id))
          .map(id => parent.getTeacherObj(id))
        ){
          returnObj.sameGrade.push(teacher);
          usedTeacherIds.push(teacher.id);
        }
      }
    }

    // 他学年の教師一覧
    for(let j=1; j<=parent.gradesData.gradeLength; j++){
      if(j == Number(grade)){
        continue;
      }
      // 学年主任を取得
      const headTeacher = parent.getTeacherObj(parent.headTeacherData[`${j}`]);
      if(headTeacher){
        returnObj.other.push(headTeacher);
        usedTeacherIds.push(headTeacher.id);
      }
      // 担任・副担任
      for(let i=1; i<=parent.gradesData.get(j); i++){
        const currenrHomeroomId = `room-${j}-${i}`;
        const homeroom = parent.classroomData.homes.find(h => h.id == currenrHomeroomId);
        if(homeroom){
          for(const teacher of [homeroom.mainTeacherId, homeroom.assistantTeacherId]
            .filter(id => !usedTeacherIds.includes(id))
            .map(id => parent.getTeacherObj(id))
          ){
            returnObj.other.push(teacher);
            usedTeacherIds.push(teacher.id);
          }
        }
      }
    }

    // その他の教師一覧
    for(const teacher of parent.teachers.filter(t => !usedTeacherIds.includes(t.id)).map(t => parent.getTeacherObj(t.id))){
      returnObj.unset.push(teacher);
    }
    
    return returnObj;
  }

  getListBySubject(subjectId){
    const parent = this.relationship.get(this).data;
    // 検索先の教科を指定
    let searchSubjectId = "";
    const subject = parent.subjects.find(s => s.id == subjectId);
    if(subject instanceof SubSubject){
      searchSubjectId = subject.mainSubjectId;
    } else if(subject instanceof Subject){
      searchSubjectId = subjectId;
    }
  
    // 教科担当の教師ID一覧を設定
    const chargerIds = parent.subjects.find(s => s.id == searchSubjectId)?.teacherIds;
  
    if(chargerIds){
      const returnObj = {charger: [], other: [], unset: []};
      const usedIds = [];
      
      // 選ばれた教科の担当教師一覧
      for(const teacherId of chargerIds){
        const teacher = parent.getTeacherObj(teacherId);
        if(teacher){
          returnObj.charger.push(teacher);
          usedIds.push(teacher.id);
        }
      }

      // 他教科の担当教師一覧
      for(const subject of parent.subjects.filter(s => s.id != searchSubjectId && s.mainSubjectId == null)){
        for(const teacherId of subject.teacherIds){
          if(usedIds.includes(teacherId)){
            continue;
          }
          const teacher = parent.getTeacherObj(teacherId);
          if(teacher){
            returnObj.other.push(teacher);
            usedIds.push(teacher.id);
          }
        }
      }

      // 教科未設定の教師一覧
      returnObj.unset = parent.teachers.filter(t =>!usedIds.includes(t.id)).map(t => parent.getTeacherObj(t.id));
      
      return returnObj;
    } else {
      return {unset: parent.teachers.map(t => parent.getTeacherObj(t.id))};
    }
  }
  setId(id){
    const editor = new TeacherEditor(id, this.relationship);
    this.relationship.set(editor, this.relationship.get(this));
    return editor;
  }
}