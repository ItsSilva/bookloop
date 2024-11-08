import { Post } from '../components';
import { Actions } from '../types/store';

export const reducer = (currentAction: any, currentState: any) => {
	const { action, payload } = currentAction;

	switch (action) {
		case Actions.NAVIGATE:
			return {
				...currentState,
				screen: payload,
			};

		case Actions.GETPUBLICATIONS:
			return {
				...currentState,
				products: payload,
			};

		case Actions.SETUSERCREDENTIALS:
			return {
				...currentState,
				user: payload,
			};

			case Actions.GETDISCOVERCARDSACTION:
				return {
					...currentState,
					cards: payload,
				};

				case Actions.GETPUBLICATIONS:
					return {
						...currentState,
						posts: payload,
							};
		default:
			return currentState;
			
			
	}
};
