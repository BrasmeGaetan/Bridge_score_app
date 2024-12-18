import { Modal, View, Text,Button } from "react-native";
import { styles } from '../styles';
  
export const ModalDelete = ({modalVisible, closeModal, confirmDelete}) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text>Would you really want to delete this game ?</Text>
          <View style={styles.modalButtons}>
            <Button title="Annuler" onPress={closeModal} />
            <Button title="Supprimer" onPress={confirmDelete} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );