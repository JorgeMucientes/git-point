import { AsyncStorage } from 'react-native';

import { delay, resetNavigationTo, configureLocale } from 'utils';
import { saveLanguage } from 'locale';

import {
  fetchAccessToken,
  fetchAuthUser,
  fetchAuthUserOrgs,
  fetchUserOrgs,
  fetchUserEvents,
  fetchStarCount,
} from 'api';
import {
  LOGIN,
  LOGOUT,
  GET_AUTH_USER,
  GET_AUTH_ORGS,
  GET_EVENTS,
  CHANGE_LANGUAGE,
  GET_AUTH_STAR_COUNT,
} from './auth.type';

export const auth = (code, state, navigation) => {
  return dispatch => {
    dispatch({ type: LOGIN.PENDING });

    delay(fetchAccessToken(code, state), 2000)
      .then(data => {
        dispatch({
          type: LOGIN.SUCCESS,
          payload: data.access_token,
        });

        resetNavigationTo('Main', navigation);
      })
      .catch(error => {
        dispatch({
          type: LOGIN.ERROR,
          payload: error,
        });
      });
  };
};

export const signOut = () => {
  return dispatch => {
    dispatch({ type: LOGOUT.PENDING });

    return AsyncStorage.clear()
      .then(() => {
        dispatch({
          type: LOGOUT.SUCCESS,
        });
      })
      .catch(error => {
        dispatch({
          type: LOGOUT.ERROR,
          payload: error,
        });
      });
  };
};

export const getUser = () => {
  return (dispatch, getState) => {
    const accessToken = getState().auth.accessToken;

    dispatch({ type: GET_AUTH_USER.PENDING });

    fetchAuthUser(accessToken)
      .then(data => {
        dispatch({
          type: GET_AUTH_USER.SUCCESS,
          payload: data,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_AUTH_USER.ERROR,
          payload: error,
        });
      });
  };
};

export const getStarCount = () => {
  return (dispatch, getState) => {
    const user = getState().auth.user.login;

    dispatch({ type: GET_AUTH_STAR_COUNT.PENDING });

    fetchStarCount(user)
      .then(data => {
        dispatch({
          type: GET_AUTH_STAR_COUNT.SUCCESS,
          payload: data,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_AUTH_STAR_COUNT.ERROR,
          payload: error,
        });
      });
  };
};

export const getOrgs = () => {
  return (dispatch, getState) => {
    const accessToken = getState().auth.accessToken;
    const login = getState().auth.user.login;

    dispatch({ type: GET_AUTH_ORGS.PENDING });

    fetchUserOrgs(login, accessToken)
      .then(data => {
        dispatch({
          type: GET_AUTH_ORGS.SUCCESS,
          payload: data,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_AUTH_ORGS.ERROR,
          payload: error,
        });
      });
  };
};

export const getUserEvents = user => {
  return (dispatch, getState) => {
    const accessToken = getState().auth.accessToken;

    dispatch({ type: GET_EVENTS.PENDING });

    fetchUserEvents(user, accessToken)
      .then(data => {
        dispatch({
          type: GET_EVENTS.SUCCESS,
          payload: data,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_EVENTS.ERROR,
          payload: error,
        });
      });
  };
};

export const changeLanguage = lang => {
  return dispatch => {
    dispatch({ type: CHANGE_LANGUAGE.SUCCESS, payload: lang });

    saveLanguage(lang);
    configureLocale(lang);
  };
};
