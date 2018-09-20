import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures( true );

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath( MyAppGlobals.rootPath );

class MyApp extends PolymerElement {
    static get template() {
        return html `
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
          position: fixed;
          top:0;
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page/:subpage" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
              <template is="dom-if" if="{{!user}}">
                <a name="login-view" href="[[rootPath]]login-view/">ログイン</a>
              </template>
              <template is="dom-if" if="{{user.isPasswordAuth}}">
                <a name="auth-view" href="[[rootPath]]auth-view/">パスワード変更</a>
              </template>
              <template is="dom-if" if="{{user}}">
                <a name="profile-view" href="[[rootPath]]profile-view/">プロフィール設定</a>
                <a name="skill-view" href="[[rootPath]]skill-view/">スキル</a>
                <a name="event-list-view" href="[[rootPath]]event-list-view/">イベント一覧</a>
                <a name="parties-view" href="[[rootPath]]parties-view/">ランチ会一覧</a>
                <a name="users-view" href="[[rootPath]]users-view/">知り合い検索</a>
                <a name="logout" on-tap="logout">ログアウト</a>
              </template>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" fixed condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">Buddyup!</div>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <login-view name="login-view" user="{{user}}" loadingDisplay="{{loadingDisplay}}"></login-view>
            <auth-view name="auth-view" user="{{user}}"></auth-view>
            <profile-view name="profile-view" user="{{user}}"></profile-view>
            <skill-view name="skill-view" user="{{user}}"></skill-view>
            <event-list-view name="event-list-view" user="{{user}}"></event-list-view>
            <event-view name="event-view" user="{{user}}" eventid={{routeData.subpage}}></event-view>
            <parties-view name="parties-view" user="{{user}}"></parties-view>
            <users-view name="users-view" user="{{user}}"></users-view>
            <chat-view name="chat-view" user="{{user}}" talker= {{routeData.subpage}}></chat-view>
            <my-view404 name="view404"></my-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
    }

    static get properties() {
        return {
            page: {
                type: String,
                reflectToAttribute: true,
                observer: '_pageChanged'
            },
            routeData: Object,
            subroute: Object
        };
    }

    static get observers() {
        return [
            '_routePageChanged(routeData.page)'
        ];
    }

    _routePageChanged( page ) {
        // Show the corresponding page according to the route.
        //
        // If no page was found in the route data, page will be an empty string.
        // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
        console.log( '_routePageChanged', page );
        if ( !page ) {
            this.page = 'login-view';
        } else if ( [ 'login-view', 'auth-view', 'profile-view', 'skill-view', 'event-list-view', 'event-view', 'parties-view', 'users-view', 'chat-view' ].indexOf( page ) !== -1 ) {
            this.page = page;
        } else {
            this.page = 'view404';
        }

        // Close a non-persistent drawer when the page & route are changed.
        if ( !this.$.drawer.persistent ) {
            this.$.drawer.close();
        }
    }

    _pageChanged( page ) {
        // Import the page component on demand.
        //
        // Note: `polymer build` doesn't like string concatenation in the import
        // statement, so break it up.
        switch ( page ) {
            case 'login-view':
                import ( './login-view.js' );
                break;
            case 'auth-view':
                import ( './auth-view.js' );
                break;
            case 'profile-view':
                import ( './profile-view.js' );
                break;
            case 'skill-view':
                import ( './skill-view.js' );
                break;
            case 'event-list-view':
                import ( './event/event-list-view.js' );
                break;
            case 'event-view':
                import ( './event/event-view.js' );
                break;
            case 'parties-view':
                import ( './parties-view.js' );
                break;
            case 'users-view':
                import ( './users-view.js' );
                break;
            case 'chat-view':
                import ( './chat-view.js' );
                break;
            case 'view404':
                import ( './my-view404.js' );
                break;
        }
    }

    constructor() {
        console.log( 'constructor()' );
        super();
        this.user = {};
        this.initFirebase();
    }

    // Initialize Firebase
    initFirebase() {
        console.log( 'initFirebase()' );
        // Initialize Firebase
        // var config = {
        //     apiKey: "AIzaSyAGW3s4tqAe8wAZY65hrM6YKpvKHj2dNjM",
        //     authDomain: "buddyup-204005.firebaseapp.com",
        //     databaseURL: "https://buddyup-204005.firebaseio.com",
        //     projectId: "buddyup-204005",
        //     storageBucket: "buddyup-204005.appspot.com",
        //     messagingSenderId: "541079223817"
        // };

        var config = {
          apiKey: "AIzaSyCC5ueEo_JfNcV23rjYO36i6oAG5ZZe2HQ",
          authDomain: "buddyup-1424c.firebaseapp.com",
          databaseURL: "https://buddyup-1424c.firebaseio.com",
          projectId: "buddyup-1424c",
          storageBucket: "buddyup-1424c.appspot.com",
          messagingSenderId: "726570403179"
        };
        firebase.initializeApp( config );
        firebase.auth().onAuthStateChanged( user => {
            console.log( 'onAuthStateChanged', user );

            if ( !user ) {
                return;
            }
            if( this.page === "login-view" ){
                this.set( 'route.path', '/parties-view/' );
            }

            // profile existance check. if not, then register user profile
            firebase.database().ref( 'profiles/' + user.uid ).once( 'value' ).then( snapshot => {
                let userInfo = {};
                if ( snapshot.val() ) {
                    userInfo = {
                        providerId: user.providerData[0].providerId,
                        displayName: snapshot.val().displayName,
                        email: snapshot.val().email,
                        photoURL: snapshot.val().photoURL
                    };
                } else {
                    console.log( 'profile does not exist' );
                    let displayName = user.displayName ? user.displayName : user.email;
                    let photoURL = user.photoURL ? user.photoURL : 'images/manifest/icon-48x48.png';
                    userInfo = {
                        providerId: user.providerData[0].providerId,
                        displayName: displayName,
                        email: user.email,
                        photoURL: photoURL
                    };
                    firebase.database().ref( 'profiles/' + user.uid ).set( userInfo );
                }
                this.set( 'user', userInfo );
                this.set( 'user.uid', user.uid );
                if ( userInfo.providerId === 'password' ){
                    this.set( 'user.isPasswordAuth', true );
                } else {
                    this.set( 'user.isPasswordAuth', false );
                }
            } );
        } );
    }

    // logout
    logout() {
        console.log( 'logout()', firebase.auth().currentUser );
        this.$.drawer.close();
        firebase.auth().signOut().then( () => {
            // Sign-out successful.
            console.log( 'loged out' );
            this.set( 'route.path', '/login-view/' );
        } ).catch( error => {
            // An error happened.
            console.error( error );
        } );
    }

}

window.customElements.define( 'my-app', MyApp );
