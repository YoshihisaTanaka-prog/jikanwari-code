// 全体管理データ
import TimetableConfigData from './TimeTableConfig/Data/Main';

// Utilをまとめてインポート
import GradesUtil from './TimeTableConfig/Utils/Grades';
import SubjectUtil from './TimeTableConfig/Utils/Subject';
import HomeroomUtil from './TimeTableConfig/Utils/Homeroom';
import TeacherUtil from './TimeTableConfig/Utils/Teacher';
import AssignmentUtil from './TimeTableConfig/Utils/Assignment';
import SpecicalRoomUtil from './TimeTableConfig/Utils/SpecalRoom';


class TimetableConfig {
  constructor(){
    Object.defineProperty(this, "data", {value: null, writable: true, enumerable: false});
    Object.defineProperty(this, "createFromObject", {value: function(data) {
      return TimetableConfigData.create(
        data.mode,
        data.gradesData,
        data.subjects,
        data.assignments,
        data.teachers,
        data.headTeacherData,
        data.classroomData,
        data.idCounter,
        data.schoolYear,
      );
    }, writable: false, enumerable: false});

    const relationship = new WeakMap();
    const gradesUtil = new GradesUtil(relationship);
    relationship.set(gradesUtil, this);
    this.gradesUtil = gradesUtil;
    const subjectUtil = new SubjectUtil(relationship);
    relationship.set(subjectUtil, this);
    this.subjectUtil = subjectUtil
    const homeroomUtil = new HomeroomUtil(relationship);
    relationship.set(homeroomUtil, this);
    this.homeroomUtil = homeroomUtil;
    const teacherUtil = new TeacherUtil(relationship);
    relationship.set(teacherUtil, this);
    this.teacherUtil = teacherUtil;
    const assignmentUtil = new AssignmentUtil(relationship);
    relationship.set(assignmentUtil, this);
    this.assignmentUtil = assignmentUtil;
    const specicalRoomUtil = new SpecicalRoomUtil(relationship);
    relationship.set(specicalRoomUtil, this);
    this.specicalRoomUtil = specicalRoomUtil;
  }

  toObject() {
    return this.data.toObject();
  }

  updateYear(stayTeacherNames){
    const [newData, oldData] = [this.data.updateYear(stayTeacherNames),this.data];
    this.data = newData;
    return {newData, oldData};
  }

  updateData(data){
    if (typeof data == "string"){
      if(data == ""){
        this.data = TimetableConfigData.create();
      } else if(["elemental", "juniorHigh", "high"].includes(data)){
        this.data = TimetableConfigData.create(data);
      } else {
        try {
          const pasedData = JSON.parse(data);
          this.data = this.createFromObject(pasedData);
        } catch (e) {
          console.error("Invalid JSON input for TimetableConfigData:", e);
          this.data = TimetableConfigData.create();
        }
      }
    } else if(typeof data == "object") {
      this.data = this.createFromObject(data);
    } else if([null, undefined].includes(data)){
      this.data = TimetableConfigData.create();
    } else {
      console.error("Invalid input for TimetableConfigData");
      this.data = TimetableConfigData.create();
    }
    this.mode = this.data?.mode;
  }

  static read(data){
    const config = new TimetableConfig();
    if([null, undefined, ""].includes(data)){
      config.data = TimetableConfigData.create();
    } else {
      try {
        const pasedData = JSON.parse(data);
        config.data = config.createFromObject(pasedData);
      } catch (e) {
        console.error("Invalid JSON input for TimetableConfigData:", e);
        config.data = TimetableConfigData.create();
      }
    }
    config.mode = config.data?.mode;
    return config
  }

  static genres = [{id: "main", name: "主要教科"}, {id: "pe", name: "体育"}, {id: "sub", name: "体育以外の副教科"}, {id: "other", name: "その他"}];
}

export default TimetableConfig;