import { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import * as Const from './const';
import { styles } from './styles';
import { calculateBridgePoints } from './bridgeScoreComputer';
import { Affichage_Tableau } from './visualScoreSheet';
import { loadGames, createNewGame, selectGame, saveCurrentGame, deleteGame } from './GameManage';
import GameUI from './GameUi';
import Icon from './icon'; 
import { useFonts } from 'expo-font';
import CustomText from './component/CustomText';
import { ModalDelete } from "./component/ModalDelete";
import ModalEdit from './component/ModalEdit';
import Tab from './component/Tab'; 

const initialBoardState = {
  level: null,
  trump: null,
  declaring: null,
  vulnerability: null,
  doubled: null,
  tricks: null,
};

const App = () => {
  const [games, setGames] = useState([]); // État pour stocker les jeux chargés
  const [currentGame, setCurrentGame] = useState(null); // État pour le jeu actuellement sélectionné
  const [boardList, setBoardList] = useState([]); // État pour la liste des tableaux de jeu
  const [showPicker, setShowPicker] = useState(false); // État pour afficher ou masquer le sélecteur
  const parameters = Object.keys(Const.PARAMETERS_VALUE); // Liste des paramètres de jeu définis
  const [currentParameterIndex, setCurrentParameterIndex] = useState(0); // Index du paramètre actuellement sélectionné
  const [board, setBoard] = useState(initialBoardState); // État pour les détails du tableau de jeu en cours
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null); // Index du bouton sélectionné dans le sélecteur
  const [editingBoardIndex, setEditingBoardIndex] = useState(null);
  const [newGameName, setNewGameName] = useState(""); // Nouveau nom du jeu en cours d'édition
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);

  const openModal = (gameName) => {
    setGameToDelete(gameName);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setGameToDelete(null);
  };

  const confirmDelete = () => {
    if (gameToDelete) {
      handleDeleteGame(gameToDelete);    
    }
  };

  useEffect(() => {
    // Effet de chargement initial pour charger les jeux existants
    const fetchGames = async () => {
      const loadedGames = await loadGames();
      setGames(loadedGames);
    };
    fetchGames();
  }, []);

  // Fonction pour créer un nouveau jeu
  const handleCreateGame = (newGameName) => {
    const updatedGames = createNewGame(games, newGameName);
    setGames(updatedGames);
    setCurrentGame(updatedGames.find((game) => game.name === newGameName));
    setBoardList([]);
  };

  // Fonction pour sélectionner un jeu existant
  const handleSelectGame = (gameName) => {
    const selected = selectGame(games, gameName);
    setCurrentGame(selected);
    setBoardList(selected.boards);
  };

  // Fonction pour supprimer un jeu
  const handleDeleteGame = async (gameName) => {
    const updatedGames = await deleteGame(games, gameName);
    setGames(updatedGames);
    setCurrentGame(null);
    closeModal();
  };

  // Vérifie si un paramètre est sélectionné avec une valeur spécifique
  const isParameterSelected = (parameter, value) => {
    return board[parameter] === value;
  };

  // Gère le changement de valeur dans le sélecteur
  const handleValueChange = (value, index) => {
    const parameter = parameters[currentParameterIndex];
    const updatedBoard = { ...board, [parameter]: value };
    setBoard(updatedBoard);
    setSelectedButtonIndex(index);
    handleConfirm(value);
  };

  // Confirme la sélection d'une valeur dans le sélecteur
  const handleConfirm = (value) => {
    const parameter = parameters[currentParameterIndex];
    const updatedBoard = { ...board, [parameter]: value };

    if (currentParameterIndex + 1 === parameters.length) {
      const bridgePoints = calculateBridgePoints(updatedBoard);
      let nsPoints = null;
      let ewPoints = null;

      if (board.declaring === 0 || board.declaring === 1) {
        if (bridgePoints >= 0) {
          nsPoints = bridgePoints;}
           else { ewPoints = Math.abs(bridgePoints);}
      } else {
        if (bridgePoints >= 0) {
          ewPoints = bridgePoints;}
           else { nsPoints = Math.abs(bridgePoints);}
      }

      const newBoard = {
        ...updatedBoard,
        points: bridgePoints,
        NS: nsPoints,
        EW: ewPoints,
      };

      if (editingBoardIndex !== null) {
        // Mise à jour d'une "donne" existante
        setBoardList((prevBoardList) =>
          prevBoardList.map((board, index) =>
            index === editingBoardIndex ? newBoard : board
          )
        );
      } else {
        // Ajout d'une nouvelle "donne"
        setBoardList((prevBoardList) => [...prevBoardList, newBoard]);
      }

      resetPicker();
      const updatedGames = saveCurrentGame(games, currentGame, [
        ...boardList.slice(0, editingBoardIndex),
        newBoard,
        ...boardList.slice(editingBoardIndex + 1),
      ]);
      setGames(updatedGames);
      setEditingBoardIndex(null); // Réinitialiser l'index d'édition
    } else {
      setCurrentParameterIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Réinitialise le sélecteur et les états associés
  const resetPicker = () => {
    setBoard(initialBoardState);
    setShowPicker(false);
    setCurrentParameterIndex(0);
    setSelectedButtonIndex(null);
    setEditingBoardIndex(null); // Réinitialiser l'index d'édition
  };

  // Gère l'édition d'un tableau de jeu existant
  const handleEdit = (index) => {
    const selectedBoard = boardList[index];
    setBoard(selectedBoard);
    setShowPicker(true);
    setEditingBoardIndex(index); // Définir l'index de la "donne" en cours d'édition
  };

  // Supprime un tableau de jeu de la liste
  const handleDelete = (index) => {
    setBoardList((prevBoardList) =>
      prevBoardList.filter((_, i) => i !== index)
    );
  };

  // Réinitialise le sélecteur et revient à l'accueil
  const handleHome = () => {
    resetPicker();
  };

  // Rendu des boutons de paramètre dans le sélecteur
  const renderParameterButtons = () => {
    const currentParameter = parameters[currentParameterIndex];
    let currentParameterValues = Const.PARAMETERS_VALUE[currentParameter];
  
    // Si le paramètre est 'tricks', ajuster les valeurs en fonction du niveau du tableau
    if (currentParameter === 'tricks') {
      currentParameterValues = Const.PARAMETERS_VALUE.tricks.slice(
        board.level - 1,
        board.level + 13
      );
    }
  
    if (!Array.isArray(currentParameterValues)) {
      currentParameterValues = [];
    }
  
    // Déterminer si l'édition est en cours
    const isEditing = editingBoardIndex !== null;
  
    // Choix du style du conteneur en fonction du paramètre actuel
    const buttonContainerStyle =
      currentParameter === 'tricks'
        ? styles.tricksButtonContainer
        : styles.buttonContainer;
  
    return (
      <View style={buttonContainerStyle}>
        {currentParameterValues.map((item, index) => {
          const value = typeof item === 'object' ? item.value : item;
          const isSelected = isParameterSelected(currentParameter, value);
  
          // Déterminer le style du bouton en fonction de l'état de l'édition
          const buttonStyle = [
            styles.button,
            isSelected ? styles.selectedButton : (isEditing ? styles.unselectedPicker : null),
            isSelected && isEditing ? styles.selectedParameter : null,
            currentParameter === 'tricks' && styles.tricksButton,
            currentParameter === 'tricks' && isSelected && styles.SelectedTricksButton,
          ];
          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleValueChange(value, index)}
            >
              {typeof item === 'object' && item.icon ? (
                <Icon name={item.icon} style={{ alignSelf: 'center' }} />
              ) : (
                <CustomText style={[styles.buttonText, value === '0' ]}>
                  {value === '0' ? '=' : (typeof item === 'object' ? item.label : item.toString())}
                </CustomText>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Récupère le message associé au paramètre actuel dans le sélecteur
  const getMessage = () => {
    const currentParameter = parameters[currentParameterIndex];
    const messageObj = Const.MESSAGES.find(
      (msg) => msg.name === currentParameter
    );
    return messageObj ? messageObj.message : "";
  };

  ////////////////////
  /////Edit Modal/////
  ///////////////////
  
  const openEditModal = (gameName) => {
    setIsEditModalVisible(true);  // Modal pour édition du nom
    setNewGameName(gameName);
  };
  
  // Fonction pour fermer le modal d'édition du nom du jeu
  const closeEditGameModal = () => {
    setIsEditModalVisible(false); // Ferme le modal
    setNewGameName(""); // Réinitialise le champ d'entrée du nom du jeu
  };

  // Fonction pour sauvegarder le nouveau nom du jeu édité
  const saveEditedGameName = (name) => {
    const updatedGames = games.map(game => 
      game.name === currentGame.name ? { ...game, name: name } : game
    );
    setGames(updatedGames);
    setCurrentGame({ ...currentGame, name: name });
    closeEditGameModal(); // Ferme le modal après la sauvegarde
  };

  ////////////////////////
  /////Fin Edit Modal/////
  ////////////////////////

  return (
    <View style={styles.mainContainer}>
      {!currentGame ? ( // Si aucun jeu n'est sélectionné, affiche l'interface de gestion des jeux
        <View style={styles.gameManagementContainer}>
          <GameUI
            games={games}
            onCreateGame={handleCreateGame}
            onSelectGame={handleSelectGame}
            openModal={openModal}
          />
        </View>
      ) : (
        // Si un jeu est sélectionné, affiche les détails du jeu et les tableaux de jeu
        <View style={styles.gameDetailsContainer}>
          <View style={styles.currentGameContainer}>
            <CustomText style={styles.currentGameText}>
              Current game : {currentGame.name}
            </CustomText>
            <TouchableOpacity onPress={() => openEditModal(currentGame.name)}>
              <Icon name={"edit_crayon"} color="black" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openModal(currentGame.name)} style={styles.deleteButton}>
              <Icon name={"trash"} color="red" style={{ marginTop: -8, marginRight: -10 }} />
            </TouchableOpacity>
          </View>
          {showPicker ? ( // Si le sélecteur est affiché, affiche le sélecteur de paramètres
            <ScrollView style={styles.scrollViewBouton}>
              <View style={[styles.pickerContainer]}>
              <Tab
                  currentIndex={currentParameterIndex + 1}
                  totalSteps={parameters.length}
                />
                <CustomText style={styles.message}>{getMessage()}</CustomText>
                <View style={[styles.buttonContainer, { marginTop: 10 }]}>
                  {renderParameterButtons()}
                </View>
                <View
                  style={[
                    styles.navigationButtons,
                    { marginTop: 100 },
                    styles.buttonContainer,
                  ]}
                >
                  <TouchableOpacity
                    style={[{ marginTop: 40 }]}
                    onPress={handleHome}
                  >
                    <CustomText style={[styles.buttonText, styles.buttonTextCancel]}>
                      Cancel
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          ) : (
            // Sinon, affiche la liste des tableaux de jeu avec les options d'édition et de retour
            <View style={styles.boardListContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: 50,
                }}
              >
                <Icon
                  name="carte_donne"
                  size={20}
                  color="black"
                  style={{ marginRight: 5, marginLeft: 20 }}
                />
                <CustomText style={[styles.currentGameText, { marginTop: 14 }]}>
                  List of deals
                </CustomText>
              </View>
              <Affichage_Tableau
                boardList={boardList}
                setShowPicker={setShowPicker}
                setCurrentGame={setCurrentGame}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </View>
          )}
        </View>
      )}
      <ModalDelete
        modalVisible={modalVisible}
        closeModal={closeModal}
        confirmDelete={confirmDelete}
      />
      <ModalEdit
        modalVisible={isEditModalVisible}
        closeEditGameModal={closeEditGameModal}
        saveEditedGameName={saveEditedGameName}
        currentGameName={newGameName}  // Passe le nom du jeu actuel à la modal d'édition
      />
    </View>
  );
};

export default App;
