import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../DataBase';

const db = new DatabaseConnection.getConnection;

export default function Home() {

    const navigation = useNavigation();

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS filmes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    nome_filme TEXT NOT NULL, 
                    genero TEXT NOT NULL, 
                    classificacao TEXT NOT NULL, 
                    data_cad DATETIME DEFAULT (datetime('now', 'localtime'))
                )`,
                [],
                () => console.log('Tabela criada com sucesso'),
                (_, error) => console.error(error)
            );
        });
    }, []);

    const navegaCadastro = () => {
        navigation.navigate('Cadastro');
    }

    const navegaExibirRegistros = () => {
        navigation.navigate('Exibe')
    }

    const navegaPesquisarFilme = () => {
        navigation.navigate('Pesquisar')
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>SEJA BEM VINDO!</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={navegaCadastro}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={navegaExibirRegistros}>
                <Text style={styles.buttonText}>Exibir Todos os Registros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={navegaPesquisarFilme}>
                <Text style={styles.buttonText}>Pesquisar filme</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff6f61',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
