import { Stack } from "expo-router";
import { View, Text } from 'react-native';
import { styles } from './styles';
import Icon from './icon'; 
import CustomText from "./component/CustomText";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen     
        name="index"
        options={{
          header: () =>
        (
          <View  style={styles.headerlayout}>
            <View>

              <CustomText style={styles.texttopheader}></CustomText>
            </View>
            <View style={styles.layoutIcon}>
            <Icon name="icon_calculate" size={70} color="white" style={styles.iconlayout} />
            <CustomText style={styles.textbottomheader}>Bridge Scorer</CustomText>
            </View>
          </View>
        ),      
        }}
      />          
    </Stack>
  );
}
