import { dispatch } from '../../store';
import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import '../../components/navBar/navBar';
import UserInfo, { AttributeUserInfo } from '../../components/userInfo/userInfo';
import { dataUsers } from '../../data/dataUsers';
import Post, { Attribute2 } from '../../components/postComponent/post';
import { dataPosts } from '../../data/dataPosts';
import '../../components/postPopUp/postPopUp';
import PostPopUp, { Attribute3 } from '../../components/postPopUp/postPopUp';
import '../../components/elements/clubInfo/clubInfo';
import '../../components/clubsCard/clubsCard';
import ClubsCard, { AttributeClubsCard } from '../../components/clubsCard/clubsCard';
import { dataClubs } from '../../data/dataClubs';

class Landing extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    navigateToRegister() {
        dispatch(navigate(Screens.REGISTER));
    }

    async render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="../src/screens/LANDING/LANDING.css">
            `;

            // Container
            const container = document.createElement('section');
            container.className = 'landing-container';

            // Title Section

            const navBar = document.createElement('nav-bar');
            navBar.setAttribute('icon', "../src/assets/logos/big_logo.png");
            navBar.setAttribute('img', "../src/assets/logos/medium_logo.png");
            
            // Asegúrate de adjuntar navBar al shadowRoot o al contenedor
            container.appendChild(navBar);


            const titleContainer = document.createElement('div');
            titleContainer.className = 'title-container';

            const title = document.createElement('h1');
            title.className = 'landing-title';
            title.innerText = '¿Book lover?';
            titleContainer.appendChild(title);

            const subtitle = document.createElement('p');
            subtitle.className = 'landing-subtitle';
            subtitle.innerText = 'Encuentra tu próximo tesoro literario y comparte tus hallazgos con otros lectores.';
            titleContainer.appendChild(subtitle);

            // Button
            const joinButton = document.createElement('button');
            joinButton.className = 'join-button';
            joinButton.innerText = 'Join now and explore!';
            joinButton.addEventListener('click', () => this.navigateToRegister());
            titleContainer.appendChild(joinButton);

            container.appendChild(titleContainer);

            // Adjunta el contenedor principal al shadowRoot
            this.shadowRoot.appendChild(container);
        }
    }
}


customElements.define('app-landing', Landing);
export default Landing;
