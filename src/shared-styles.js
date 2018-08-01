/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement( 'template' );
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
    h1 {
      margin: 0;
      color: #212121;
      font-size: 1.2em;
    }

    input {
      display: block;
      width: 100%;
      padding: .5rem .75rem;
      margin-top: .5rem;
      font-size: 1rem;
      line-height: 1.25;
      color: #464a4c;
      background-color: #fff;
      background-image: none;
      -webkit-background-clip: padding-box;
      background-clip: padding-box;
      border: 1px solid rgba(0,0,0,.15);
      border-radius: .25rem;
      box-sizing: border-box;
    }

    paper-button.on {
      background-color: #50b1ff;
      color: #FFF;
      font-size: .8em;
    }

    paper-button.off {
      font-size: .8em;
    }

    .container {
      margin: 1em;
    }

    .icon {
      width: 2em;
      height: 2em;
      margin-right: .5em;
    }

    .clearfix:after {
      content: "";
      clear: both;
      display: block;
    }

    .error {
      color: var(--paper-red-800);
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild( $_documentContainer.content );
