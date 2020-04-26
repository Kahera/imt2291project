import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import '@polymer/app-layout/app-layout'
import '@polymer/iron-selector/iron-selector';
import '@polymer/iron-pages/iron-pages'
import '@polymer/iron-icon'
import '@polymer/iron-icons'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-icon-button'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-toast/paper-toast'

import { action_logout } from './Redux/actions'
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

    static get properties() {
        return {
            page: {
                type: String,
                reflectToAttribute: true,
                observer: '_pageChanged'
            },
            routeData: Object,
            subroute: Object,
            user: {
                type: Object,
                value: { student: false, teacher: false, admin: false }
            },
            drawerOpened: Boolean
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

        this.drawerOpened = false;
    }

    static get template() {
        return html`
        <style>
            * {
                font-family: 'Roboto', sans-serif;
            }

            app-header {
                background-color: whitesmoke;
            --app-header-background-rear-layer: {
                background-color: whitesmoke;
                }; 
            }

            app-drawer-layout:not([narrow]) [drawer-toggle] {
                display: none;
            }
      

            a {
                text-decoration: none;
                color: black;
            }

            .toolbar {
                color: rgb(70, 70, 70);
                display: grid;
                grid-template-columns: 1em 2fr 10fr 2fr 1em;
                grid-template-rows: auto;
                padding-bottom: 1em;
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
              
            .searchbar {
                grid-column-start: 3;
                margin-bottom: 1em;
                width: 100%;
                align-self: center;
                justify-self: right;
            }

            #btn-home {
                color: #4C4C4C;
                display: inline-block;
                grid-column-start: 2;
                align-self: center;
                justify-self: left;
            }

            #input-search {
                color: #4C4C4C;
                width: 80%;
                display: inline-block;
            }

            #btn-search {
                display: inline-block;
                color: #4C4C4C;
            }

            #btn-drawer {
                color: #4C4C4C;
                width: 50%; 
                grid-column-start: 4;
                align-self: center;
                justify-self: right;
            }
        </style>
        
        <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
        </app-location>
  
        <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
        </app-route>
        
        <!-- App drawer content -->
        <app-drawer-layout fullbleed="" force-narrow>
            <app-drawer slot="drawer" id="drawer" align="right" swipe-open="right" position="right" opened>
                <div class="drawer-content">
                    <iron-selector slected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
                        <template is="dom-if" if="{{!user.email}}">
                            <a href="[[rootPath]]login">Log in</a>
                        </template>
                        <template is="dom-if" if="{{user.email}}">
                            <a on-click="logout">Log out</a>
                        </template>
                        <template is="dom-if" if="{{user.isTeacher}}">
                            <a href="[[rootPath]]videoupload">Video upload</a>
                            <a href="[[rootPath]]playlistcreate">Playlist creation</a>
                        </template>
                        <template is="dom-if" if="{{user.isAdmin}}">
                            <a href="[[rootPath]]videoUpload">Video upload</a>
                            <a href="[[rootPath]]playlistcreate">Playlist creation</a>
                            <a href="[[rootPath]]admin">Admin page</a>
                        </template>
                    </iron-selector>
                </div>
            </app-drawer>

            <!--Toolbar -->
            <app-header-layout>
                <app-header reveals>
                    <app-toolbar class="toolbar">
                        <a href="[[rootPath]]">
                            <paper-icon-button class="btn" icon="home" id="btn-home"></paper-icon-button>
                        </a>
                        <div class="searchbar">
                            <paper-input id="input-search" label="Search"></paper-input>
                            <paper-icon-button icon="search" id="btn-search"></paper-icon-button>
                        </div>
                        <paper-icon-button class="btn" icon="settings" id="btn-drawer" drawer-toggle></paper-icon-button>
                    </app-toolbar>
                </app-header>

                <!-- Main website content -->
                <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
                    <view-register name="register"></view-register>
                    <view-login name="login"></view-login>
                    <view-homepage name="homepage"></view-homepage>
                    <view-playlist name="playlist"></view-playlist>
                    <view-video name="video"></view-video>
                    <view-videoupload name="videoupload"></view-videoupload>
                    <view-playlistcreate name="playlistcreate"></view-playlistcreate>
                    <view-admin name="admin"></view-admin>
                    <view-error name="error"></view-error>
                </iron-pages>

            </app-header-layout>
        </app-drawer-layout>

        `;
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
        // Show 'homepage' in that case. And if the page doesn't exist, show 'error'.
        if (!page) {
            this.page = 'homepage';
        } else if (['register', 'login', 'homepage', 'playlist', 'video', 'videoupload', 'playlistcreate', 'admin', 'error'].indexOf(page) !== -1) {
            this.page = page;
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
            case 'videoupload':
                import('./Views/view-videoupload.js');
                break;
            case 'playlistcreate':
                import('./Views/view-playlistcreate.js');
                break;
            case 'admin':
                import('./Views/view-admin.js');
                break;
            case 'error':
                import('./Views/view-error.js');
                break;
        }
    }

    _drawerToggle() {
        this.drawerOpened = !this.drawerOpened;
    }

    /**
    * Called when the user clicks the log out button
    */
    logout() {
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/logout.php`, {
            credentials: "include"
        }).then(res => res.json()
        ).then(res => {
            if (res.msg == 'OK') {  // Successfully logged out
                this.updateUserStatus(res);
                store.dispatch(action_logout());
            } else {
                return html`
                <paper-toast text="[[res.msg]]" opened></paper-toast>`
            }
        })
    }

    updateUserStatus(res) {
        this.loggedin = (res.uid != null);
        this.uid = res.uid;
        this.userType = res.userType;
        this.validated = res.validated;
        this.email = res.email;
        this.student = false;
        this.teacher = false;
        this.admin = false;
        switch (res.userType) {
            case 'student': this.student = true;
                break;
            case 'teacher': this.teacher = true;
                break;
            case 'admin': this.admin = true;
                break;
        }
    }


}
customElements.define('app-coordinator', AppCoordinator);