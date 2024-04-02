import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, FlatList, View, Button, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DatabaseConnection } from '../DataBase';

const db = new DatabaseConnection.getConnection;

export default function Pesquisar() {
    const [nomeFilme, setNomeFilme] = useState('');
    const [genero, setGenero] = useState('');
    const [filmes, setFilmes] = useState([]);

    useEffect(() => {
        if (nomeFilme === '' && genero === '') {
            setFilmes([]);
            return;
        }

        const buscarFilmesPorNomeGenero = async () => {
            try {
                const resultado = await buscarFilmes(nomeFilme, genero);
                setFilmes(resultado.rows._array);
            } catch (error) {
                console.error('Erro ao buscar filmes:', error);
                Alert.alert('Erro', 'Falha ao buscar filmes. Por favor, tente novamente.');
            }
        };

        buscarFilmesPorNomeGenero();
    }, [nomeFilme, genero]);

    const buscarFilmes = (filtro) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT *, strftime('%d/%m/%Y %H:%M:%S', datetime(data_cad, 'localtime')) AS dataInsercao FROM filmes WHERE nome_filme LIKE ? OR genero LIKE ? OR data_cad LIKE ?`,
                    [`%${filtro}%`, `%${filtro}%`, `%${filtro}%`],
                    (_, result) => resolve(result),
                    (_, error) => reject(error)
                );
            });
        });
    };


    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>Nome: {item.nome_filme}</Text>
            <Text style={styles.text}>Gênero: {item.genero}</Text>
            <Text style={styles.text}>Classificação: {item.classificacao}</Text>
            <Text style={styles.text}>data de Inserção: {item.data_cad}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Digite o nome do filme"
                value={nomeFilme}
                onChangeText={setNomeFilme}
            />
            <FlatList
                data={filmes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum filme encontrado</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#3498db', // Azul vibrante
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    listContainer: {
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#f9f9f9', // Cinza claro
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2c3e50', // Cinza escuro
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555', // Cinza
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#555', // Cinza
        marginTop: 10,
    },
});
