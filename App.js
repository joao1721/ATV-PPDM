import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


import Home from './src/Home/home.js'
import Exibe from './src/Exibe/index.js'
import Pesquisar from './src/Pesquisar/index.js'
import Cadastro from './src/Cadastro/index.js'
import EditarFilmeScreen from './src/EditarFilme/index.js';




const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen
          name='Home'
          component={Home}
          
        />
        <Stack.Screen
          name='Cadastro'
          component={Cadastro}
        />
        <Stack.Screen
          name='Exibe'
          component={Exibe}
        />
        <Stack.Screen
          name='Pesquisar'
          component={Pesquisar}
        />

        <Stack.Screen
          name='EditarFilme'
          component={EditarFilmeScreen}
        />


      </Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
