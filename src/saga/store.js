import {applyMiddleware, combineReducers, legacy_createStore as createStore, compose} from "redux";
import React from "react";
import createSagaMiddleware from "redux-saga";
import SourceCustomDataReducer from "./reducer/SourceCustomDataReducer";


const sagaMiddleWare= createSagaMiddleware();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const rootReducer=combineReducers({sourceCustom: SourceCustomDataReducer});

const store= createStore(rootReducer,composeEnhancer(applyMiddleware(sagaMiddleWare)));
// sagaMiddleWare.run(rootSaga);
export {store};