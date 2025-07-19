import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

const chars = Array.from(Array(26)).map((e, i) => i + 65).map(item => String.fromCharCode(item))

@Injectable({
	providedIn: 'root'
})
export class APIStatesCitiesNeighborhoods {

	constructor(
	) { }

	getStates() {
    return of<APIStatesItem[]>(
      Array.from({length: 1000}).map((value, index) => ({
        stateId: chars[Math.floor(Math.random()*chars.length)] + chars[Math.floor(Math.random()*chars.length)],
        stateName: Array.from({length: 5 + Math.floor(Math.random()*20)}).map(
          (item, index) => chars[Math.floor(Math.random()*chars.length)].toLowerCase()
        ).join('')
      }))
    ).pipe(delay(1500))
  }

}

export interface APIStatesItem {
  stateId: string;
  stateName: string;
}
