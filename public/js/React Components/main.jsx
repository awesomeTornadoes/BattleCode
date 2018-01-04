import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';

injectTapEventPlugin();// for mobile reactivity on tap

ReactDom.render(<App />, document.getElementById('root'));
