import * as authActions from './auth.actions';
import { User } from './../../../models/user.model';

export interface State {
  authenticate: boolean;
  token: string;
  user: User;
  loading: boolean;
}

const initialState: State = {
  authenticate: false,
  token: null,
  user: null,
  loading: false
};

export function authReducer(state = initialState, action: authActions.Action): State {
  switch (action.type) {
    case authActions.LOGIN:
    case authActions.REGISTER:
    case authActions.SOCIAL_LOGIN:
    case authActions.AUTHENTICATE:
     return {
       ...state,
       loading: true
     };
    case authActions.LOGIN_SUCCESS:
    case authActions.SOCIAL_LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        authenticate: true,
        loading: false
      };
    case authActions.LOGIN_FAILURE:
      return {
        ...state,
        loading: false
      };
    case authActions.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
