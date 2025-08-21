import { SECRETS } from 'config/secrets';
import jwt from 'jsonwebtoken';

export async function createGithubJwt(expiry?:string | "5m"){
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (10 * 60),
      iss: SECRETS.GITHUB_APP_ID
    }
    return new Promise((res,rej)=>{
        jwt.sign(payload, SECRETS.GITHUB_API_JWT_SECRET, {algorithm:"RS256"}, (err, token) => {
            if (err) return rej(err);
            res(token);
        });
    });
}

// createGithubJwt().then(token=>console.log(token))