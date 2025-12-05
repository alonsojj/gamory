import axios from "axios";
import { auth } from "../config/config.js";

const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_BASE_URL = "https://api.igdb.com/v4";
const IMAGE_BASE_URL = "https://images.igdb.com/igdb/image/upload/";

let accessToken = null;

const authenticate = async () => {
  try {
    const body = `client_id=${auth.clientId}&client_secret=${auth.clientSecret}&grant_type=client_credentials`;

    const response = await axios.post(TWITCH_AUTH_URL, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    accessToken = response.data.access_token;
    console.log("Successfully authenticated with Twitch API.");
    return accessToken;
  } catch (error) {
    console.error(
      "Failed to authenticate with Twitch API:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const getHeaders = () => ({
  "Client-ID": auth.clientId,
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "text/plain",
});

export const searchGames = async ({ name, id, limit }) => {
  if (!limit) {
    limit = 10;
  }
  if (!accessToken) {
    await authenticate();
  }

  let body;
  if (name) {
    body = `fields id, name, genres.name, platforms.name, summary, cover.image_id, artworks.image_id, game_type; search "${name}"; limit ${limit};`;
  } else if (id) {
    if (Array.isArray(id) && id.length === 0) {
      throw new Error("The 'id' array cannot be empty when searching by ID.");
    }
    const idList = Array.isArray(id) ? `(${id.join(",")})` : id;
    body = `fields id, name, genres.name, platforms.name, summary, cover.image_id, artworks.image_id, game_type; where id = ${idList} & game_type = 0;`;
  } else {
    throw new Error("Provide either 'name' or 'id' to search");
  }

  try {
            const response = await axios.post(`${IGDB_BASE_URL}/games`, body, {
              headers: getHeaders(),
            });
            const games = response.data.map((game) => ({      ...game,
      coverUrl: game.cover
        ? `${IMAGE_BASE_URL}t_cover_big/${game.cover.image_id}.jpg`
        : null,
      bannerUrl:
        game.artworks && game.artworks.length > 0
          ? `${IMAGE_BASE_URL}t_1080p/${game.artworks[0].image_id}.jpg`
          : null,
    }));

    return games;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("Access token expired. Re-authenticating...");
      await authenticate();
      return searchGames({ name, id });
    }
    console.error("Failed to fetch data from IGDB:", error.message);
    console.error(error);

    throw error;
  }
};

export const getPopularGames = async (limit = 10) => {
  if (!accessToken) {
    await authenticate();
  }
  const body = `fields id, name, cover.image_id; where game_type = 0 & rating_count > 0; sort rating_count desc; limit ${limit};`;
  try {
    const response = await axios.post(`${IGDB_BASE_URL}/games`, body, {
      headers: getHeaders(),
    });
    return response.data.map((game) => ({
      id: game.id,
      name: game.name,
      coverUrl: game.cover
        ? `${IMAGE_BASE_URL}t_cover_big/${game.cover.image_id}.jpg`
        : null,
    }));
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("Access token expired. Re-authenticating...");
      await authenticate();
      return getPopularGames(limit);
    }
    console.error("Failed to fetch popular games from IGDB:", error.message);

    throw error;
  }
};

export const getUpcomingGames = async (limit = 10) => {
  if (!accessToken) {
    await authenticate();
  }

      const currentTimestamp = Math.floor(Date.now() / 1000);
  const sixMonthsFromNow = currentTimestamp + 15768000;

  const body = `
    fields id, name, first_release_date, cover.image_id, summary;
    where game_type = 0 & 
          first_release_date != null & 
          first_release_date >= ${currentTimestamp} & 
          first_release_date <= ${sixMonthsFromNow};
    sort first_release_date asc;
    limit ${limit};
  `;
  try {
            const response = await axios.post(`${IGDB_BASE_URL}/games`, body, {
              headers: getHeaders(),
            });
            return response.data.map((game) => ({      id: game.id,
      name: game.name,
      releaseDate: game.first_release_date
        ? new Date(game.first_release_date * 1000).toLocaleDateString()
        : "Data não disponível",
      releaseTimestamp: game.first_release_date,
      coverUrl: game.cover
        ? `${IMAGE_BASE_URL}t_cover_big/${game.cover.image_id}.jpg`
        : null,
      summary: game.summary || "Descrição não disponível",
    }));
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("Access token expired. Re-authenticating...");
      await authenticate();
      return getUpcomingGames(limit);
    }
    console.error("Failed to fetch upcoming games from IGDB:", error.message);
    console.error(error);
    throw error;
  }
};
