import {createAction, handleActions} from 'redux-actions';
import createRequestSaga, { createRequestActionTypes} from '../lib/createRequestSaga';
import * as projectAPI from '../lib/api/project';
import { takeLatest} from 'redux-saga/effects';

const INITIALIZE = 'check/INITIALIZE';
const CHANGE_FIELD = 'check/CHANGE_FIELD';

const [
    CHECK_PROJECT,
    CHECK_PROJECT_SUCCESS,
    CHECK_PROJECT_FAILURE
] = createRequestActionTypes('check/CHECK_PROJECT');

export const initialize = createAction(INITIALIZE);
export const changeField = createAction(CHANGE_FIELD, ({key, value})=> ({
    key,
    value
}));

export const checkPick = createAction(CHECK_PROJECT, ({p_pick, project}) => ({
    p_pick, project
}));



const checkPickSaga = createRequestSaga(CHECK_PROJECT, projectAPI.checkPick);
export function * pickButton2Saga(){
    yield takeLatest(CHECK_PROJECT, checkPickSaga);
}

const initialState = {
    
    upsert:true,
    p_pick: 'Y',
    project: null,
    projectError: null,
};

const pickButton2 = handleActions(
    {
        [INITIALIZE] : state => initialState,
        [CHANGE_FIELD] : (state, { payload: {key, value}}) => ({
            ...state,
            [key] : value
        }),
        [CHECK_PROJECT] : state => ({
            ...state,
            project: null,
            projectError: null
        }),
        [CHECK_PROJECT_SUCCESS] : (state, {payload: project,}) => ({
            ...state,
            project
    
        }),
        [CHECK_PROJECT_FAILURE] : (state, {payload : projectError}) =>({
            ...state,
            projectError
        }),
    },
    initialState
);

export default pickButton2;