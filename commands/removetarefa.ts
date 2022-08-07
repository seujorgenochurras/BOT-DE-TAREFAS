import { ICommand } from "wokcommands";
import { saveData } from "../notComands/functions";
import * as fs from "fs"




let tarefas: string[] = [];



let tarefasJa = JSON.parse(fs.readFileSync('./commands/tarefas.json', 'utf-8'))
for (let x in tarefasJa) {
  tarefas.push(x)
}





export default {
  ownerOnly: true,

  category: 'Test',
  description: "MREU tarefa",
  slash: 'both',
  // options: [
  //   {
  //     name: "tarefaa",
  //     description: "Tarefa a ser deletada",
  //     type: 3,
  //     required: false,
  //     // choices: tarefas.map((tarefas) => ({
        
  //     //   name: tarefas,
  //     //   value: tarefas,
  //     // }))
  //   }
  // ],
  
  
  minArgs: 1,
  expectedArgs: '<tarefa>',
  expectedArgsTypes: ["STRING"],
  callback: ({ args }) => {
console.log(tarefas)
    console.log("executei /removeTarefa")
    let tarefasJ = JSON.parse(fs.readFileSync('./commands/tarefas.json', 'utf-8'))


    function removeTarefa(tarefa: string,) {

      if (!tarefasJ[tarefa]) {
        return "Tarefa não encontrada"
      }
      delete tarefasJ[tarefa]
      saveData(tarefasJ, false)
      console.log("Tarefa deletada")
      return "Tarefa deletada"
    }
    return removeTarefa(args[0])
  }


} as ICommand