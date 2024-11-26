import { dispatch } from '../../store/index';
import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import { registerUser } from '../../utils/firebase';



const credentials = {
    email: '',
    password: '',
    name: '',
    userName: '',
};

class EditProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    changeName(e: any) {
        credentials.name = e.target.value;
    }

    changeAge(e: any) {
        credentials.userName = e.target.value;
    }

    async submitForm() {
        const resp = await registerUser(credentials);
        resp ? dispatch(navigate(Screens.PROFILE)) : alert('Your personal information could not be changed. Excuse us :(');
    }

    redirectToLogin() {
        dispatch(navigate(Screens.PROFILE));
    }

    async render() {
        if (this.shadowRoot) {

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../src/screens/EDITPROFILE/EDITPROFILE.css';
            this.shadowRoot.appendChild(link);

            const container = document.createElement('section');
            container.className = 'form-container';

            const form = document.createElement('div');
            form.className = 'form-div';

            const title = document.createElement('h1');
            title.innerText = 'Hello again!';
            title.className = 'form-title';
            form.appendChild(title);

            const desc = this.ownerDocument.createElement('p');
            desc.className = 'form-desc';
            desc.innerText = ' What are we going to modify? :)';
            form.appendChild(desc);

            // Form fields
            const pName = document.createElement('input');
            pName.placeholder = 'Full name';
            pName.className = 'form-input';
            pName.required = true;
            pName.addEventListener('change', this.changeName);
            form.appendChild(pName);

            const pUserName = document.createElement('input');
            pUserName.placeholder = 'User name';
            pUserName.className = 'form-input';
            pUserName.required = true;
            pUserName.addEventListener('change', this.changeAge);
            form.appendChild(pUserName);

            // Registration button
            const save = document.createElement('button');
            save.innerText = 'Edit Profile';
            save.className = 'form-button';
            // save.addEventListener('click', this.submitForm);
            form.appendChild(save);

            // Profile button
            const profile = document.createElement('button');
            profile.innerText = 'Return to profile';
            profile.className = 'form-button';

            // CHANGE BY FUNCTION THAT MODIFIES USER INFORMATION
            profile.addEventListener('click', this.redirectToLogin);
            // CHANGE BY FUNCTION THAT MODIFIES USER INFORMATION

            form.appendChild(profile);


            container.appendChild(form);

            this.shadowRoot.appendChild(container);
        }
    }
}

customElements.define('app-edit-profile', EditProfile);
export default EditProfile;