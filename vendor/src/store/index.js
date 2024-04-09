import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import VendorPeerReducer from './VendorPeer'

const reducer = combineReducers({
    vendorPeer: VendorPeerReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;