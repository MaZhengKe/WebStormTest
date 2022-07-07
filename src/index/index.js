import _ from 'lodash';
import './style.css'
import Icon from './C.png'

import printMe from "./print";

function component() {
    var element = document.createElement('div');

    var btn = document.createElement('button');
    btn.innerHTML = 'click';
    btn.onclick = printMe;


    // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
    element.innerHTML = _.join(['Hello', 'webpackab'], ' ');
    element.classList.add('hello');

    var myIcon = new Image();
    myIcon.src = Icon;

    // element.appendChild(myIcon);

    element.appendChild(btn);
    return element;
}

document.body.appendChild(component());