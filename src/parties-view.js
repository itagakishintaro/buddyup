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
            <div>
              <div>
                <span class="date">{{item.date}}</span><span>{{item.timeFrom}}</span> ~ <span>{{item.timeTo}}</span>
              </div>
              <div class="indent">{{item.name}}@{{item.place}}</div>
              <template is="dom-repeat" items="{{ item.members }}" on-dom-change="scroll">
                <div class="indent">
                  <a href="/chat-view/{{item.uid}}">{{item.displayName}}</a>
                </div>
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
        firebase.auth().onAuthStateChanged( () => {
          this.getPartis();
        });
    }

    static get properties() {
        return {
            user: Object
        }
    }

    _sort(a, b) {
      if(a.date + a.timeFrom < b.date + b.timeFrom){
        return -1;
      }
      if(a.date + a.timeFrom > b.date + b.timeFrom){
        return 1;
      }
      return 0;
    }

    getPartis() {
        console.log( 'getPartis()' );
        this.parties = [];
        firebase.database().ref( 'profiles' ).once( 'value', snapshot => {
          let profiles = snapshot.val();

          firebase.database().ref( 'parties' ).orderByChild( 'date' ).startAt( new Date().toISOString().substring( 0, 10 ) ).on( 'child_added', snapshot => {
              let party = snapshot.val();
              let partyKey = snapshot.key;
              if ( party.members ) {
                  party.joined = Object.keys( party.members ).includes( this.user.uid ); // Current user already joined or not
                  party.members = Object.keys( party.members ).map( key => Object.assign( { uid: key }, profiles[key] ) ); // Convert members from Object to Array
              }
              this.push( 'parties', Object.assign( { uid: partyKey }, party ) );

              // partyのmemberが更新された場合はとりなおし
              let _updateMembers = ( snapshot, add ) => {
                firebase.database().ref( 'parties' ).orderByChild( 'date' ).startAt( new Date().toISOString().substring( 0, 10 ) ).once( 'value', snapshot => {
                  let parties = snapshot.val();
                  let tmp = Object.keys( parties ).map( key => Object.assign( { uid: key }, parties[key] ) );

                  tmp = tmp.map( party => {
                    party.joined = Object.keys( party.members ).includes( this.user.uid );
                    party.members = Object.keys( party.members ).map( key => Object.assign( { uid: key }, profiles[key] ) );
                    return party;
                  });
                  this.parties = tmp;
                });
              };

              // 初回の表示のときは何もしないで、他の人が操作したときに処理する
              let init = true;　
              firebase.database().ref( 'parties/' + partyKey + '/members' ).on( 'child_added', snapshot => {
                console.log('added', snapshot.val(), snapshot.key);
                if( !init ){
                  _updateMembers(snapshot, true);
                }
              } );

              firebase.database().ref( 'parties/' + partyKey + '/members' ).on( 'child_removed', snapshot => {
                console.log('removed', snapshot.val(), snapshot.key);
                if( !init ){
                  _updateMembers(snapshot, false);
                }
              } );
              init = false;

          } );

          this.loadingDisplay = 'none';
        } );
    }

    join( e, index ) {
        console.log( 'join()', e.target.dataset.uid );
        firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( this.user );
    }

    cancel( e, index ) {
        console.log( 'cancel()', e.target.dataset.uid );
        firebase.database().ref( `parties/${e.target.dataset.uid}/members/${this.user.uid}` ).set( null );
    }

}

window.customElements.define( 'parties-view', PartiesView );
