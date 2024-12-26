// 学年のクラス情報
import GradesData from './Grades';

// 教科情報
import { Subject, SubSubject } from './Subject';

// 担当情報
import Assignment from './Assignment';

// 全体管理クラス
export default class TimetableConfigData {
  constructor(
    mode = "juniorHigh",
    gradesData = new GradesData(),
    subjects = {},
    assignments = {},
    teachers = {},
    headTeacherData = {"1": "", "2": "", "3": ""},
    classroomData = {homes: [], specials: []},
    idCounter = {},
    schoolYear,
  ) {
    // 小・中・高判定
    this.mode = mode

    // 学年情報を管理
    this.gradesData = gradesData; 
    
    // 教科情報
    this.subjects = [];
    for(const subject of subjects){
      if(mode == "high" && subject.mainSubjectId != null){
        this.subjects.push(SubSubject.fromObject(subject));
      } else {
        this.subjects.push(Subject.fromObject(subject));
      }
    }

    // 担当情報
    this.assignments = [];
    for(const assignment of assignments){
      this.assignments.push(Assignment.fromObject(assignment));
    }

    // 教師名の情報
    this.teachers = teachers;

    // 各学年の学年主任を管理
    this.headTeacherData = headTeacherData;
    for(let i=1; i<=this.gradesData.gradeLength; i++){
      if(this.headTeacherData[`${i}`] == null){
        this.headTeacherData[`${i}`] = "";
      }
    }
    
    // 教室名の情報
    this.classroomData = classroomData;
    
    // ID生成用カウンター
    this.idCounter = idCounter;

    // 何年度のデータなのかを管理
    if(schoolYear){
      this.schoolYear = schoolYear;
    } else {
      const now = new Date();
      if(now.getMonth() < 2){
        this.schoolYear = now.getFullYear() - 1;
      } else{
        this.schoolYear = now.getFullYear();
      }
    }

    // ホームルームのデータの欠損を補完
    const homerooms = this.gradesData.getHomerooms();
    for(const homeroom of homerooms){
      if(!this.classroomData.homes.map(h => h.id).includes(homeroom.id)){
        const homeroomObj = homeroom;
        homeroomObj.mainTeacherId = "";
        homeroomObj.assistantTeacherId = "";
        homeroomObj.subjectIds = [];
        this.classroomData.homes.push(homeroomObj);
      }
    }
  }

  // ID生成用
  generateId(prefix) {
    const newCount = (this.idCounter[prefix] || 0) + 1;
    this.idCounter[prefix] = newCount
    return `${prefix}-${newCount}-${this.schoolYear}`;
  }

  // 教科とホームルーム
  addSubjectToHomeroom(subjectId, homeroomId, teacherIds=[]){
    for(let i=0; i<this.classroomData.homes.length; i++){
      const homeroom = this.classroomData.homes[i];
      if(homeroom.id == homeroomId){
        if(!homeroom.subjectIds.includes(subjectId)){
          const subject = this.subjects.find(s => s.id === subjectId);
          if(subject){
            this.classroomData.homes[i].subjectIds = [...this.classroomData.homes[i].subjectIds, subjectId];
            if(this.assignments.find(a => a.subjectId == subjectId && a.studentsHomeroomId == homeroomId) == null){
              const newId = this.generateId("assignment");
              if(this.mode == "elemental"){
                this.assignments.push(new Assignment(newId, homeroomId, subjectId, teacherIds));
              } else if(this.mode == "juniorHigh"){
                const genre = subject.genre;
                if(genre == "other"){
                  this.assignments.push(new Assignment(newId, homeroomId, subjectId, [homeroom.mainTeacherId, homeroom.assistantTeacherId]));
                } else {
                  this.assignments.push(new Assignment(newId, homeroomId, subjectId, subject.teacherIds.filter(tid => teacherIds.includes(tid))));
                }
              } else {
                const mainSubject = this.subjects.find(s => s.id === subject.mainSubjectId);
                const genre = mainSubject.genre;
                if(genre == "other"){
                  this.assignments.push(new Assignment(newId, homeroomId, subjectId, [homeroom.mainTeacherId, homeroom.assistantTeacherId]));
                } else {
                  this.assignments.push(new Assignment(newId, homeroomId, subjectId, []));
                }
              }
            }
          }
        }
        break;
      }
    }
  }
  removeSubjectFromHomeroom(subjectId, homeroomId){
    for(let i=0; i<this.classroomData.homes.length; i++){
      if(this.classroomData.homes[i].id == homeroomId){
        this.classroomData.homes[i].subjectIds = this.classroomData.homes[i].subjectIds.filter((sid) => sid!== subjectId);
      }
    }
  }

  // 教科と教師
  addTeacherToSubject(subjectId, teacherId){
    if(["juniorHigh", "high"].includes(this.mode)){
      for(let i=0; i<this.subjects.length; i++){
        if(this.subjects[i].id == subjectId){
          if(this.subjects[i] instanceof SubSubject){
            for(let j=0; j<this.subjects.length; j++){
              if(this.subjects[j].id == this.subjects[i].mainSubjectId){
                this.subjects[j].addTeacher(teacherId);
                break;
              }
            }
          } else if(this.subjects[i] instanceof Subject){
            this.subjects[i].addTeacher(teacherId)
          }
          break;
        }
      }
    }
  }
  removeTeacherFromSubject(subjectId, teacherId){
    for(let i=0; i<this.subjects.length; i++){
      if(this.subjects[i].id == subjectId){
        if(this.subjects[i] instanceof SubSubject){
          for(let j=0; j<this.subjects.length; j++){
            if(this.subjects[j].id == this.subjects[i].mainSubjectId){
              this.subjects[j].removeTeacher(teacherId);
              const subjectIds = this.subjects.filter(s => s.mainSubjectId == this.subjects[j].id).map(s => s.id);
              for(let k=0; k<this.assignments.length; k++){
                if(subjectIds.includes(this.assignments[k].subjectId)){
                  this.assignments[k].removeTeacher(teacherId);
                }
              }
              break;
            }
          }
        } else if(this.subjects[i] instanceof Subject){
          this.subjects[i].removeTeacher(teacherId);
          for(let k=0; k<this.assignments.length; k++){
            if(this.assignments[k].subjectId == this.subjects[i].id){
              this.assignments[k].removeTeacher(teacherId);
            }
          }
        }
        break;
      }
    }
  }
  getChargedSubjects(teacherId){
    const subjects = this.subjects.filter(s => s.teacherIds?.includes(teacherId));
    const returnArray = [];
    for(const subject of subjects){
      returnArray.push({id: subject.id, name: subject.name});
    }
    return returnArray;
  }

  // 教科と特別教室
  addSpecialClassroomToSubject(subjectId, classroomId) {
    for(let i=0; i<this.subjects.length; i++){
      if(this.subjects[i].id == subjectId){
        this.subjects[i].addSpecialClassroom(classroomId);
        if(!(this.subjects[i] instanceof SubSubject) && this.mode =="high"){
          for (let j=0; j<this.subjects.length; j++){
            if(this.subjects[j].mainSubjectId == subjectId){
              this.subjects[j].addSpecialClassroom(classroomId);
            }
          }
        }
        break;
      }
    }
  }
  removeSpecialClassroomFromSubject(subjectId, classroomId) {
    for(let i=0; i<this.subjects.length; i++){
      if(this.subjects[i].id == subjectId){
        this.subjects[i].removeSpecialClassroom(classroomId);
        if(!(this.subjects[i] instanceof SubSubject) && this.mode =="high"){
          for (let j=0; j<this.subjects.length; j++){
            if(this.subjects[j].mainSubjectId == subjectId){
              this.subjects[j].removeSpecialClassroom(classroomId);
            }
          }
        }
        break;
      }
    }
  }

  // ホームルームと教師
  setMainTeacher(homeroomId, teacherId){
    for(let i=0; i<this.classroomData.homes.length; i++){
      if(this.classroomData.homes[i].id == homeroomId){
        this.classroomData.homes[i].mainTeacherId = teacherId;
        break;
      }
    }
  }
  setAssistantTeacher(homeroomId, teacherId){
    for(let i=0; i<this.classroomData.homes.length; i++){
      if(this.classroomData.homes[i].id == homeroomId){
        this.classroomData.homes[i].assistantTeacherId = teacherId;
        break;
      }
    }
  }

  // 教師と担当
  assignTeacher(assignmentId, teacherId) {
    for(let i=0; i<this.assignments.length; i++){
      if(this.assignments[i].id == assignmentId){
        this.assignments[i].addTeacher(teacherId);
        if(["juniorHigh", "high"].includes(this.mode)){
          const assignedSubjectId = this.assignments[i].subjectId;
          const assignedSubject = this.subjects.find(s => s.id === assignedSubjectId);
          if(assignedSubject instanceof SubSubject){
            const mainSubject = this.subjects.find(s => s.id === assignedSubject.mainSubjectId);
            if(mainSubject.genre != "other"){
              for(let j=0; j<this.subjects.length; j++){
                if(this.subjects[j].id == mainSubject.id){
                  this.subjects[j].addTeacher(teacherId);
                  break;
                }
              }
            }
          } else if(assignedSubject instanceof Subject) {
            if(assignedSubject.genre != "other"){
              for(let j=0; j<this.subjects.length; j++){
                if(this.subjects[j].id == assignedSubject.id){
                  this.subjects[j].addTeacher(teacherId);
                  break;
                }
              }
            }
          }
        }
        break;
      }
    }
  }
  unassignTeacher(assignmentId, teacherId) {
    for(let i=0; i<this.assignments.length; i++){
      if(this.assignments[i].id == assignmentId){
        this.assignments[i].removeTeacher(teacherId);
        break;
      }
    }
  }

  // 検索用
  getAssignmentObj(id){
    const assignment = this.assignments.find(a => a.id == id);
    if(assignment){
      const assignmentObj = {}
      for(const key of Object.keys(assignment)){
        if(key == "subjectId"){
          assignmentObj.subject = this.getSubjectObj(assignment.subjectId);
        } else if(key == "teacherIds"){
          assignmentObj.teachers = [];
          for(const teacherId of assignment.teacherIds){
            const teacher = this.getTeacherObj(teacherId);
            if(teacher){
              assignmentObj.teachers.push(teacher);
            }
          }
        } else if(![null, undefined].includes(assignment[key]) && typeof assignment[key] != "function"){
          assignmentObj[key] = assignment[key];
        }
      }
      return assignmentObj;
    }
    return null;
  }
  getSubjectObj(id){
    const subject = this.subjects.find(s => s.id == id);
    if(subject instanceof SubSubject){
      const subjectObj = {};
      for(const key of Object.keys(subject.toObject())){
        if(key == "specialClassroomIds"){
          subjectObj.specialRooms = [];
          for(const specialRoomId of subject.specialClassroomIds){
            const specialRoom = this.classroomData.specials.find(s => s.id == specialRoomId);
            if(specialRoom){
              subjectObj.specialRooms.push(specialRoom);
            }
          }
        } else if(subject[key] && key != "mainSubjectId"){
          subjectObj[key] = subject[key];
        }
      }
      const mainSubject = this.subjects.find(s => s.id == subject.mainSubjectId);
      subjectObj.teachers = [];
      for(const teacherId of mainSubject.teacherIds){
        const teacher = this.getTeacherObj(teacherId);
        if(teacher){
          subjectObj.teachers.push(teacher);
        }
      }
      subjectObj.main = {id: mainSubject.id, name: mainSubject.name};
      subjectObj.genre = mainSubject.genre;
      return subjectObj;
    } else if (subject instanceof Subject){
      const subjectObj = {};
      for(const key of Object.keys(subject.toObject())){
        if(key == "teacherIds"){
          subjectObj.teachers = [];
          for(const teacherId of subject.teacherIds){
            const teacher = this.getTeacherObj(teacherId);
            if(teacher){
              subjectObj.teachers.push(teacher);
            }
          }
        } else if(key == "specialClassroomIds"){
          subjectObj.specialRooms = [];
          for(const specialRoomId of subject.specialClassroomIds){
            const specialRoom = this.classroomData.specials.find(s => s.id == specialRoomId);
            if(specialRoom){
              subjectObj.specialRooms.push(specialRoom);
            }
          }
        } else {
          subjectObj[key] = subject[key];
        }
        if(this.mode == "high"){
          subjectObj.subSubjects = [];
          for(const subSubject of this.subjects.filter(s => s.mainSubjectId == subject.id)){
            subjectObj.subSubjects.push(this.getSubjectObj(subSubject.id));
          }
        }
      }
      return subjectObj;
    }
    return null;
  }
  getTeacherObj(id){
    const teacher = this.teachers.find(t => t.id == id)
    if(teacher){
      const teacherObj = teacher;
      teacherObj.subjects = this.getChargedSubjects(teacher.id);
      return teacherObj;
    }
    return null;
  }

  updateYear(stayTeacherNames) {
    const newConfig = new TimetableConfigData(this.mode);
    
    // 各学年のクラス数を移行
    for(let i=1; i<this.gradesData.gradeLength; i++){
      newConfig.gradesData.set(i+1, this.gradesData.get(i));
    }
    newConfig.gradesData.set(1,0);

    
    const keptData = {classroom: {}, teacher: {}};
    // 転任や退職をしないで学校に残る教師の一覧のみ移行（IDを新しく割り振る）
    for(const teachernameObj of Object.values(this.teacherNameData).filter((nameObj) => stayTeacherNames.includes(nameObj.name))){
      const newTeacherId = newConfig.generateId("teacher");
      keptData.teacher[teachernameObj.id] = newTeacherId;
      newConfig.teacherNameData[newTeacherId] = {id: newTeacherId, name: teachernameObj.name };
    }

    // 教室情報を移行（IDを新しく割り振る）
    newConfig.classroomData = { special: {}, home: newConfig.gradesData.getHomerooms() };
    for(const classroom of Object.values(this.classroomData.special)){
      const newClassroomId = newConfig.generateId("room");
      newConfig.classroomData.special[newClassroomId] = {name: classroom.name, id: newClassroomId };
      keptData.classroom[classroom.id] = newClassroomId;
    }
    
    // 教科情報を移行（IDを新しく割り振る）
    // 担当教師は転任や退職をしないで学校に残る教師のみ移行
    // ただし、担当教師と教室のデータはIDを刷新したためそれに合わせる。
    for(const oldSubject of Object.values(this.subjectData)){
      const sid = newConfig.addSubject(oldSubject.name);
      newConfig.subjectData[sid].specialClassroomIds = oldSubject.specialClassroomIds.map(classroomId => keptData.classroom[classroomId]);
      newConfig.subjectData[sid].teacherIds = oldSubject.teacherIds.filter((teacherId) => Object.keys(keptData.teacher).includes(teacherId)).map( oldTeacherId => keptData.teacher[oldTeacherId]);
    }

    return newConfig;
  }

  toObject() {
    const toObjectUnit = function(value) {
      if([null, undefined].includes(value)){
        return null
      } else if(Array.isArray(value)){
        const jsonArray = [];
        for(const v of value){
          jsonArray.push(toObjectUnit(v));
        }
        return jsonArray;
      } else if(value instanceof GradesData){
        return value.toObject();
      } else if(typeof value == "object"){
        const jsonObj = {};
        for (const [key, v] of Object.entries(value)) {
          if (v instanceof Subject || v instanceof Assignment) {
            jsonObj[key] = v.toObject();
          } else{
            jsonObj[key] = toObjectUnit(v);
          }
        }
        return jsonObj;
      } else if(typeof value != "function") {
        return value;
      }
    };
    const jsonObj = {};
    for (const [key, value] of Object.entries(this)) {
      const convertedValue = toObjectUnit(value);
      if(convertedValue){
        jsonObj[key] = convertedValue;
      }
    }
    return jsonObj;
  }

  static create(
    mode = "juniorHigh",
    gradesData,
    subjects = [],
    assignments = [],
    teachers = [],
    headTeacherData = {"1": "", "2": "", "3": ""},
    classroomData = {homes: [], specials: []},
    idCounter = {},
    schoolYear){
      
    // 小・中・高のいずれかに含まれているか判定
    if(TimetableConfigData.suppotedMode.includes(mode)){
      const args = [mode];
      // 学年情報を管理
      if (gradesData instanceof GradesData){
        args.push(gradesData);
      } else if(gradesData) {
        args.push(GradesData.fromObject(gradesData));
      } else {
        // 学年の数を小学校なら6、中高なら3に設定
        args.push(new GradesData(mode == "elemental" ? 6: 3));
      }
      args.push(subjects, assignments, teachers, headTeacherData, classroomData, idCounter, schoolYear);
      return new TimetableConfigData(...args);
    } else {
      return null
    }
  }

  static suppotedMode = ["elemental", "juniorHigh", "high"];
}
