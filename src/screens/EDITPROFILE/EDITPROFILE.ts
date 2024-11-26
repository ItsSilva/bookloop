import { appState, dispatch } from '../../store/index';
import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import { updateProfile } from '../../utils/firebase';

class EditProfile extends HTMLElement {
    editedProduct: any;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Asegúrate de que appState.userData tenga valores válidos
        this.editedProduct = appState.userData
            ? { ...appState.userData } // Copiar datos del usuario
            : { uid: '', name: '', userName: '' }; // Estructura por defecto

        this.editedProduct = {
            uid: '',
            name: '',
            userName: '',
        };

        this.changeName = this.changeName.bind(this);
        this.changeUserName = this.changeUserName.bind(this);
        this.submitForm = this.submitForm.bind(this);

        console.log("Estado inicial de appState.userData:", appState.userData);
    }


    connectedCallback() {
        if (!appState.userData) {
            console.error("No se encontraron datos de usuario en appState.");
        } else {
            this.editedProduct = { ...appState.userData };
        }
        this.render();
    }


    changeName(e: any) {
        const input = e.target as HTMLInputElement;
        this.editedProduct.name = input.value;
    }

    changeUserName(e: any) {
        const input = e.target as HTMLInputElement;
        this.editedProduct.userName = input.value;
    }

    async submitForm() {
        if (!this.editedProduct || !this.editedProduct.uid) {
            console.error("Los datos del producto editado están incompletos o son inválidos:", this.editedProduct);
            return;
        }

        try {
            console.log('Edited Product for FB', this.editedProduct);
            await dispatch(updateProfile(this.editedProduct)); // Actualizar perfil
            dispatch(navigate(Screens.PROFILE)); // Navegar al perfil
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        }
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
            pName.placeholder = 'update your name';
            pName.className = 'form-input';
            pName.required = true;
            pName.addEventListener('change', this.changeName);
            form.appendChild(pName);

            const pUserName = document.createElement('input');
            pUserName.placeholder = 'update user name';
            pUserName.className = 'form-input';
            pUserName.required = true;
            pUserName.addEventListener('change', this.changeUserName);
            form.appendChild(pUserName);

            // Edit button
            const save = document.createElement('button');
            save.innerText = 'Edit Profile';
            save.className = 'form-button';
            save.addEventListener('click', this.submitForm);
            form.appendChild(save);

            // Profile button
            const profile = document.createElement('button');
            profile.innerText = 'Return to profile';
            profile.className = 'form-button';
            profile.addEventListener('click', this.redirectToLogin);
            form.appendChild(profile);


            container.appendChild(form);

            this.shadowRoot.appendChild(container);
        }
    }
}

customElements.define('app-edit-profile', EditProfile);
export default EditProfile;