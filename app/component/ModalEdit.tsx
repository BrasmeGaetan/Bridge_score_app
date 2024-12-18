import  { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../styles';
import CustomText from './CustomText';

const ModalEdit = ({ modalVisible, closeEditGameModal, saveEditedGameName, currentGameName }) => {
  const [newGameName, setNewGameName] = useState(currentGameName);

  useEffect(() => {
    setNewGameName(currentGameName);
  }, [currentGameName]);

  const handleSave = () => {
    saveEditedGameName(newGameName);
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeEditGameModal}
    >
      <View style={styles.modalContainerGame}>
        <View style={styles.modalContent}>
          <CustomText style={styles.modalHeaderText}>Edit Game Name</CustomText>
          <TextInput
            style={styles.input}
            value={newGameName}
            onChangeText={setNewGameName}
            placeholder="Enter new game name"
          />
          <View style={styles.modalButtonEditGame}>
            <TouchableOpacity onPress={closeEditGameModal} style={styles.modalButton}>
              <CustomText style={styles.modalButtonTextCancel}>Cancel</CustomText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
              <CustomText style={styles.modalButtonTextSave}>Save</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalEdit;
