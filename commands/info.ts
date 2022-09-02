import { ICommand } from "wokcommands";

export default {
  category: 'Test',
  description: 'PORQUE?',
  slash: 'both',


  callback: () => {
    console.log("executei /info")
    return("Digita /tarefas para tarefas \n ou /bug para enviar um bug")
  },

} as ICommand