import React from 'react';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';

//Containers
import Layout from './containers/Layout';

//Pages
import Home from './pages/Home';
import AnotherPage from './pages/AnotherPage';

//Define Routes


var routes = (
    <Router history={browserHistory}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Home} />
            <Route path="another-page" component={AnotherPage} />
        </Route>
    </Router>
)

export default routes;