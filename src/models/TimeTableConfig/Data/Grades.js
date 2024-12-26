// 学年のクラス情報
export default class GradesData extends Map {
  constructor(gradeLength=3) {
    super([]);
    this.gradeLength = gradeLength;
    for(let i=1; i<=6; i++){
      this.set(i, 0);
    }
  }

  updateGradeLength(gradeLength) {
    this.gradeLength = gradeLength;
  }

  // 学年毎に教室数を更新
  update(gradeNumber, numberOfClasses) {
    if(this.has(gradeNumber)){
      this.set(gradeNumber, numberOfClasses);
    }
  }

  // Homerooms（教室数）を取得する
  getHomerooms() {
    const returnArray = [];
    for(let i=1; i<=this.gradeLength; i++) {
      for(let j=1; j<=this.get(i); j++) {
        returnArray.push({id: `room-${i}-${j}`, name: `${i}年${j}組`});
      }
    }
    return returnArray;
  }

  toObject(){
    const returnObject = {gradeLength: this.gradeLength, data: {}};
    for(let i=1; i<=6; i++){
      returnObject.data[`${i}`] = this.get(i) || 0;
    }
    return returnObject;
  }

  // オブジェクトからGradesDataインスタンスを作成する
  static fromObject(data) {
    if([null, undefined].includes(data)){
      return new GradesData();
    } else if(Array.isArray(data)){
      const gradesData = new GradesData(data.length);
      for(let i=1; i<=data.length; i++){
        gradesData.set(i, data[i-1]);
      }
      gradesData;
      return gradesData;
    } else if(typeof data === 'object'){
      if(data.gradeLength && data.data){
        const gradesData = new GradesData(data.gradeLength);
        for(let key of Object.keys(data.data)){
          gradesData.set(parseInt(key), data.data[key]);
        }
        gradesData;
        return gradesData;
      } else {
        return new GradesData();
      }
    } else if(typeof data == "number"){
      const gradesData = new GradesData(data);
      return gradesData;
    } else {
      return null;
    }
  }
}