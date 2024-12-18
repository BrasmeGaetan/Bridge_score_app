
// CustomText.js    
import {
  Text,
  StyleSheet,
} from 'react-native';

export default function CustomText(props) {
  return (
    <Text style={[styles.defaultStyle, props.style]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  // ... add your default style here
  defaultStyle: {
    fontFamily: 'Nexa'
  },
});