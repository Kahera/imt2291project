import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-toast'
import store from '../Redux/store'
import '../Components/component-usermanagement'
import '@polymer/paper-card'

export class ViewAdmin extends LitElement {

    static get properties() {
        return {
            user: Object,
            teachersPending: Array,
            teachersConfirmed: Array,
            admins: Array
        }
    }

    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;

        //Initialise properties with empty arrays
        this.teachersPending = [];
        this.teachersConfirmed = [];
        this.admins = [];

        //Fill arrays
        this._getPendingTeachers();
        this._getValidatedTeachers();
        this._getAdmins();
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 2em;
            }
            `,
        ]
    }

    render() {
        return html`
            <h2>Admin page</h2>

            ${this.teachersPending.length > 0 ? html`
            <h3>Pending teacher requests</h3>
                ${this.teachersPending.map(i => html`<component-usermanagement .item=${i}></component-usermanagement>`)}
                `: html` <p>No teachers pending.</p> `}
            <h3>Teachers</h3>
                ${this.teachersConfirmed.length > 0 ? html`
                    ${this.teachersConfirmed.map(i => html`<component-usermanagement .item=${i}></component-usermanagement>`)}
                ` : html`<p>No teachers to show.</p>`}
            
            <h3>Admins</h3>
            ${this.admins.length > 0 ? html`
                ${this.admins.map(i => html`<component-usermanagement .item=${i}></component-usermanagement>`)}
                ` : html`<p>No admins to show.</p>`}
        `
    }

    //TODO: Fix
    _getPendingTeachers() {
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/getPendingTeachers.php`
        ).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.teachersPending = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.teachersPending.pop();

            } else {
                //this.videoMsg = res.msg;
            }
        })
    }

    //TODO: Fix
    _getValidatedTeachers() {
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/getConfirmedTeachers.php`
        ).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.teachersConfirmed = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.teachersConfirmed.pop();
                console.log(this.teachersConfirmed);
            } else {
                //this.videoMsg = res.msg;
            }
        })
    }

    //TODO: Fix
    _getAdmins() {
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/getAdmins.php`
        ).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.admins = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.admins.pop();
                console.log(this.admins);
            } else {
                //this.videoMsg = res.msg;
            }
        })
    }
}
customElements.define('view-admin', ViewAdmin);