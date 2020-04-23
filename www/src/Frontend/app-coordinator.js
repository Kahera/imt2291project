import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-selector/iron-selector.js';

import store from './Redux/store'

import './Views/view-login'
import './Views/view-homepage'
import './Views/view-error'
import './Views/view-admin'
import './Views/view-playlist'
import './Views/view-video'
import './Views/view-register'

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);


export class AppCoordinator extends PolymerElement {

    render() {
        return html`
        
        <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
        </app-location>
  
        <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
        </app-route>

        <a href="[[rootPath]]admin">admin</a>

        <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <view-register name="register"></view-register>
            <view-login name="login"></view-login>
            <view-homepage name="homepage"></view-homepage>
            <view-playlist name="playlist"></view-playlist>
            <view-video name="video"></view-video>
            <view-admin name="admin"></view-admin>
            <view-error name="error"></view-error>
        </iron-pages>
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
            subroute: Object,
            user: Object
        }
    }

    constructor() {
        super();

        //Load user from storage
        const data = store.getState();
        this.user = data.user;

        //Subscribe to changes in storage
        store.subscribe((state) => {
            this.user = store.getState().user;
        })
    }

    static get observers() {
        return [
            '_routePageChanged(routeData.page)'
        ];
    }

    _routePageChanged(page) {
        // Show the corresponding page according to the route.
        //
        // If no page was found in the route data, page will be an empty string.
        // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
        console.log(page)
        if (!page) {
            this.page = 'homepage';
            console.log(page)
        } else if (['register', 'login', 'homepage', 'playlist', 'video', 'admin', 'error'].indexOf(page) !== -1) {
            this.page = page;
            console.log(page)
        } else {
            this.page = 'error';
        }

        // Close a non-persistent drawer when the page & route are changed.
        if (!this.$.drawer.persistent) {
            this.$.drawer.close();
        }
    }

    _pageChanged(page) {
        // Import the page component on demand.
        //
        // Note: `polymer build` doesn't like string concatenation in the import
        // statement, so break it up.
        console.log(page)
        switch (page) {
            case 'register':
                import('./Views/view-register.js');
                break;
            case 'login':
                import('./Views/view-login.js');
                break;
            case 'homepage':
                import('./Views/view-homepage.js');
                break;
            case 'playlist':
                import('./Views/view-playlist.js');
                break;
            case 'video':
                import('./Views/view-video.js');
                break;
            case 'admin':
                import('./Views/view-admin.js');
                break;
            case 'error':
                import('./Views/view-error.js');
                break;
        }
    }
}
customElements.define('app-coordinator', AppCoordinator);