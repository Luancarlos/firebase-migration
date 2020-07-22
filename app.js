const firebase  = require('firebase');
const fs        = require('fs');

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
const fb = firebase.initializeApp(firebaseConfig);

autenticacao();


async function autenticacao() {
    await fb.auth().signInWithEmailAndPassword('', '');
    console.log('===== AUTENTICADO =======');
    buscarTabela('motoristas');
    // lerArquivo('questionario');
}


async function salvarTabela(nome, dados) {
    for (let item of dados) {
        await fb.firestore().collection(nome).doc(item.id).set(Object.assign({}, item));
    }
    console.log('DADOS SALVOS');
}

function buscarTabela(nome) {
    console.log(`======= BUSCANDO OS ${nome.toUpperCase()} ======`);
    fb.firestore().collection(nome).get().then((snapshot) => {
        const dados = [];
        snapshot.forEach(doc => {
            dados.push(doc.data());
        });

        gravarArquivo(`./${nome}.json`, JSON.stringify(dados));

    }).catch((error) => {   
        console.log('error', error);
    })
}

function lerArquivo(nomeArquivo) {
    fs.readFile(`./${nomeArquivo}.json`, function(error, dados) {
        if(error) {
            throw error;
        }
        let res = JSON.parse(dados.toString('utf8'));
        salvarTabela(nomeArquivo, res);
    });
}


function gravarArquivo(nomeArquivo, dados) {
    fs.writeFile(nomeArquivo, dados, function(error) {
        if(error) {
            throw error;
        }

        console.log('arquivo salvo');
    });
}




