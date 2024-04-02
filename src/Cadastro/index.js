import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from '../DataBase';

const db = new DatabaseConnection.getConnection;

export default function Cadastro() {

    const [nome, setNome] = useState('');
    const [genero, setGenero] = useState('');
    const [classificacao, setClassificacao] = useState('');

    inserirFilme = (nome_filme, genero, classificacao) => {
        return new Promise((resolve, reject) => {
            const data_cad = new Date().toISOString().slice(0, 19).replace('T', ' ');
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        'INSERT INTO filmes (nome_filme, genero, classificacao, data_cad) VALUES (?, ?, ?, ?)',
                        [nome_filme, genero, classificacao, data_cad],
                        (_, { rowsAffected, insertId }) => {
                            if (rowsAffected > 0) {
                                resolve(insertId);
                            } else {
                                reject(new Error('Nenhum filme inserido.'));
                            }
                        },
                        (_, error) => reject(error)
                    );
                },
                (error) => reject(error)
            );
        });
    };

    const handleInserirFilme = async () => {
        try {
            await inserirFilme(nome, genero, classificacao);
            Alert.alert('Sucesso', 'Filme inserido com sucesso.');
            setNome('');
            setGenero('');
            setClassificacao('');
        } catch (error) {
            console.error('Erro ao inserir filme:', error);
            Alert.alert('Erro', 'Falha ao inserir filme. Por favor, tente novamente.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Cadastro de Filmes</Text>

            <TextInput
                style={styles.input}
                placeholder='Digite o Nome do Filme'
                value={nome}
                onChangeText={text => setNome(text)}
            />

            <TextInput
                style={styles.input}
                placeholder='Digite o Gênero do Filme'
                value={genero}
                onChangeText={text => setGenero(text)}
            />

            <TextInput
                style={styles.input}
                placeholder='Digite a Classificação do Filme'
                value={classificacao}
                onChangeText={text => setClassificacao(text)}
            />

            <Button title="Cadastrar" onPress={handleInserirFilme} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9ca24', // Amarelo vibrante
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', // Branco
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#fff', // Branco
        backgroundColor: '#fff', // Branco
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});
