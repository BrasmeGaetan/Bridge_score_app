import { View, StyleSheet } from 'react-native';

const Tabs = ({ currentIndex, totalSteps }) => {
  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex >= index + 1 && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#CED5DE',
    margin: 5,
    marginBottom: 18
  },
  activeDot: {
    backgroundColor: '#029DB7',
  },
});

export default Tabs;