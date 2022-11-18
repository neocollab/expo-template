import { deletePrivateUserData, getPrivateUserData, getUsers, updatePrivateUserData } from 'src/firebase/user-api';
import { PrivateUserData, PublicUserData } from 'src/types';
import { ConfigApi } from './config-api';

/** 
 * Users api for fetching data related to users
 * 
 * @resources
 * Customizing RTK Query with following resources
 * Firebase api calls with RTK-Query: https://stackoverflow.com/questions/71587312/is-it-possible-to-use-firebase-query-with-redux-toolkit-or-rtk-query-in-react)
 * Using queryfn: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#implementing-a-queryfn 
 * Using fakeBaseQuery: https://redux-toolkit.js.org/rtk-query/usage-with-typescript#typing-a-queryfn
 * Code Splitting: https://redux-toolkit.js.org/rtk-query/usage/code-splitting 
 * 
*/
export const UserApi = ConfigApi.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<Array<PublicUserData>, string | undefined>({
            /**
             * Generating query for fetching and paginating users
             *
             * @return {*} 
             */
            async queryFn(begID) {
                try {
                    const querySnapshot = await getUsers(begID, 3, 'desc');
                    const users = querySnapshot.docs.map(userDoc => userDoc.data());
                    return { data: users };
                } catch (e: any) {
                    console.warn(`Error with fetching users`);
                    return { error: e };
                }
            },
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetUsersQuery
} = UserApi;