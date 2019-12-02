import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {IntlProvider} from 'react-intl';
import localeEsMessages from "./locales/es.json";
import localeEnMessages from "./locales/en.json";

let language= navigator.language||navigator.userLanguage;
let message=language==="en"?localeEnMessages:localeEsMessages;

ReactDOM.render(<IntlProvider locale={language} messages= {message}>
    <App idioma={language}/>
</IntlProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
