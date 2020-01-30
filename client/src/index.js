import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';

import adminReducers from './Reducers/adminReducers';

import 'antd/dist/antd.css';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

import './index.css';

const store = createStore(
  adminReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);


ReactDOM.render( 
<Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>, document.getElementById('root'),
);

