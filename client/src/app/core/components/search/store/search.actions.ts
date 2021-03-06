import { LatLngLiteral } from '@agm/core';
import { Action } from '@ngrx/store';

import { Filter } from './../../../../models/filter.model';

export const NAV_SEARCH = 'NAV_SEARCH';
export const HOME_SEARCH = 'HOME_SEARCH';
export const SET_SEARCH_LOADING = 'SET_SEARCH_LOADING';
export const SEARCH_COMPLETED = 'SEARCH_COMPLETED';
export const SET_SEARCH_CATEGORY = 'SET_SEARCH_CATEGORY';

export class NavSearch implements Action {
  readonly type = NAV_SEARCH;

  constructor(public payload: string) { }
}

export class HomeSearch implements Action {
  readonly type = HOME_SEARCH;

  constructor(public payload: { location: string, coordinates: LatLngLiteral, selectedCategory: Filter }) { }
}

export class SetSearchLoading implements Action {
  readonly type = SET_SEARCH_LOADING;

  constructor(public payload: boolean) { }
}

export class SetSearchCategory implements Action {
  readonly type = SET_SEARCH_CATEGORY;

  constructor(public payload: number) { }
}

export class SearchCompleted implements Action {
  readonly type = SEARCH_COMPLETED;
}

export type Action =
  | NavSearch
  | HomeSearch
  | SetSearchLoading
  | SetSearchCategory
  | SearchCompleted;
