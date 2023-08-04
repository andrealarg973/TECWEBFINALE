import jwt from "jsonwebtoken";

// wants to like a post:
// click like button => auth middleware(next) => like controller ...

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        //console.log(req.headers.authorizationrs);
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'secret');

            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;
            //console.log(req.userId);
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;