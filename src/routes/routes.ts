import * as restify from "restify";
// import { generateToken, login } from "../services/authentification";
import { Parameters } from "../models/parameters";
import * as playerStatsServices from "../services/player-stats";
import { handle } from "../utils/api";

module.exports = function (server: restify.Server, params: Parameters) {

  server.get(<restify.RouteOptions> {
    parameters: [
      params.player_id
    ],
    path: "/players/:player_id"
  }, handle(playerStatsServices.getTennisPlayers));

  server.del(<restify.RouteOptions> {
    parameters: [
      params.player_id
    ],
    path: "/players/:player_id"
  }, handle(playerStatsServices.deleteTennisPlayer));

  server.get(<restify.RouteOptions> {
    path: "/players"
  }, handle(playerStatsServices.getTennisPlayers));

};
