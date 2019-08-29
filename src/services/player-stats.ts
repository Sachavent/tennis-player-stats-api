import * as errors from "restify-errors";
import { mockStatsPlayers } from "../data-mock/stats-player-mock";

interface Player {
  id:        number;
  firstname: string;
  lastname:  string;
  shortname: string;
  sex:       string;
  country: {
    picture: string;
    code:    string;
  };
  picture:   string;
  data: {
    rank:    number;
    points:  number;
    weight:  number;
    height:  number;
    age:     number;
    last:    number[];
  };
}

export async function getTennisPlayers(params: {player_id?: number}): Promise<Player|Player[]> {

  // Return player matching to player_id
  if (params.player_id !== undefined && params.player_id !== null) {
    const player: Player = mockStatsPlayers.players.find((tennisPlayer) => tennisPlayer.id === params.player_id);

    if (player === undefined) {
      throw new errors.NotFoundError("Player not found");
    }

    return player;  }

  // Return players sorted by id
  return mockStatsPlayers.players.sort((player1, player2) => {
    return player1.id - player2.id;
  });
}

export async function deleteTennisPlayer(params: {player_id: number}): Promise<void> {
  const index: number = mockStatsPlayers.players.findIndex((tennisPlayer) =>  tennisPlayer.id === params.player_id);

  // Check player exists before deletion
  if (index === -1) {
    throw new errors.NotFoundError("Player not found");
  }

  mockStatsPlayers.players.splice(index, 1);

  return;
}
