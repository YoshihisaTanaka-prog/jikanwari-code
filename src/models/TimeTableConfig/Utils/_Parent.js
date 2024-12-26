export class Util {
  constructor(relationship){
    Object.defineProperty(this, "relationship", {value: relationship, writable: true, enumerable: false});
  }

  done(){
    return this.relationship.get(this);
  }

  toObject(){
    return this.relationship.get(this).toObject();
  }
}

export class Editor {
  constructor(id, relationship){
    Object.defineProperty(this, "relationship", {value: relationship, writable: true, enumerable: false});
    Object.defineProperty(this, "id", {value: id, writable: true, enumerable: false});
  }

  done(){
    return this.relationship.get(this);
  }

  toObject(){
    return this.relationship.get(this).toObject();
  }
}