import { dispatch } from '../store';
import { Actions, Screens } from '../types/store';
import { getDiscoverCards, getClubsCards, addClubsCards, getUserName, removeClubsCards, getPosts, addLikes, updateProfile, removeLikes, userHasLikedPost } from '../utils/firebase';

export const navigate = (screen: Screens) => {
    return {
        action: Actions.NAVIGATE,
        payload: screen,
    };
};


export const setUserCredentials = (user: string) => {
    return {
        action: Actions.SETUSERCREDENTIALS,
        payload: user,
    };
};

export const setUserData = (user: any) => {
    return {
        action: Actions.SETUSERDATA,
        payload: user,
    };
};

export const getDiscoverCardsAction = async () => {
    const cards = await getDiscoverCards();
    return {
        action: Actions.GETDISCOVERCARDSACTION,
        payload: cards,
    };
};

export const getClubsAction = async () => {
    try {
        const clubs = await getClubsCards();
        return {
            action: Actions.GETCLUBSARDSACTION,
            payload: clubs,
        };
    } catch (error) {
        console.error("Error in getClubsAction:", error);
        return null;
    }
};

export const removeClubForUser = async (clubData: any) => {
    try {
        const success = await removeClubsCards(clubData);

        if (success) {
            // Get updated clubs after removing
            const updatedClubs = await getClubsCards();

            dispatch({
                action: Actions.GETCLUBSARDSACTION,
                payload: updatedClubs,
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in removeClubForUser:", error);
        return false;
    }
};

export const addClubForUser = async (clubData: any) => {
    try {
        const success = await addClubsCards(clubData);

        if (success) {
            // Get updated clubs after adding

            dispatch({
                action: Actions.GETCLUBSARDSACTION,
                payload: success,
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in addClubForUser:", error);
        return false;
    }
};

export const getUserNameAction = async () => {
    const user = await getUserName();
    return {
        action: Actions.GETUSERNAME,
        payload: user,
    };
};

export const getPostsAction = async () => {
    const posts = await getPosts();
    return {
        action: Actions.GETPOSTS,
        payload: posts,
    }
};

export const addLikesAction = async (postId: string, liked: boolean) => {
    try {
        const likeCount = await addLikes(postId);
        dispatch({
            type: Actions.ADDLIKES,
            payload: {
                postId,
                likeCount,
                liked,
            },
        });
        return true;
    } catch (error) {
        console.error("Error in addLikesAction:", error);
        return false;
    }
};

export const removeLikesAction = async (postId: string, liked: boolean) => {
    try {
        const likeCount = await removeLikes(postId);
        dispatch({
            type: Actions.REMOVELIKES,
            payload: {
                postId,
                likeCount,
                liked: !liked
            }
        });
        return true;
    } catch (error) {
        console.error("Error in removeLikesAction:", error);
        return false;
    }
};

export const updateProfileAction = async (userData: any) => {
    await updateProfile(userData);
    return {
        action: Actions.UPDATEPROFILE,
        payload: userData,
    }
}