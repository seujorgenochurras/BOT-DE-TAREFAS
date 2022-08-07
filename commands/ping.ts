import { ICommand } from "wokcommands";

export default {
  category: 'Test',
  description: 'faz o pong quando ping',
  slash: 'both',
  ownerOnly: true,
  testOnly: true,
  callback: ({ message, interaction }) => {
    console.log("executei /ping")
   return 'Pong'
  },

} as ICommand