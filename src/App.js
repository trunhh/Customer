import React from "react";
import { Route, Switch, BrowserRouter, Link } from 'react-router-dom';
import { Routers } from "./Router/Routers";

export const AppHome = () => {
  return (
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  );
}