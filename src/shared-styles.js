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
      object-fit: contain;
    }

    .clearfix:after {
      content: "";
      clear: both;
      display: block;
    }

    .error {
      color: var(--paper-red-800);
    }

    .tag {
        border-radius: 10%;
        border: 1px solid var(--paper-blue-grey-200);
        color: var(--paper-blue-900);
        display: inline-block;
        margin-top: .4em;
        margin-right: .2em;
        padding: 0 .5em
    }

    .link {
      color: var(--paper-blue-500);
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild( $_documentContainer.content );
