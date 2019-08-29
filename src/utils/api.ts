import * as restify from "restify";
import * as errors from "restify-errors";

export function handle(handler: (parameters: any) => Promise<any>, content = "json") {
  function service(req: restify.Request, res: restify.Response, next: restify.Next) {
    handler(req["parameters"])
      .then((data) => {
        // no cache on rest api, see @tf1/mytf1vod-commons-cache module for route caching
        res.cache("no-cache");
        switch (content) {
        case "redirect":
          res.redirect(302, data, next);
          break;
        case "html":
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(data);
          break;
        default:
          res.json(data);
          break;
        }
        next();
      })
      .catch((err) => {
        // check if error is already a restify error
        if (err instanceof errors.RestError || err instanceof errors.HttpError) {
          next(err);
          return;
        }
        // log unexpected error
        req.log.error(err);
        next(new errors.InternalError(err, "unexpected error"));
      });
  }
  return service;
}
