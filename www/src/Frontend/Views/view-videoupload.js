import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import '../Components/component-videoinfo'

export class ViewVideoupload extends LitElement {

    static get properties() {
        return {
            user: Object
        }
    }

    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 10px 20px;
            }

            paper-input.custom {
                --paper-input-container-label-floating: {
                    width: auto;
                }    
            }
            `,
        ]
    }

    render() {
        return html`
            <paper-card class="card">
            <div class="card-content">
                <label for="msg">${this.msg}</label>
                <form class="login" onsubmit="javascript: return false;">

                    <paper-input-container always-float-label>
                        <input type="text" name="title" placeholder="Title" required>
                        <label for="title">Title</label>
                    </paper-input-container>

                    <paper-input-container always-float-label>
                        <input type="text" name="description" placeholder="Description" required>
                        <label for="description">Description</label>
                    </paper-input-container>

                    <paper-input-container always-float-label>
                        <input type="text" name="lecturer" placeholder="Lecturer" required>
                        <label for="lecturer">Lecturer</label>
                    </paper-input-container>

                    <paper-input-container always-float-label>
                        <input type="text" name="theme" placeholder="Theme" required>
                        <label for="theme">Theme</label>
                    </paper-input-container>

                    <paper-input-container always-float-label>
                        <input type="text" name="subject" placeholder="Subject" required>
                        <label for="subject">Subject</label>
                    </paper-input-container>

                    <paper-input-container always-float-label>
                        <input type="file" name="videofile" accept="video/*" required>
                        <label for="video">Video [must be video file]</label>
                    </paper-input-container>

                    <paper-input-container always-float-label>
                        <input type="file" name="thumbnailfile" accept="image/*">
                        <label for="thumbnail">Thumbnail [must be image file]</label>
                    </paper-input-container>

                    <paper-input-container always-float-label>
                        <input type="file" name="vttfile" accept="text/vtt">
                        <label for="thumbnail">Thumbnail [must be vtt file]</label>
                    </paper-input-container>

                    <a href="${window.MyAppGlobals.rootPath}">
                        <paper-button class="btn" raised id="cancel">Cancel</paper-button>
                    </a>
                    <button id="register" @click="${this.uploadVideo}">Upload</button>
                </form>
            </div>
        </paper-card>
        `;
    }

    uploadVideo(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/videoUpload.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => {
            if (res.ok) {
                res => res.json();
                window.location.href = (window.MyAppGlobals.rootPath);
            } else {
                this.msg = res.msg;
            }
        })
    }


}
customElements.define('view-videoupload', ViewVideoupload);