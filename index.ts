import DiscordJS, { DataResolver, Intents } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import path from 'path'
dotenv.config()

export const client = new DiscordJS.Client({
  intents:[
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
  ],
})
client.on('ready', () =>{
 
  new WOKCommands(client, {
    commandDir: path.join(__dirname, 'commands'),
    typeScript: true,
    testServers: ['947499225581764668', '940962759087104010'],
    botOwners: ["391208569317621763"],
  
  })

  const guildID = '940962759087104010'
  const guild = client.guilds.cache.get(guildID)
  let commands

  if(guild){
    commands = guild.commands
  } else{
    commands = client.application?.commands
  }
  console.log("EU QUERO ME MATAAAAAAAAAAAAAAAA")
})


client.login(process.env.TROLLED_BY_JOTINHA)
