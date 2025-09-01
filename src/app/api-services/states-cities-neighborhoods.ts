import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

const chars = Array.from(Array(26)).map((e, i) => i + 65).map(item => String.fromCharCode(item))

const MOCK_States: APIStatesItem[] = Array.from({length: 20}).map((value, index) => ({
  stateId: chars[Math.floor(Math.random()*chars.length)] + chars[Math.floor(Math.random()*chars.length)],
  stateName: Array.from({length: 5 + Math.floor(Math.random()*20)}).map(
    (item, index) => chars[Math.floor(Math.random()*chars.length)].toLowerCase()
  ).join('')
}))

const MOCK_Cities: APICitiesItem[] = Array.from({length: 1000}).map((value, index) => ({
  stateId: MOCK_States[Math.floor(Math.random() * MOCK_States.length)].stateId,
  cityId: index + 1,
  cityName: Array.from({length: 5 + Math.floor(Math.random()*20)}).map(
    (item, index) => chars[Math.floor(Math.random()*chars.length)].toLowerCase()
  ).join('')
}))

@Injectable({
	providedIn: 'root'
})
export class APIStatesCitiesNeighborhoods {

	constructor(
	) { }

	getStates() {
    return of<APIStatesItem[]>(MOCK_States).pipe(delay(1500))
  }

	getCities(stateId: string) {
    return of<APICitiesItem[]>(MOCK_Cities.filter(
      city => city.stateId === stateId
    )).pipe(delay(1500))
  }

}

export interface APIStatesItem {
  stateId: string;
  stateName: string;
}

export interface APICitiesItem {
  stateId: string;
  cityId: number;
  cityName: string;
}
