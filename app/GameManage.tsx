import AsyncStorage from '@react-native-async-storage/async-storage';
//AsyncStorage est une API fournit par React native pour stocker des donnees 

// Fonction pour sauvegarder les parties dans AsyncStorage
export const saveGames = async (games) => {
  try {
    // Convertit la liste des jeux en chaîne JSON et la sauvegarde sous la clé 'games'.
    await AsyncStorage.setItem('games', JSON.stringify(games));
  } catch (e) {
    console.error("Failed to save games to AsyncStorage", e);
  }
};

// Fonction pour charger les parties depuis AsyncStorage
export const loadGames = async () => {
  try {
    const gamesData = await AsyncStorage.getItem('games');
    let games = gamesData ? JSON.parse(gamesData) : [];

    // Mise à jour des jeux existants pour inclure dateCreated si manquant
    games = games.map(game => {
      if (!game.dateCreated) {
        return { ...game, dateCreated: new Date().toISOString() };
      }
      return game;
    });

    // Sauvegarder les jeux mis à jour si nécessaire
    saveGames(games);

    return games;
  } catch (e) {
    console.error("Failed to load games from AsyncStorage", e);
    return [];
  }
};

// Fonction pour créer une nouvelle partie
export const createNewGame = (games, newGameName) => {
  if (!newGameName.trim()) {
    const existingPartiesCount = games.filter(game => game.name.startsWith('Partie')).length;
    newGameName = `Partie ${existingPartiesCount + 1}`;
  }

  const newGame = {
    name: newGameName,
    boards: [],
    dateCreated: new Date().toISOString(),
  };
  
  const updatedGames = [...games, newGame];
  
  // Sauvegarde la liste mise à jour des jeux dans AsyncStorage.
  saveGames(updatedGames);
  return updatedGames;
};


// Fonction pour sélectionner une partie
export const selectGame = (games, gameName) => {
  return games.find(game => game.name === gameName) || null;
};

// Fonction pour sauvegarder la partie actuelle
export const saveCurrentGame = (games, currentGame, updatedBoards) => {
  const updatedGame = {
    ...currentGame,
    boards: updatedBoards,
  };
  const updatedGames = games.map((game) =>
    game.name === currentGame.name ? updatedGame : game
  );
  saveGames(updatedGames);
  return updatedGames;
};

export const deleteGame = async (games, gameName) => {
  const updatedGames = games.filter(game => game.name !== gameName);
  await saveGames(updatedGames);
  return updatedGames;
};