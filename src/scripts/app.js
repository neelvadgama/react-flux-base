var debug = require('debug')('react-flux-template:app:bootstrap');
import React from 'react';
import { render } from 'react-dom';
import router from './router';

if (process.env.NODE_ENV === 'development') {
    var dbg = 'react-flux-template:*';
    require('debug').enable(dbg);
    debug('starting with debug', dbg);
}

render(router, document.getElementById('app'));