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

class Register extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	changeEmail(e: any) {
		credentials.email = e.target.value;
	}

	changePassword(e: any) {
		credentials.password = e.target.value;
	}

	changeName(e: any) {
		credentials.name = e.target.value;
	}

	changeAge(e: any) {
		credentials.userName = e.target.value;
	}

	async submitForm() {
		const resp = await registerUser(credentials);
		resp ? dispatch(navigate(Screens.LOGIN)) : alert('Could not create user');
	}

	redirectToLogin() {
		dispatch(navigate(Screens.LOGIN));
	}

	async render() {
		if (this.shadowRoot) {

			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = '../src/screens/REGISTER/REGISTER.css';
			this.shadowRoot.appendChild(link);

			const container = document.createElement('section');
			container.className = 'form-container';

			const form = document.createElement('div');
			form.className = 'form-div';

			const title = document.createElement('h1');
			title.innerText = 'Its nice to meet you :)';
			title.className = 'form-title';
			form.appendChild(title);

			const desc = this.ownerDocument.createElement('p');
			desc.className = 'form-desc';
			desc.innerText = 'Allow us to know you. We are glad you are here.';
			form.appendChild(desc);


			// Campos del formulario

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

						const pEmail = document.createElement('input');
			pEmail.placeholder = 'Email';
			pEmail.className = 'form-input';
			pEmail.required = true;
			pEmail.addEventListener('change', this.changeEmail);
			form.appendChild(pEmail);

			const pPassword = document.createElement('input');
			pPassword.placeholder = 'Password';
			pPassword.type = 'password';
			pPassword.className = 'form-input';
			pPassword.required = true;
			pPassword.addEventListener('change', this.changePassword);
			form.appendChild(pPassword);


			// Botón de registro
			const save = document.createElement('button');
			save.innerText = 'Start now';
			save.className = 'form-button';
			save.addEventListener('click', this.submitForm);
			form.appendChild(save);



			container.appendChild(form);

			this.shadowRoot.appendChild(container);
		}
	}
}

customElements.define('app-register', Register);
export default Register;