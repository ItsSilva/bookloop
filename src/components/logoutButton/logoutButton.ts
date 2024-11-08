import { appState, dispatch } from "../../store";
import { navigate, setUserCredentials } from "../../store/actions";
import { Screens } from "../../types/store";

class LogoutButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    logOutUser() {
        localStorage.clear();  // Limpia el almacenamiento local
        sessionStorage.clear(); // Limpia el almacenamiento de sesión

        dispatch(setUserCredentials('')); // Limpia las credenciales de usuario
        dispatch(navigate(Screens.LOGIN)); // Navega a la pantalla de registro

        location.reload(); 
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
               <link rel="stylesheet" href="../src/components/logoutButton/logoutButton.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <button class="logout-button" id="logout-button">Log out</button>
            `;

            const button = this.shadowRoot.querySelector('#logout-button');
            button?.addEventListener('click', () => this.handleLogout());
        }
    }

    handleLogout() {
        this.logOutUser(); 
    }
}

customElements.define('logout-button', LogoutButton);
export default LogoutButton;