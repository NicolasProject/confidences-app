
export const FETCH_HIVE = 'admin/manage/hives/hive/FETCH_HIVE';
export const FETCH_HIVE_SUCCESS = 'admin/manage/hives/hive/FETCH_HIVE_SUCCESS';
export const FETCH_HIVE_FAIL = 'admin/manage/hives/hive/FETCH_HIVE_FAIL';

export const fetchHive = id => ({ type: FETCH_HIVE, id });

export const UPDATE_INFO = 'admin/manage/hives/hive/UPDATE_INFO';
export const UPDATE_INFO_SUCCESS = 'admin/manage/hives/hive/UPDATE_INFO_SUCCESS';
export const UPDATE_INFO_FAIL = 'admin/manage/hives/hive/UPDATE_INFO_FAIL';

export const updateInfo = (id, key, value) => ({ type: UPDATE_INFO, id, data: { [key]: value } });

export const ADD_PHOTO = 'admin/manage/hives/hive/ADD_PHOTO';
export const ADD_PHOTO_SUCCESS = 'admin/manage/hives/hive/ADD_PHOTO_SUCCESS';
export const ADD_PHOTO_FAIL = 'admin/manage/hives/hive/ADD_PHOTO_FAIL';

export const addPhoto = (id, file) => ({ type: ADD_PHOTO, id, file });
