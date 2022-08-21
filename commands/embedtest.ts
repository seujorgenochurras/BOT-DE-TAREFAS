import { ICommand } from "wokcommands";


export default {
  category: 'Sim',
  description: 'FAZ TESTE PORRAAAAA',
  slash: 'both',

  callback: async ({ user, channel }) => {
    
    return "sim";
  },

} as ICommand
