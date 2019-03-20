import redis from 'redis';
import { Request, Response, NextFunction, Router } from "express";

const client = redis.createClient();

const handler = (req: Request, res: Response, next: NextFunction) => {
  if (req.method.toLowerCase() === 'get') {
    let key = "__expIress__" + req.originalUrl || req.url;
  
    client.get(key, function(err, data){
      if(data){
        res.send(data);
      }else{
        const updateRes = {
          send: (body: any) => {
            res.send(body);

            client.set(key, JSON.stringify(body));
            client.setex(key, 300, body);
          }
        }

        Object.assign(res, updateRes);

        next();
      }
    });
  } else {
    next();
  }
};

export const redisMiddleware = (router: Router) =>
  router.use(handler)
