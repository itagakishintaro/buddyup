import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';

class EventPlaceView extends PolymerElement {
  static get template() {
    return html `
      <style include="shared-styles">
        .indent { margin-left: 1em;   }
        .container { margin: 0.2em; }
        .collapse { width:100%; margin: 0.5em 0.3em 0.8em 0.3em;}

        .event-view-container { background-color: #ccc; }
        .event-place-link-a { text-decoration: none; color: #000; padding: 0.5em 1em 0.5em 1em;}
        .event-place-link { padding: 0.5em 1em 0.5em 0.5em; margin: 0.3em}
        .event-place-badget {vertical-align:middle; margin: 0.5em; font-size:12px;}
      </style>

      <div class="event-place-container container">
        <span on-click="openEditPlace"><b>場所</b>　　　　</span>
        <span id="placeTitle" on-click="openEditPlace">{{place}}</span>
        <iron-icon id="expand_places" icon="icons:expand-more" on-click="showPlaces"></iron-icon>
        <iron-collapse id="collapse_places" class="collapse">
          <div class="indent">
            <div id="placeComment">{{placeComment}}</div>
              <!-- <a href="{{placeUrl}}" class="event-place-link-a">
                <iron-icon icon="icons:home"></iron-icon>会場の紹介
              </a>
              <span on-click="openMapToPlace" class="event-place-link">
                <iron-icon icon="communication:location-on"></iron-icon>Google Maps
              </span>
              -->
            <paper-button raised on-click="openPlaceUrl" class="event-place-link">
              <iron-icon icon="icons:home"></iron-icon>会場の紹介
            </paper-button>
            <paper-button raised on-click="openMapToPlace" class="event-place-link">
              <iron-icon icon="communication:location-on"></iron-icon>Google Maps
            </paper-button>
            <span class="event-place-badget">予算: {{badget}}</span>
          </div>
        </iron-collapse>
      </div>

      `;
  }

  openEditPlace( e ){
    if(!this.canEdit()) { this.noPermission(); return; }
    this.$.adminEditPlace1.value = this.place;
    this.$.adminEditPlace2.value = this.placeComment;
    this.$.adminEditPlace3.value = this.placeUrl;
    this.$.adminEditPlace4.value = this.placeMapUrl;
    this.$.adminEditPlace5.value = this.station;
    this.$.adminEditPlace6.value = this.badget;
    this.$.adminEditPlace.open();
  }
  
  showPlaces( e ) {
     this.$.expand_places.icon = this.$.collapse_places.opened ? 'expand-more' : 'expand-less';
     this.$.collapse_places.toggle();
  }
  openPlaceUrl( e ){
    if(this.placeUrl){
      window.open(this.placeUrl);
    }
  }
  openMapToPlace( e ){
    if(this.placeMapUrl){
      window.open(this.placeMapUrl);
    } else {
      window.open("https://maps.google.co.jp/maps?q=" + this.place);
    }
  }

}

window.customElements.define( 'event-place-view', EventPlaceView );
