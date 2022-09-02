import { ICommand } from "wokcommands";
import { client } from "../index"
export default {
  category: 'Test',
  description: 'Envia um bug para o tal do desenvolvimento',
  slash: 'both',
  

  minArgs: 1,
  expectedArgs: "<Bug>",
  expectedArgsTypes: ["STRING"],

  callback: ({ args}) => {
    client.users.fetch("391208569317621763").then(user => {
      try {
        user.send(`${args[0]} \n enviado por:${user.username}|| ${user.id} ${user.avatarURL()} `)
      }catch (err) {
        console.log(err)
        
      }
    })
    return 'Bug/sugestão enviada'
  },

} as ICommand