import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { DatabaseConnection } from '../DataBase';
import { useNavigation } from '@react-navigation/native';

const db = new DatabaseConnection.getConnection;

export default function Exibe() {

    const [filmes, setFilmes] = useState([]);

    const atualizaRegistros = () => {
        try {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT id, nome_filme, genero, classificacao, data_cad AS dataInsercao FROM filmes',
                    [],
                    (_, { rows }) => setFilmes(rows._array),
                    (_, error) => console.error('Erro ao buscar todos:', error)
                );
            });
        } catch (error) {
            console.error('Erro ao buscar todos:', error);
        }
    };

    useEffect(() => {
        atualizaRegistros();
    }, []);

    const navigation = useNavigation();

    const EditarFilmeScreen = (filme) => {
        navigation.navigate('EditarFilme', filme);
    };

    const deletarFilme = (id) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM filmes WHERE id = ?',
                    [id],
                    (_, result) => resolve(result),
                    (_, error) => reject(error)
                );
            });
        });
    };

    const handleExcluirFilme = async (id) => {
        Alert.alert(
            'Excluir Filme',
            'Tem certeza de que deseja excluir este filme?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        try {
                            await deletarFilme(id);
                            atualizaRegistros()
                        } catch (error) {
                            console.error('Erro ao excluir filme:', error);
                            Alert.alert('Erro', 'Falha ao excluir filme. Por favor, tente novamente.');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>ID:</Text>
                <Text style={styles.text}>{item.id}</Text>
                <Text style={styles.label}>Nome:</Text>
                <Text style={styles.text}>{item.nome_filme}</Text>
                <Text style={styles.label}>Gênero:</Text>
                <Text style={styles.text}>{item.genero}</Text>
                <Text style={styles.label}>Classificação:</Text>
                <Text style={styles.text}>{item.classificacao}</Text>
                <Text style={styles.label}>Data de Inserção:</Text>
                <Text style={styles.text}>{item.dataInsercao}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => EditarFilmeScreen(item)} style={[styles.button, { backgroundColor: '#3498db' }]}>
                    <FontAwesome6 name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleExcluirFilme(item.id)} style={[styles.button, { backgroundColor: '#e74c3c' }]}>
                    <FontAwesome6 name="trash-alt" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filmes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        paddingHorizontal: 10,
    },
    listContainer: {
        paddingTop: 20,
        paddingBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
    },
    infoContainer: {
        alignSelf: 'flex-start',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#34495e',
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: '#2c3e50',
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
});
