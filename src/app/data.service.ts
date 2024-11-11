import { Injectable } from '@angular/core';
import { Firestore,collection,addDoc,collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private collectionName="employeeInfo";
  constructor(private firestore:Firestore) { }
  async addData(data:any):Promise<void>{
    const coll=collection(this.firestore,this.collectionName);
    await addDoc(coll,data)
  }
  getData():Observable<any[]>{
    const coll=collection(this.firestore,this.collectionName);
    return collectionData(coll);
  }
}
