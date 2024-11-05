import { dispatch } from '../../store';
import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import { loginUser } from '../../utils/firebase';

const credentials = {
	email: '',
	password: '',
};

class Login extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
		//validate if user is already logged in
		if (localStorage.getItem('user')) {
			dispatch(navigate(Screens.DASHBOARD));
		}
	}

	changeEmail(e: any) {
		credentials.email = e.target.value;
	}

	changePassword(e: any) {
		credentials.password = e.target.value;
	}

	async submitForm() {
		const result = await loginUser(credentials.email, credentials.password);
    if (result) {
        localStorage.setItem('user', JSON.stringify(result.user));
        dispatch(navigate(Screens.DASHBOARD));
    } else {
        console.log("Error logging in");
    }
	}
	
	redirectToRegister() {
		dispatch(navigate(Screens.REGISTER));
	}

	async render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = 
			`<link rel="stylesheet" href="../src/screens/LOGIN/LOGIN.css">`;
			
			const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../src/screens/LOGIN/LOGIN.css';
            this.shadowRoot.appendChild(link);

			const container = document.createElement('section');
			container.className = 'form-container';

			const title = this.ownerDocument.createElement('h1');
			title.className = 'form-title';
			title.innerText = 'Hello again!';
			this.shadowRoot.appendChild(title);
			

			const desc = this.ownerDocument.createElement('p');
			desc.className = 'form-desc';
			desc.innerText = 'Welcome back, we missed you.';
			this.shadowRoot.appendChild(desc);


			const pEmail = this.ownerDocument.createElement('input');
			pEmail.className = 'form-input';
			pEmail.placeholder = 'Enter e-mail';
			pEmail.required = true;
			pEmail.addEventListener('change', this.changeEmail);

			const pPassword = this.ownerDocument.createElement('input');
			pPassword.className = 'form-input';
			pPassword.type = 'password';
			pPassword.placeholder = 'Enter password';
			pPassword.required = true;
			pPassword.addEventListener('change', this.changePassword);

			
			const redirec = this.ownerDocument.createElement('h4');
			redirec.className = 'form-redirec';
			redirec.innerText = 'Not a member? Register now!';
			redirec.addEventListener('click', () => this.redirectToRegister());

			const save = this.ownerDocument.createElement('button');
			save.className = 'form-button';
			save.innerText = 'Login';
			save.addEventListener('click', this.submitForm);


			const form = document.createElement('div')
			form.className = 'form-div';
			form.appendChild(title)
			form.appendChild(desc)
			form.appendChild(pEmail)
			form.appendChild(pPassword)
			form.appendChild(redirec)
			form.appendChild(save)


			container.appendChild(form)

			this.shadowRoot.appendChild(container);
		}
	}
}

customElements.define('app-login', Login);
export default Login;