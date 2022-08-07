import { ICommand } from "wokcommands";
import { client } from "..";

export default {
  category: 'Test',
  description: 'PARA O BOT',
  slash: 'both',
  ownerOnly: true,
 
  callback: ({ message, interaction}) => {
    console.log("DESLIGANDO O BOT!")
    const newDate = new Date()
    console.log(`${newDate.getHours()}:${newDate.getMinutes() }:${newDate.getSeconds()}`)
    client.destroy()
    return "BOT OFF"
  },

} as ICommand