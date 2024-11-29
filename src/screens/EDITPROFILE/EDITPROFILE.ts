import { appState, dispatch, addObserver } from '../../store/index';
import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import { updateProfile, upLoadFile, upLoadFileBanner } from '../../utils/firebase';

class EditProfile extends HTMLElement {
    editedProduct: any;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
        // Asegúrate de que appState.userData tenga valores válidos
        this.editedProduct = appState.userData
            ? { ...appState.userData } // Copiar datos del usuario
            : { uid: '', name: '', username: '', Image: '', bannerImage: '' }; // Estructura por defecto

        this.editedProduct = {
            uid: '',
            name: '',
            username: '',
            image: '',
            bannerImage: '',
        };

        this.changeName = this.changeName.bind(this);
        this.changeuserName = this.changeuserName.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.changeBannerImage = this.changeBannerImage.bind(this);
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

    changeuserName(e: any) {
        const input = e.target as HTMLInputElement;
        this.editedProduct.username = input.value;
    }

    changeImage(e: any) {
        const input = e.target as HTMLInputElement;
        this.editedProduct.image = input.value;
    }

    changeBannerImage(e: any) {
        const input = e.target as HTMLInputElement;
        this.editedProduct.bannerImage = input.value;
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

            const centerContainer = document.createElement('div');
            centerContainer.className = 'center-container';

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

            // Form Change Name
            const pName = document.createElement('input');
            pName.placeholder = 'update your name';
            pName.className = 'form-input';
            pName.required = true;
            pName.addEventListener('change', this.changeName);
            form.appendChild(pName);

            // Form Change User Name
            const puserName = document.createElement('input');
            puserName.placeholder = 'update user name';
            puserName.className = 'form-input';
            puserName.required = true;
            puserName.addEventListener('change', this.changeuserName);
            form.appendChild(puserName);

            // Form Change Image
            const pImage = this.ownerDocument.createElement('input');
            pImage.placeholder = 'update your image';
            pImage.type = 'file';
            pImage.className = 'form-input';
            pImage.addEventListener('change', (e) => {
                const input = e.target as HTMLInputElement;
                const file = input.files?.[0];
                if (file) {
                    // Update the editedProduct with the file
                    this.editedProduct.image = file.name;

                    // Upload the file
                    upLoadFile(file, appState.userData?.uid || '');
                }
            });
            form.appendChild(pImage);

            // Form Change Banner Image
            const pBannerImage = this.ownerDocument.createElement('input');
            pBannerImage.placeholder = 'update your banner image';
            pBannerImage.type = 'file';
            pBannerImage.className = 'form-input';
            pBannerImage.addEventListener('change', (e) => {
                const input = e.target as HTMLInputElement;
                const file = input.files?.[0];
                if (file) {
                    // Update the editedProduct with the file
                    this.editedProduct.bannerImage = file.name;

                    // Upload the file
                    upLoadFileBanner(file, appState.userData?.uid || '');
                }
            });
            form.appendChild(pBannerImage);


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
            centerContainer.appendChild(container);

            this.shadowRoot.appendChild(centerContainer);
        }
    }
}

customElements.define('app-edit-profile', EditProfile);
export default EditProfile;