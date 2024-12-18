import { View, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './styles'; 
import Icon from './icon';
import * as Const from './const'; 

import { getDoubledSvg, getSvgName } from './const';
import CustomText from './component/CustomText';

export const Affichage_Tableau = ({ boardList, handleEdit, setShowPicker, setCurrentGame, handleDelete }) => {
  // Fonction pour obtenir le label correspondant à la valeur de declaring
  const getDeclaringLabel = (value) => {
    const DeclaringLabel = Const.PARAMETERS_VALUE.declaring.find(item => item.value === value);
    return DeclaringLabel ? DeclaringLabel.label : ''; // Retourner le label correspondant ou une chaîne vide s'il n'est pas trouvé
  };

  // Obtient les résultats visuels d'un tableau de jeu
  const getBoardVisualResults = (board) => {
    let resultText;
    let isZeroTricks = false;
    if (board.tricks === '0') {
      resultText = "=";
      isZeroTricks = true;}
       else {resultText = "  " + [board.tricks].filter(Boolean).join(' ');}

    const svgName = getSvgName(board.level, board.trump);
    const doubledSvgName = getDoubledSvg(board.doubled);
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 34 }}>
        <Icon name={svgName} size={24} color="black" style={{ marginLeft: 14 }}/>
        {doubledSvgName && (
          <View style={{ position: 'absolute', zIndex: 1 }}>
            <Icon name={doubledSvgName} color="black" style={{ marginLeft: 28, marginTop: 14 }}/>
          </View>
        )}
        <CustomText style={isZeroTricks ? styles.zeroTricks : null}>
          {resultText}
        </CustomText>
      </View>
    );
  };

  return (
    <>
      <View>
        {/* En-tête du tableau */}
        <View style={styles.tableHeader}>
          <CustomText style={styles.tableCell}>Deal</CustomText>
          <CustomText style={styles.tableCell}>Contract</CustomText>
          <CustomText style={styles.tableCell}>Declarer</CustomText>
          <CustomText style={styles.tableCell}>N/S</CustomText>
          <CustomText style={styles.tableCell}>E/W</CustomText>
        </View>
        {/* Contenu principal avec ScrollView pour faire défiler */}
        <ScrollView style={styles.scrollView}>
          {boardList.map((board, index) => (
            <TouchableOpacity key={index} onPress={() => handleEdit(index)} style={styles.tableRow}>
              <CustomText style={styles.tableCell}>{(index + 1).toString()}</CustomText>
              <CustomText style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">{getBoardVisualResults(board)}</CustomText>
              <CustomText style={[styles.tableCell, { color: board.vulnerability > 0 ? 'red' : 'green' }]} numberOfLines={1} ellipsizeMode="tail">{board.declaring != null ? getDeclaringLabel(board.declaring) : ''}</CustomText>
              <CustomText style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">{board.NS != null ? board.NS.toString() : ''}</CustomText>
              <CustomText style={styles.tableCell} numberOfLines={1} ellipsizeMode="tail">{board.EW != null ? board.EW.toString() : ''}</CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View>
          <View style={styles.buttonContainer}>
            <Icon name="icon_plus" size={18} color="black" style={{  marginTop: 10 }} />
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <CustomText style={styles.AddDonne}>Add a deal</CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setCurrentGame(null)}>
              <CustomText style={styles.BackDonne}>Back</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};