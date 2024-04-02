import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DatabaseConnection } from '../DataBase';

const db = new DatabaseConnection.getConnection;

export default function EditarFilmeScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const item = route.params;

    const [nomeFilme, setNomeFilme] = useState(item.nome_filme);
    const [genero, setGenero] = useState(item.genero);
    const [classificacao, setClassificacao] = useState(item.classificacao);
    const [dataInsercao, setDataInsercao] = useState(item.dataInsercao);

    const handleSalvarEdicao = async () => {
        try {
            await editarFilme(item.id, nomeFilme, genero, classificacao, dataInsercao);
            Alert.alert('Sucesso', 'Filme atualizado com sucesso.');
            navigation.navigate('Exibe');
        } catch (error) {
            console.error('Erro ao editar filme:', error);
            Alert.alert('Erro', 'Falha ao editar filme. Por favor, tente novamente.');
        }
    };

    const editarFilme = async (id, nomeFilme, genero, classificacao, dataInsercao) => {
        await db.transaction(tx => {
            tx.executeSql(
                'UPDATE filmes SET nome_filme = ?, genero = ?, classificacao = ? WHERE id = ?',
                [nomeFilme, genero, classificacao, id],
                (_, { rowsAffected }) => {
                    console.log(rowsAffected);
                },
                (_, error) => {
                    console.error('Erro ao editar filme:', error);
                    throw error;
                }
            );
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Filme</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do Filme"
                value={nomeFilme}
                onChangeText={setNomeFilme}
            />
            <TextInput
                style={styles.input}
                placeholder="Gênero"
                value={genero}
                onChangeText={setGenero}
            />
            <TextInput
                style={styles.input}
                placeholder="Classificação"
                value={classificacao}
                onChangeText={setClassificacao}
            />
            <TouchableOpacity style={styles.button} onPress={handleSalvarEdicao}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5', // Cor de fundo suave
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333', // Cor do título
    },
    input: {
        width: '100%',
        height: 50,
        marginBottom: 20,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff', // Cor de fundo do input
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007bff', // Cor do botão
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 3, // Sombra
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', // Cor do texto do botão
    },
});
