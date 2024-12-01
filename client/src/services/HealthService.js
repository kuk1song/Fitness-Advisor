import DOMPurify from "../../node_modules/dompurify/dist/purify";

const HEALTH_URL = 'http://localhost:5000/api/health'; // backend server
const USER_URL = 'http://localhost:5000/api/user'; // also backend server

export const HealthService = {
    add: async (userData) => {
        //? +-------------------------+
        //? | 1. Get the Given Data   |
        //? +-------------------------+
        let { email } = userData;

        // If email is empty or not included
        if (!email) {
            return false;
        }
        email = DOMPurify.sanitize(email);
        
        try {
            //? +-------------------------+
            //? | 2.Get the User ID Data  |
            //? +-------------------------+
            const userResult = await fetch(USER_URL + `?email=${email}`);
            const userId = userResult.id;
            if(!userId) {
                alert("You haven't been registered yet!");
                return false;
            }


            //? +-------------------------+
            //? | 3.Send the Health Data  |
            //? +-------------------------+
            console.log(userResult);
            const result = await fetch(HEALTH_URL, {
                method: "POST",
                body: JSON.stringify({userId, ...userData})
            }); 

            return result;
        }
        catch (e) {
            console.error(e);
            return false;
        }

    }
}