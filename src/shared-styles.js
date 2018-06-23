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
        margin: 16px 0;
        color: #212121;
        font-size: 22px;
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
      }

      /* .post-btn {
          margin-top: .5em;
          background-color: #50b1ff;
          border: none;
          color: #FFF;
          height: 3em;
          min-width: 5em;
      }

      .cancel-btn {
          border-color: #50b1ff;
          border-style: solid;
          border-width: 2px;
          margin-top: .5em;
          background-color: #FFF;
          color: #50b1ff;
          height: 3em;
          min-width: 5em;
      } */

      .badge {
        background-color: gray;
        color: white;
        border-radius: .25rem;
        padding: .25em .4em;
      }

      ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: gray;
            opacity: 1; /* Firefox */
        }

        .clearfix:after {
          content: "";
          clear: both;
          display: block;
        }
    </style>
  </template>
</dom-module>`;

document.head.appendChild( $_documentContainer.content );
