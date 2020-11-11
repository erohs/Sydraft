import React from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Board from "./Pages/Board/Board";

function App() {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route exact path="/" component={Board} />
      </Switch>
    </Router>
  );
}

export default App;
