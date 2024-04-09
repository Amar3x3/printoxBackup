import { applyMiddleware, combineReducers, createStore } from 'redux'
import peerReducer from './Peer'
import thunk from 'redux-thunk';
import userFilesReducer from './UserFiles';
import fileStatusReducer from './FilesStatus';

const reducer = combineReducers({
    SenderPeer: peerReducer,
    customer: userFilesReducer,
    print: fileStatusReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;


