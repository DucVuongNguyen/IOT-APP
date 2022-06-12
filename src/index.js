import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';
import reportWebVitals from './reportWebVitals';
import './global.scss';
import { Provider } from 'react-redux'
import { legacy_createStore as createStore } from 'redux'
import rootReducer from './store/reducer/rootReducer'
import { BrowserRouter } from "react-router-dom";

const reduxStore = createStore(rootReducer);


ReactDOM.render(
  <Provider store={reduxStore}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
