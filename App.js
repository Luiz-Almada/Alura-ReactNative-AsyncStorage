import { SafeAreaView, StatusBar, StyleSheet, FlatList, View } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker"

import NotaEditor from "./src/componentes/NotaEditor";
import { Nota } from "./src/componentes/Nota";
import { criaTabela, buscaNotas, filtraPorCategoria  } from "./src/servicos/notas";

export default function App() {
  useEffect(() => {
    criaTabela();
    mostraNotas();
  }, []);

  const [notaSelecionada, setNotaSelecionada] = useState({});
  const [notas, setNotas] = useState();
  const [categoria, setCategoria] = useState("Todos")

  //AsyncStorage
  // async function mostraNotas() {
  //   const todasChaves = await AsyncStorage.getAllKeys();
  //   const todasNotas = await AsyncStorage.multiGet(todasChaves);
  //   setNotas(todasNotas);
  // }

  //SQLite
  async function mostraNotas() {
    const todasNotas = await buscaNotas();
    setNotas(todasNotas);
    // console.log(todasNotas);
  }

  async function filtraLista(categoriaSelecionada) {
    setCategoria(categoriaSelecionada)
    if(categoriaSelecionada == "Todos") {
      mostraNotas()
    } else {
      setNotas(await filtraPorCategoria(categoriaSelecionada))
    }
  }

  return (
    <>
      <SafeAreaView style={estilos.container}>
        <FlatList
          data={notas}
          renderItem={(nota) => <Nota {...nota} setNotaSelecionada={setNotaSelecionada} />}
          keyExtractor={(nota) => nota.id}
          ListHeaderComponent={() => {return (
            <View style={estilos.picker}>
              <Picker selectedValue={categoria} onValueChange={(categoriaSelecionada) => filtraLista(categoriaSelecionada)}>
                <Picker.Item label="Todos" value="Todos"/>
                <Picker.Item label="Pessoal" value="Pessoal"/>
                <Picker.Item label="Trabalho" value="Trabalho"/>
                <Picker.Item label="Outros" value="Outros"/>
              </Picker>
            </View>
          )}}
        />
        <NotaEditor mostraNotas={mostraNotas} notaSelecionada={notaSelecionada} setNotaSelecionada={setNotaSelecionada} />
        <StatusBar />
      </SafeAreaView>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
});
