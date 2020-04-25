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

            a {
                text-decoration: none;
                color: black;
            }

            .card {
                width: 50em;
            }
            
            .card-content {
                padding: 1em;
            }

            .btn {
                font-size: small;
                margin-top: 1em;
                margin-bottom: 0.8em;
            }
            `,
        ]
    }

    render() {
        return html`
            <paper-card class="card" heading="Upload video">
                <div class="card-content">
                    <label for="msg">${this.msg}</label>
                    <form onsubmit="javascript: return false;" enctype="multipart/form-data">
                        <paper-input-container always-float-label>
                            <label slot="label" for="title">Title</label>
                            <input slot="input" type="text" name="title" placeholder="Title" required>
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="description">Description</label>
                            <input slot="input" type="text" id="description" name="description" placeholder="Description" required>
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="lecturer">Lecturer</label>
                            <input slot="input" type="text" id="lecturer" name="lecturer" placeholder="Lecturer" required>
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="theme">Theme</label>
                            <input slot="input" type="text" name="theme" placeholder="Theme" required>
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="subject">Subject</label>
                            <input slot="input" type="text" name="subject" placeholder="Subject" required>
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="video">Video [must be video file]</label>
                            <input slot="input" type="file" class="fileselect" name="videofile" accept="video/*" required>
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="thumbnail">Thumbnail [must be image file]</label>
                            <input slot="input" type="file" name="thumbnailfile" accept="image/*">
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="subtitles">Subtitles [must be .vtt file]</label>
                            <input slot="input" type="file" name="subtitles" accept="text/vtt">
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
        const data = new FormData(e.target.form); //Wrap the form in a FormData object
        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Video/videoUpload.php`);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/videoUpload.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            console.log(res);
            //Successfully uploaded
            if (res.msg == 'OK') {
                //Redirect logged in user to homepage
                window.location.href = (window.MyAppGlobals.rootPath);
                //Toast OK
                return html`
                <paper-toast text="Video successfully uploaded" opened></paper-toast>`
            } else {
                return html`
                <paper-toast text="${this.msg}" opened></paper-toast>`
            }
        })
    }
}
customElements.define('view-videoupload', ViewVideoupload);