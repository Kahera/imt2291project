import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-card/paper-card'
import '@polymer/paper-input/paper-input'
import '@polymer/iron-icons/iron-icons'

export class ComponentVideoinfo extends LitElement {

    properties() {
        return {
            //User must contain: 
            //uid (for checking against video owner)
            //userType (for checking against admin)
            user: Object,
            video: Object
        }
    }

    constructor() {
        super();

        const state = store.getState();
        this.user = state.user;
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
            }

            #card {
                width: 30em;
                max-width: 100%;
            }
            
            .card-info-title { @apply --paper-font-headline; }
            .card-info-lecturer { color: var(--paper-grey-600); margin: 10px 0; }

            paper-icon-button.rate-icon {
                --iron-icon-fill-color: white;
                --iron-icon-stroke-color: var(--paper-grey-600);
              }
            
            .rate-image {
                position: absolute;
                top: 0; 
                right: 0; 
                bottom: 0; 
                width: 100px; 
            }`,
        ]
    }

    render() {
        return html`
        <paper-card class="rate" id="card">
                <div class="card-content">
                ${this.user.userType == 'admin' || this.user.uid == this.video.ownerid ?
                html`
                        <!-- If video owner or admin, show input fields -->
                        //Show input with current info as placeholder
                        //If video is empty object (uploading new video) - show help text as placeholder
                        <paper-input label="input-title" value="${this.video.title}"></paper-input>
                        <paper-input label="input-subject" value="${this.video.subject}"></paper-input>
                        <paper-input label="input-lecturer" value="${this.video.lecturer}"></paper-input>
                        <paper-input label="input-theme" value="${this.video.theme}"></paper-input>
                        <paper-input label="input-description" value="${this.video.description}"></paper-input>
                        
                        `: html`
                        <!-- If student or not logged in, show "plain" info-->
                        <div class="card-info-title">
                                ${this.video.title}
                        </div>
                        <div class="card-info">
                                ${this.video.subject}
                        </div>
                        <div class="card-info-lecturer">
                                ${this.video.lecturer}
                        </div>
                        <div class="card-info">
                                ${this.video.theme}
                        </div>
                        <div class="card-info">
                                ${this.video.description}
                        </div>
                `}
                </div>
                <!-- Rating -->
                <div class="card-content">
                        <paper-icon-button @click="${this._rate}" class="rate-icon" icon="star" value="1"></paper-icon-button>
                        <paper-icon-button @click="${this._rate}" class="rate-icon" icon="star" value="2"></paper-icon-button>
                        <paper-icon-button @click="${this._rate}" class="rate-icon" icon="star" value="3"></paper-icon-button>
                        <paper-icon-button @click="${this._rate}" class="rate-icon" icon="star" value="4"></paper-icon-button>
                        <paper-icon-button @click="${this._rate}" class="rate-icon" icon="star" value="5"></paper-icon-button>
                </div>
                <div class="rate-image"></div>
                <div>Avg. rating: </div>
        </paper-card>
        `
    }

    _rate(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}api/rate.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
    }

    _loadRating(e) {
        //TODO: API call get video avg. rating
    }
}
customElements.define('component-videoinfo', ComponentVideoinfo)