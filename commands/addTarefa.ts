import { ICommand } from 'wokcommands';
import * as fs from 'fs';
import { tarefa } from '../notComands/functions';

const data = JSON.parse(fs.readFileSync('./commands/tarefas.json', 'utf-8'))

function saveData(data: object) {
  function finished(error: any) {
    if (error) {
      console.error(error)
      return
    }

  }
  const jsonData = JSON.stringify(data, null, 2)
  fs.writeFile("./commands/tarefas.json", jsonData, finished)
  fs.writeFile("./BACKUP_tarefas.json", jsonData, finished)
  console.log("salvei data")
}

function saveTarefa(tarefa: tarefa) {
  const newTarefaJ = {
    nome: tarefa.nome,
    descricao1: tarefa.descricao1,
    descricao2: ` \`\`\` ${tarefa.descricao2} \`\`\` `,
    descricao3: tarefa.descricao3,
    materia: tarefa.materia,
    dataT: tarefa.dataT,
    curso: tarefa.curso,
    grupo: tarefa.grupo,
  }
  data[tarefa.nome] = newTarefaJ

  saveData(data)
}


export default {

  category: 'Test',
  description: 'Adiciona tarefa',
  slash: "both",
  ownerOnly: true,


  options: [
    {
      name: "nome", //args[0]
      description: "Titulo da tarefa",
      required: true,
      type: "STRING",
    },
    {
      name: "descricao1",//args[1]
      description: "SubTitulo da tarefa",
      required: true,
      type: "STRING",
    },
    {
      name: "descricao2",//args[2]
      description: "Descrição da tarefa",
      required: true,
      type: "STRING",
    },

    {
      name: "materia",//args[3]
      description: "Matéria da tarefa",
      required: true,
      type: "STRING",
    },
    {
      name: "data",//args[4]
      description: "Data de entrega",
      required: true,
      type: "STRING",
    },
    {
      name: "curso",//args[5]
      description: "A tarefa é do curso?",
      required: true,
      type: "BOOLEAN",
    },
    {
      name: "grupo", //args[6]
      description: "Grupo a ser escolhido",
      required: true,
      choices: [
        { name: "GA", value: "GA" },

        { name: "GB", value: "GB", },

        { name: "undefined", value: "undefined" }
      ],
      type: "STRING"
    },
    {
      name: "descricao3",//args[7]
      description: "Descrição fora do quadrado",
      required: false,
      type: "STRING",
    },
  ],
  callback: ({ args }) => {
    console.log("executei /addTarefa")
    const newTarefa: tarefa = {
      nome: args[0],
      descricao1: args[1],
      descricao2: args[2],
      materia: args[3],
      dataT: args[4],
      curso: args[5] == "true" ? true : false,
      grupo: args[6],
      descricao3: args[7],

    }
    
    saveTarefa(newTarefa)

    return `tarefa enviada`
  },

} as ICommand