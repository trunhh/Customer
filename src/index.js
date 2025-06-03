import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Provider } from "react-redux";

import "./index.css";
import {Routers} from "./Router";

import store from "./Redux/Store/index";

import {NotificationContainer} from 'react-notifications';
import {LoadingAlert} from './Common';
import 'react-notifications/lib/notifications.css';
ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
        <Route path="/" component={Routers} />
        </Switch>
      </BrowserRouter>
      <NotificationContainer/>
      <LoadingAlert />
    </Provider>,
  document.getElementById('root')
);
