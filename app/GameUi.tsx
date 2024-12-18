import { useState } from 'react';
import { View,  TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { format } from 'date-fns';
import { styles } from './styles';
import Icon from './icon';
import CustomText from './component/CustomText';

const GameUI = ({ games, onCreateGame, onSelectGame, openModal }) => {
  const [newGameName, setNewGameName] = useState('');
  return (
    <View style={styles.mainContainer}>
      <View style={styles.sectionContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('./images/hello.png')}
            style={{ width: 40, height: 45, marginLeft: 10, marginBottom: 10, marginTop: 10 }}
          />
          <CustomText style={[styles.messagepartie]}>
            Create a new game 
          </CustomText>
        </View>
        <TextInput
          style={styles.inputGame}
          placeholder="Nom de la nouvelle partie"
          value={newGameName}
          onChangeText={setNewGameName}
        />
        <TouchableOpacity
          style={styles.buttoncreate}
          onPress={() => {
            onCreateGame(newGameName);
            setNewGameName('');
          }}
        >
          <CustomText style={styles.buttonTextNext}>Create</CustomText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={games}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.gameItemContainer}
            onPress={() => onSelectGame(item.name)}
          >
            <View style={styles.gameItem}>
              <CustomText style={styles.gameName}>{item.name}</CustomText>
              {item.dateCreated && (
                <CustomText>{format(new Date(item.dateCreated), 'dd/MM/yyyy')}</CustomText>
              )}
              <CustomText style={styles.gameBoards}>{item.boards.length} deals</CustomText>
            </View>
            <TouchableOpacity
        onPress={() => onSelectGame(item.name)}
        style={styles.deleteButton}
      >
        <Icon name="Arrow_right" size={20} color="black" style={{ marginleft: 200 }} />
      </TouchableOpacity>
     </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default GameUI;
