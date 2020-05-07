import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-card/paper-card'
import '@polymer/paper-input/paper-input'
import '@polymer/iron-icons/iron-icons'
import '@polymer/paper-icon-button/paper-icon-button'
import store from '../Redux/store'

export class ComponentVideoinfo extends LitElement {

    static get properties() {
        return {
            user: Object,
            video: Object
        }
    }

    constructor() {
        super();

        const state = store.getState();
        this.user = state.user;

        //Subscribe to changes in storage
        store.subscribe((state) => {
            this.user = store.getState().user;
        })


    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
            }

            paper-card {
                width: 100%;
                display: grid;
                grid-template-columns: 6fr 1fr;
                grid-template-rows: auto; 
            }

            .card-content {
                grid-column-start: 1;
                grid-row-start: 1;
            }

            .card-title {
                font-weight: bold;
                font-size: medium;
            }

            .card-info {
                font-size: small;
            }
            
            .rating {
                grid-column-start: 2;
                grid-row-start: 1;
                align-self: center;
                justify-self: center;

                display: grid;
                grid-template-rows: 1fr 1fr;
            }

            #rating-text {
                grid-row-start: 2;
                font-size: small;
                align-self: center;
                justify-self: center;
            }

            .btn-rating {
                white-space: nowrap;
                grid-row-start: 1;
                padding-right: 1em;
            }

            .rate-icon {
                display: inline-block;
                height: 1.75rem;
                width: 1.75rem;
                padding: 0px;
                align-self: center;
                justify-self: center;
            }

            paper-icon-button.rate-icon {
                --iron-icon-fill-color: white;
                --iron-icon-stroke-color: #4C4C4C;
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
        <paper-card class="card">
            <div class="card-content">
                <div class="card-title">
                    ${this.video.title}
                </div>
                <div class="card-info">
                    Subject: ${this.video.subject}
                </div>
                <div class="card-info">
                    Lecturer: ${this.video.lecturer}
                </div>
                <div class="card-info">
                    Theme: ${this.video.theme}
                </div>
                <div class="card-info">
                    Description: ${this.video.description}
                </div>
            </div>

            <div class="rating">
                <div class="card-info" id="rating-text">Avg. rating: ${this.video.avgRating}</div>
                ${this.user.userType == 'student' ? html`
                <div class="btn-rating">
                    <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="1"></paper-icon-button>
                    <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="2"></paper-icon-button>
                    <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="3"></paper-icon-button>
                    <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="4"></paper-icon-button>
                    <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="5"></paper-icon-button>
                </div>
                `: html``}
            </div>
        </paper-card>
        `
    }

    rate(e) {
        //Get value of button
        const rating = e.path[2].getAttribute('value');

        //Create form
        const data = new FormData();
        data.append('rating', rating);
        data.append('vid', this.video.vid);

        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Video/rate.php`);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/rate.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            console.log(res);
            //Successfully uploaded
            if (res.msg == 'OK') {
                //This should probably be an event listener setting the value instead, but time constrains are a thing
                window.location.reload();
            } else {
                return html`
                <paper-toast text="${this.msg}" opened></paper-toast>`
            }
        })

    }
}
customElements.define('component-videoinfo', ComponentVideoinfo)