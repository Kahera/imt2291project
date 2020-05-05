import { LitElement, html, css } from 'lit-element';
import '@polymer/iron-icons/iron-icons'
import '@polymer/paper-icon-button'
import '@polymer/paper-card'


export class ComponentUsermanagement extends LitElement {

    static get properties() {
        return {
            item: Object
        }
    }

    static get styles() {
        return [
            css`
            :host {
                display: inline-block;
            }

            .container {
                padding: 1em;
                display: grid;
                grid-template-columns: 9fr 1fr 1fr;
                grid-template-rows: auto;
            }

            .card-content {
                grid-column-start: 1;
                grid-row-start: 1;
                align-self: center;
            }

            .btn1 {
                grid-column-start: 2;
                grid-row-start: 1;
                justify-self: center;
                align-self: center;
            }

            .btn2 {
                grid-column-start: 3;
                grid-row-start: 1;
                justify-self: center;
                align-self: center;
            }

            .card {
                max-width: 100%;
            }

            paper-icon-button.red {
                color: var(--paper-red-500);
            }

            paper-icon-button.green {
                color: var(--paper-green-500);
            }

            `,
        ]
    }

    render() {
        return html`
            <paper-card class="card">
                <div class="container">
                    <div class="card-content">
                        Email: ${this.item.email}
                    </div>
                        <paper-icon-button icon="remove-circle" class="btn1 red" @click="${this.reject}"></paper-icon-button>
                    ${this.item.userType == 'teacher' ? html`
                        <paper-icon-button icon="add-circle" class="btn2 green" @click="${this.approve}"></paper-icon-button>`
                : html``}
                </div>
            </paper-card class="card">
        `;
    }


    reject() {
        const data = new FormData();
        data.append('uid', this.item.uid);

        //If teacher -> reject teacher (set student)
        if (this.item.userType == 'teacher') {
            console.log(`${window.MyAppGlobals.serverURL}src/Backend/User/teacherReject.php`);
            fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/teacherReject.php`, {
                method: 'POST',
                credentials: "include",
                body: data
            }).then(res => res.json()
            ).then(res => {
                //Successfully logged in
                if (res.msg == 'OK') {
                    //Reload page to see updated status
                    window.location.reload();
                } else {
                    this.msg = res.msg;
                }
            })

            //If admin -> make teacher waiting for approval instead
        } else if (this.item.userType == 'admin') {
            console.log(`${window.MyAppGlobals.serverURL}src/Backend/User/adminRemove.php`);
            fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/adminRemove.php`, {
                method: 'POST',
                credentials: "include",
                body: data
            }).then(res => res.json()
            ).then(res => {
                //Successfully logged in
                if (res.msg == 'OK') {
                    //Reload page to see updated status
                    window.location.reload();
                }
            })
            //If something is wrong with the logic
        } else {
            this.msg = "Something went wrong";
            console.log(this.msg);
        }
    }

    approve() {
        const data = new FormData();
        data.append('uid', this.item.uid);

        //Validate teacher - FUNKER
        if (this.item.validated == 0 && this.item.userType == 'teacher') {
            console.log(`${window.MyAppGlobals.serverURL}src/Backend/User/teacherValidate.php`);
            console.log(this.item);
            fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/teacherValidate.php`, {
                method: 'POST',
                credentials: "include",
                body: data
            }).then(res => res.json()
            ).then(res => {
                //Successfully logged in
                if (res.msg == 'OK') {
                    //Reload page to see updated status
                    window.location.reload();
                } else {
                    this.msg = res.msg;
                }
            })

            //Validated teacher -> admin
        } else if (this.item.validated == 1 && this.item.userType == 'teacher') {
            console.log(`${window.MyAppGlobals.serverURL}src/Backend/User/adminSet.php`);
            fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/adminSet.php`, {
                method: 'POST',
                credentials: "include",
                body: data
            }).then(res => res.json()
            ).then(res => {
                //Successfully logged in
                if (res.msg == 'OK') {
                    //Reload page to see updated status
                    window.location.reload();
                } else {
                    this.msg = res.msg;
                }
            })
        } else {
            this.msg = "Something went wrong.";
            console.log(this.msg);
        }
    }
}
customElements.define('component-usermanagement', ComponentUsermanagement);