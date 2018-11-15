import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './newparty-view.js';
import './loading-view.js';
import '@polymer/paper-button/paper-button.js';

class PartiesView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        .party {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1em;
        }

        .indent {
          margin-left: 1em;
        }

        .on, .off {
          align-self: flex-end;
          height: 2em;
        }
        .date {
          font-size: 1.1em;
          margin-right: .5em;
        }
      </style>

      <div class="container">
        <template is="dom-repeat" items="{{parties}}" sort="_sort">
          <div class="party">
            <div data-uid$="{{ item.uid }}">
              <div>
                <span class="date">{{item.date}}</span><span>{{item.timeFrom}}</span> ~ <span>{{item.timeTo}}</span>
              </div>
              <div class="indent">{{item.name}}@{{item.place}}</div>
              <template is="dom-repeat" items="{{ item.members }}" on-dom-change="scroll">
                <div class="indent link" data-uid$="{{item.uid}}" on-click="chat">{{item.displayName}}</div>
              </template>
            </div>
            <template is="dom-if" if="{{ item.joined }}">
              <paper-button id="cancel" raised class="off" data-uid$="{{ item.uid }}" on-click="cancel">cancel</paper-button>
            </template>
            <template is="dom-if" if="{{ !item.joined }}">
              <paper-button id="join" raised class="on" data-uid$="{{ item.uid }}" on-click="join">参加</paper-button>
            </template>
          </div>
        </template>
        <hr>
        <newparty-view user={{user}}></newparty-view>
      </div>
      <loading-view display="{{loadingDisplay}}"></loading-view>
    `;
    }

    constructor() {
        super();
        this.parties = [];
        this.profiles = [];
        // 初期処理
        firebase.auth().onAuthStateChanged( () => {
            let getProfilesPromise = new Promise( ( resolve, reject ) => {
                // profilesを取得する
                this.getProfiles( resolve, reject );
            } );

            let getPartiesPromise = new Promise( ( resolve, reject ) => {
                // partyを取得する
                this.getParties( resolve, reject );
            } );

            getProfilesPromise.then( () => {
                //profilesを取得した後、partiesを取得
                getPartiesPromise.then( () => {
                  // partyを取得して初期処理が終わった後、他の人がpartyのmemberを変更したときのイベント処理を設定
                  this.updateMembers();
                } );
              } );
        } );
    }

    static get properties() {
        return {
            user: Object
        }
    }

    _sort( a, b ) {
        if ( a.date + a.timeFrom < b.date + b.timeFrom ) {
            return -1;
        }
        if ( a.date + a.timeFrom > b.date + b.timeFrom ) {
            return 1;
        }
        return 0;
    }

    getParties( resolve, reject ) {
        console.log( 'getParties()' );
        this.parties = [];
        firebase.database().ref( 'parties' ).orderByChild( 'date' ).startAt( new Date().toISOString().substring( 0, 10 ) ).on( 'child_added', snapshot => {
            let party = snapshot.val();
            let partyKey = snapshot.key;
            if ( party.members ) {
                party.joined = Object.keys( party.members ).includes( this.user.uid ); // Current user already joined or not
                party.members = Object.keys( party.members ).map( key => Object.assign( { uid: key }, this.profiles[ key ] ) ); // Convert members from Object to Array
            }
            this.push( 'parties', Object.assign( { uid: partyKey }, party ) );
            resolve( 'success get parties' );
        } );
        this.loadingDisplay = 'none';
    }

    getProfiles( resolve, reject ) {
      this.profiles = firebase.database().ref( '/profiles/' ).once( 'value' ).then( snapshot => {
        this.profiles = snapshot.val();
        resolve( 'success get profiles' );
      });
    }

    updateMembers() {
      console.log(this.profiles);
        // 共通処理
        let _update = ( snapshot, add ) => {
            firebase.database().ref( 'parties' ).orderByChild( 'date' ).startAt( new Date().toISOString().substring( 0, 10 ) ).once( 'value', snapshot => {
                let parties = snapshot.val();
                let tmp = Object.keys( parties ).map( key => Object.assign( { uid: key }, parties[ key ] ) );
                tmp = tmp.map( party => {
                    if ( party.members ) {
                        party.joined = Object.keys( party.members ).includes( this.user.uid );
                        party.members = Object.keys( party.members ).map( key => Object.assign( { uid: key }, this.profiles[ key ] ) );
                    }
                    return party;
                } );
                this.parties = tmp;
            } );
        };

        // membersがaddされたときとremoveされたときのイベントを設定
        let partyUIDs = this.parties.map( p => p.uid );
        partyUIDs.forEach( partyKey => {
            firebase.database().ref( 'parties/' + partyKey + '/members' ).on( 'child_added', snapshot => {
                _update( snapshot, true );
            } );

            firebase.database().ref( 'parties/' + partyKey + '/members' ).on( 'child_removed', snapshot => {
                _update( snapshot, false );
            } );
        } );
    }

    join( e, index ) {
      let user = { uid: this.user.uid };
      firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( user );
    }

    cancel( e, index ) {
      firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( null );
    }

    chat( e ) {
      let talker = e.target.dataset.uid;
      let party = e.target.parentNode.dataset.uid;
      location.href = `/chat-view/${talker}/${party}`;
    }

}

window.customElements.define( 'parties-view', PartiesView );
