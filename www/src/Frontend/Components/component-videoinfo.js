import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-card/paper-card'
import '@polymer/paper-input/paper-input'
import '@polymer/iron-icons/iron-icons'

export class ComponentVideoinfo extends LitElement {

    properties() {
        return {
            user: Object,
            video: Object,
            rating: Number,
        }
    }

    constructor() {
        super();

        const state = store.getState();
        this.user = state.user;

        this.getRating();
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
                </div>

                <div class="btn-rating">
                        <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="1"></paper-icon-button>
                        <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="2"></paper-icon-button>
                        <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="3"></paper-icon-button>
                        <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="4"></paper-icon-button>
                        <paper-icon-button @click="${this.rate}" class="rate-icon" icon="star" value="5"></paper-icon-button>
                </div>
                <div>Avg. rating: ${this.rating}</div>
        </paper-card>
        `
    }

    rate(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/rate.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
    }

    getRating() {
        //Get vid from URL and append to form
        const data = new FormData();
        data.append('vid', this.video.vid);


        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Video/getRating.php`);
        //Then fetch the video rating
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getRating.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            if (res.msg == 'OK') {
                this.rating = res['rating'];
            } else {
                this.msg = res.msg;
            }
        })
    }
}
customElements.define('component-videoinfo', ComponentVideoinfo)