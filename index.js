// Importação dos Módulos/Pacotes
const { select, input, checkbox } = require("@inquirer/prompts");
const fs = require("fs").promises

let mensagem = "Bem vindo ao Gerenciador de Metas!"

let metas

// Carregar Metas
const carregarMetas = async () => {
  try {
    const dados = await fs.readFile("metas.json", "utf-8")
    metas = JSON.parse(dados)
  }
  catch(erro){
    metas = []
  }
}

// Salvar Metas
const salvarMetas = async() => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

// Cadastrar Metas
const cadastrarMeta = async () => {
  const meta = await input({ message: "Digite a meta:" });

  if (meta.length == 0) {
    mensagem = "A meta não pode ser vazia."
    return;
  }

  metas.push({ value: meta, checked: false });

  mensagem = "Meta cadastrada com sucesso!"

};

// Listar Metas
const listarMetas = async () => {
  if(metas.length == 0){
    mensagem = "Você ainda não cadastrou metas"
    return
  }


  const respostas = await checkbox({
    message:
      "Use as setas para mudar de meta, o espaço para marcar/desmarcar e o enter para finalizar essa etapa",
    choices: [...metas],
    instructions: false,
  });

  metas.forEach((m) => {
    m.checked = false;
  });

  if (respostas.length == 0) {
    mensagem = "Nenhuma meta selecionada!"
    return;
  }

  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta;
    });

    meta.checked = true;
  });

  mensagem = "Meta(s) concluída(s)"
};

// Metas Realizadas
const metasRealizadas = async () => {
  if(metas.length == 0){
    mensagem = "Você ainda não cadastrou metas"
    return
  }

  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });

  if (realizadas.length == 0) {
    mensagem = "Não existem metas realizadas"
    return;
  }

  await select({
    message: "Metas realizadas: ",
    choices: [...realizadas]
  });

  console.log(realizadas);
};

// Metas Abertas
const metasAbertas = async () => {
  if(metas.length == 0){
    mensagem = "Você ainda não cadastrou metas"
    return
  }

  const abertas = metas.filter((meta) => {
    return meta.checked != true;
  });

  if (abertas.length == 0) {
    mensagem = "Não existem metas abertas :)"
    return;
  }

  await select({
    message: "Metas abertas: " + abertas.length,
    choices: [...abertas]
  });
};

// Deletar Metas
const deletarMetas = async () => {
  if(metas.length == 0){
    mensagem = "Você ainda não cadastrou metas"
    return
  }

  const metasDesmarcadas = metas.map((meta) => {
    return { value: meta.value, checked: false }
  })

  const itemsADeletar = await checkbox({ 
    message: "Selecione um item para deletar",
    choices: [...metasDesmarcadas],
    instructions: false
  })
 
  if(itemsADeletar.length == 0) {
    mensagem = "Nenhum item para deletar"
    return
  }

  itemsADeletar.forEach((item) => {
    metas = metas.filter((meta) => {
      return meta.value != item
    })
  })

  mensagem = "Meta(s) deletada(s) com sucesso!"

}

// Sistema de Mensagens
const mostrarMensagem = () => {
  console.clear()

  if(mensagem != "") {
    console.log(mensagem)
    console.log("")
    mensagem = ""
  }
}

// Estrutura de Seleção e Condição
const start = async () => {
  await carregarMetas()

  while (true) {
  mostrarMensagem()
  await salvarMetas()

    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Cadastrar meta",
          value: "cadastrar",
        },
        {
          name: "Listar metas",
          value: "listar",
        },
        {
          name: "Metas abertas",
          value: "abertas",
        },
        {
          name: "Metas realizadas",
          value: "realizadas",
        },
        {
          name: "Deletar metas",
          value: "deletar",
        },
        {
          name: "Sair",
          value: "sair",
        },
      ],
    });

    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta();
        console.log(metas);
        break;
      case "listar":
        await listarMetas();
        break;
      case "realizadas":
        await metasRealizadas();
        break;
      case "abertas":
        await metasAbertas();
        break;
        case "deletar":
        await deletarMetas();
        break;
      case "sair":
        console.log("Volte sempre!");
        return;
    }
  }
};

start();
