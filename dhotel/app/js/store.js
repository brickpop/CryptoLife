import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'

// Declare the middleware methods
const middleware = []

// Create the store
const store = createStore(rootReducer, applyMiddleware(...middleware))

export default store
