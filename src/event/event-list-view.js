import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';
import '@polymer/paper-button/paper-button.js';

class EventListView extends PolymerElement {
    static get template() {
      return html `
      <style include="shared-styles">

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

        .event {
          width: 95%;
          background: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 5px #ccc;
        }
        .card-img {
          border-radius: 5px 5px 0 0;
          max-width: 100%;
          height: auto;
        }
        .card-content {
          padding: 20px;
        }
        .card-title {
          font-size: 20px;
          color: #333;
        }
        .card-text {
          color: #777;
          font-size: 14px;
          line-height: 1.5;
        }
        .card-link {
          text-align: center;
          border-top: 1px solid #eee;
          padding: 20px;
        }
        .card-link a {
          text-decoration: none;
          color: #0bd;
          margin: 0 10px;
        }
        .card-link a:hover {
          color: #0090aa;
        }
      </style>
      <div class="container">
        <template is="dom-repeat" items="{{events}}">
          <template is="dom-if" if="{{ item.invited || item.joined }}">
            <div class="event" data-id$="{{ item.id }}" on-click="goEvent">
              <div class="card-content">
                <div class="card-text">
                  <span class="date">{{item.date.date}}</span><span>{{item.date.timeFrom}}</span> ~ <span>{{item.date.timeTo}}</span></a>
                </div>
                  <div class="indent card-title">{{item.name}}@{{item.place.name}}</div>
                <template is="dom-if" if="{{ item.joined }}">
                  <div class="indent">[v]参加しています</div>
                </template>
              </div>
            </div>
          </template>
        </template>
        <hr>
        <a href="/event-list-view">新規イベントを作成する</a>
      </div>
    `;
    }

    constructor() {
        super();
        this.events = [];
        var self = this;
        // XXX TODO: setTimeout使わない方法を知りたい
        setTimeout(function(){
          self.getEvents();
        },300)
    }

    static get properties() {
        return {
            user: Object
        }
    }

    getEvents() {
        console.log( 'getEvents()' );
        this.events = [];
        firebase.database().ref( 'events' ).off( 'child_added' );
        firebase.database().ref( 'events' ).orderByChild( 'date' ).startAt( new Date().toISOString().substring( 0, 10 ) ).on( 'child_added', snapshot => {
            let v = snapshot.val();
            if ( v.members ) {
                v.joined = Object.keys( v.members ).includes( this.user.uid ); // Current user already joined or not
                v.members = Object.keys( v.members ).map( key => Object.assign( { uid: key }, v.members[ key ] ) ); // Convert members from Object to Array
            }
            // XXX TODO: フィルタがうまく効いていないのを直す
            // v.invited = (Object.keys(v).includes("invitedMembers")) ? (v.invitedMembers.indexOf(this.user.uid) >= 0) : true;
            v.id = snapshot.key;
            v.invited = true;
            console.log(v.invitedMembers)
            console.log(v.invited)
            this.push( 'events', Object.assign( { id: snapshot.key }, v ) );
        } );
    }

    goEvent( e ) {
        console.log(e.target.dataset);
        var eventId = e.target.closest(".event").dataset.id;
        window.location.href= "/event-view/" + eventId;
    }

    // join( e ) {
    //     console.log( 'join()', e.target.dataset.uid );
    //     firebase.database().ref( `events/${e.target.dataset.uid}/members/${this.user.uid}` ).set( { displayName: this.user.displayName } );
    //     this.getEvents();
    // }

    // cancel( e ) {
    //     console.log( 'cancel()', e.target.dataset.uid );
    //     firebase.database().ref( `events/${e.target.dataset.uid}/members/${this.user.uid}` ).set( null );
    //     this.getEvents();
    // }
}

window.customElements.define( 'event-list-view', EventListView );
