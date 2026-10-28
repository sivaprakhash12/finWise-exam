import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
  useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/auth/SplashScreen';
import { COLORS } from './src/theme';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: COLORS.honeydew, primary: COLORS.primary, card: COLORS.honeydew, text: COLORS.dark },
};

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {splash ? (
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => setSplash(false)}>
            <SplashScreen fontsLoaded={fontsLoaded} />
          </TouchableOpacity>
        ) : (
          <AppProvider>
            <NavigationContainer theme={theme}>
              <RootNavigator />
            </NavigationContainer>
          </AppProvider>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
