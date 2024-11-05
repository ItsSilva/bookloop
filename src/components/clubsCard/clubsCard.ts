import '../../components/elements/clubInfo/clubInfo';
import { dispatch, addObserver, appState } from '../../store/index';
import { getClubsAction } from '../../store/actions';

export enum AttributeClubsCard {
    'cardtitle' = 'cardtitle',
    'buttontext' = 'buttontext',
    'cardcolor' = 'cardcolor',
    'buttoncolor' = 'buttoncolor',
}

class ClubsCard extends HTMLElement {
    clubs: any[] = [];
    cardtitle: string = '';
    buttontext: string = '';
    cardcolor: string = 'black';
    buttoncolor: string = 'gray';

    constructor(clubsData: any[]) {
        super();
        this.attachShadow({ mode: 'open' });
        this.clubs = clubsData;
        addObserver(this);
    }

    static get observedAttributes() {
        return Object.values(AttributeClubsCard);
    }

    attributeChangedCallback(propName: AttributeClubsCard, oldValue: string | null, newValue: string | null) {
        if (newValue) {
            switch(propName) {
                case AttributeClubsCard.cardtitle:
                    this.cardtitle = newValue;
                    break;
                case AttributeClubsCard.buttontext:
                    this.buttontext = newValue;
                    break;
                case AttributeClubsCard.cardcolor:
                    this.cardcolor = newValue;
                    break;
                case AttributeClubsCard.buttoncolor:
                    this.buttoncolor = newValue;
                    break;
            }
            this.render();
        }
    }

    async connectedCallback() {
        try {
            if (appState.cards.length === 0) {
                const action = await getClubsAction();
                if (action) {
                    dispatch(action);
                    this.clubs = appState.cards;
                    this.render();
                }
            } else {
                this.clubs = appState.cards;
                this.render();
            }
        } catch (error) {
            console.error("Error loading clubs:", error);
        }
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = '';

            // Crear y añadir el link de estilos
            const styleLink = document.createElement('link');
            styleLink.rel = 'stylesheet';
            styleLink.href = '../src/components/clubsCard/clubsCard.css';
            this.shadowRoot.appendChild(styleLink);

            // Crear la sección principal
            const section = this.ownerDocument.createElement('section');

            // Crear el div de la tarjeta con el título
            const cardDiv = this.ownerDocument.createElement('div');
            cardDiv.className = 'card';

            const title = this.ownerDocument.createElement('h3');
            title.style.color = this.cardcolor;
            title.textContent = this.cardtitle || 'Default Title';
            cardDiv.appendChild(title);
            section.appendChild(cardDiv);

            // Crear la lista de clubs
            const clubList = this.ownerDocument.createElement('div');
            clubList.className = 'club-list';

            // Crear y añadir cada club
            this.clubs.forEach(club => {
                const clubContainer = this.ownerDocument.createElement('div');
                clubContainer.className = 'club-info-container';

                const clubInfo = this.ownerDocument.createElement('club-info');
                clubInfo.setAttribute('uid', club.uid || '');
                clubInfo.setAttribute('image', club.image);
                clubInfo.setAttribute('name', club.name);
                clubInfo.setAttribute('members', club.members.toString());
                clubInfo.setAttribute('button', club.button || '');
                clubContainer.appendChild(clubInfo);

                clubList.appendChild(clubContainer);
            });

            // Crear el botón principal
            const mainButton = this.ownerDocument.createElement('button');
            mainButton.style.backgroundColor = this.buttoncolor;
            mainButton.textContent = this.buttontext || 'Default Button';
            mainButton.className = 'main-button';
            clubList.appendChild(mainButton);

            section.appendChild(clubList);
            this.shadowRoot.appendChild(section);
        }
    }
}

customElements.define('clubs-card', ClubsCard);
export default ClubsCard;