import React, {useEffect} from 'react';

import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  Text,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BleManager} from 'react-native-ble-plx';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const mainContainer = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const ble = new BleManager();

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(granted => {
      if (granted) {
        ble.startDeviceScan(null, null, async (error, device) => {
          console.log('DEVICE', device?.id, await device?.isConnected());
          ToastAndroid.show(
            `DEVICE ${device?.id} is connected, check log for more info`,
            ToastAndroid.SHORT,
          );
          ble.stopDeviceScan();

          ble.onStateChange(state => {
            console.log('DEVICE STATE', state);
          });

          if (error) {
            console.log('ERROR', error);
            ble.stopDeviceScan();
            return;
          }
        });
      } else {
        console.log('ACCESS_FINE_LOCATION permission denied');
      }
    });

    return () => {
      ble.stopDeviceScan();
    };
  }, []);

  return (
    <SafeAreaView style={mainContainer}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={mainContainer.backgroundColor}
      />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>BLE</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
