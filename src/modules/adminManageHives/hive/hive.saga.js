import {
  put, takeLatest, all,
} from 'redux-saga/effects';
import request from '../../../services/Net';
import {
  ADD_PHOTO, ADD_PHOTO_FAIL, ADD_PHOTO_SUCCESS,
  UPDATE_INFO,
  UPDATE_INFO_FAIL,
  UPDATE_INFO_SUCCESS,
} from './hive.actions';


function* updateInfos({ id, data }) {
  try {
    yield request({
      url: `/hive/${id}`,
      method: 'patch',
      data,
    });
    yield put({ type: UPDATE_INFO_SUCCESS, id, data });
  } catch (e) {
    yield put({ type: UPDATE_INFO_FAIL });
  }
}

function* addPhoto({ id, file }) {
  try {
    const data = yield new FormData();
    yield data.append('id', id);
    yield data.append('img', file);
    yield request({
      url: '/hive/photo',
      method: 'post',
      data,
      header: {
        'content-type': 'multipart/form-data',
      },
    });
    yield put({ type: ADD_PHOTO_SUCCESS });
  } catch (e) {
    yield put({ type: ADD_PHOTO_FAIL });
  }
}

function* listen() {
  yield takeLatest(UPDATE_INFO, updateInfos);
  yield takeLatest(ADD_PHOTO, addPhoto);
}

export default function* rootSaga() {
  yield all([
    listen(),
  ]);
}