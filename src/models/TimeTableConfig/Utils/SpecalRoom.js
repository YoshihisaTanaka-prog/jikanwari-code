import { Util, Editor } from "./_Parent";

class SpecialRoomEditor extends Editor {
  getObj(){
    const parent = this.relationship.get(this).data;
    return parent.classroomData.specials.find(s => s.id = this.id);
  }
  
  update(name){
    const parent = this.relationship.get(this).data;
    for(let i=0; i<parent.classroomData.specials.length; i++){
      if(parent.classroomData.specials[i].id == this.id){
        parent.classroomData.specials[i].name = name
        break;
      }
    }
    return this;
  }

  delete(){
    const parent = this.relationship.get(this).data;
    parent.classroomData.specials = parent.classroomData.specials.filter((room) => room.id!= this.id);
    for(let i=0; i<parent.subjects.length; i++){
      parent.subjects[i].specialClassroomIds = parent.subjects[i].specialClassroomIds.filter((cid) => cid!= this.id);
    }
  }

  addToSubject(id){
    const parent = this.relationship.get(this).data;
    parent.addSpecialClassroomToSubject(id, this.id);
    return this;
  }

  removeFromSubject(id){
    const parent = this.relationship.get(this).data;
    parent.removeSpecialClassroomFromSubject(id, this.id);
    return this;
  }
}

export default class SpecicalRoomUtil extends Util {
  constructor(relationship){
    super(relationship);
    this.editor = SpecialRoomEditor;
  }
  
  add(name){
    const parent = this.relationship.get(this).data;
    const classroom = parent.classroomData.specials.find(c => c.name == name);
    if(classroom){
      return this.setId(classroom.id)
    } else {
      const classroomId = parent.generateId("room");
      parent.classroomData.specials.push({id: classroomId, name: name});
      return this.setId(classroomId);
    }
  }

  getList(){
    const parent = this.relationship.get(this).data;
    return parent.classroomData.specials;
  }
}