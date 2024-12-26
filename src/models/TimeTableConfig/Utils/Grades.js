import { Util } from "./_Parent";
export default class GradesUtil extends Util {  
  getData(){
    const parent = this.relationship.get(this).data;
    const returnObject = {};
    for(let i=1; i<=parent.gradesData.gradeLength; i++) {
      returnObject[`${i}`] = parent.gradesData.get(i);
    }
    return returnObject
  }
  update(grade, numberOfClasses) {
    const parent = this.relationship.get(this).data;

    const convertedGrade = typeof grade === "number"? grade : parseInt(grade);
    const convertedNumOfClasses = typeof numberOfClasses === "number"? numberOfClasses : parseInt(numberOfClasses);

    parent.gradesData.update(convertedGrade, convertedNumOfClasses);
    const homerooms = parent.gradesData.getHomerooms();
    for(const homeroom of homerooms){
      if(!parent.classroomData.homes.map(h => h.id).includes(homeroom.id)){
        const homeroomObj = homeroom;
        homeroomObj.mainTeacherId = "";
        homeroomObj.assistantTeacherId = "";
        homeroomObj.subjectIds = [];
        parent.classroomData.homes.push(homeroomObj);
      }
    }
    return this;
  }
}