
import { Interaction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import {getObjectSize, newLine } from "../notComands/functions";
import fs from "fs";

import merge from "lodash.merge";

const embedLayout = new MessageEmbed()
  .setTitle('Tarefas da sala')
  .setColor(0xf1dd04)
  .setThumbnail('https://i1.sndcdn.com/avatars-nY46PZXw9sxmELaS-T44ywQ-t500x500.jpg')
  .setAuthor({ name: 'Jorge', iconURL: 'https://cdn.discordapp.com/avatars/391208569317621763/7b050915dcd6c9a7a95e77fd1f30561b.webp' })
  .setTimestamp()
const embedTarefasLayout = new MessageEmbed() 

function createEmbedTarefas(rootJSON: string | any) {
  
  for (let x in rootJSON) {
    if (x === 'default') continue;
  }

}



function embedPages(paginadelete: number): MessageEmbed[] {
  let tarefasJ = JSON.parse(fs.readFileSync('./commands/tarefas.json', 'utf-8'))
  const embeds: MessageEmbed[] = [];
  let embedAlign = 0;
  let a = 0;
  let b = 0;
  let newEmbed;
  for (let x in tarefasJ) {
    if (x === 'default') continue;
    a++;
    b++;
    if (b !== paginadelete) {

      newEmbed = new MessageEmbed()

      newEmbed.addField(`${tarefasJ[x].nome} \t ${tarefasJ[x].curso ? "🖥️" : ""}
*${tarefasJ[x].materia}*
      `,
        `
        ${newLine(tarefasJ[x].descricao1)} 

  ${newLine(tarefasJ[x].descricao2)}

  
  ${newLine(tarefasJ[x].descricao3)}
  
      ${tarefasJ[x].dataT}`, true)
      newEmbed.setTimestamp()
      newEmbed?.addField('\u200B', '\u200B', true) //vertical

      if (embedAlign === 2) {
        newEmbed?.addField('\u200B', '\u200B') //horizontal
        embedAlign = 0
      }
      if (getObjectSize(tarefasJ) === a) { //se está na ultima página
        merge(newEmbed, embedLayout)

        embeds.push(newEmbed)
      }
    } else {
      newEmbed?.addField(`${tarefasJ[x].nome} \t ${tarefasJ[x].curso ? "🖥️" : ""}
*${tarefasJ[x].materia}*
      `,

        `  ${newLine(tarefasJ[x].descricao1)}

  ${newLine(tarefasJ[x].descricao2)}
  
  ${newLine(tarefasJ[x].descricao3)}
  
      ${tarefasJ[x].dataT}`, true)
      newEmbed?.addField('\u200B', '\u200B', true) //vertical

      if (embedAlign === 2) {
        newEmbed?.addField('\u200B', '\u200B') //horizontal
        embedAlign = 0
      }

      if (newEmbed) {
        merge(newEmbed, embedLayout)

        b = 0;
        embeds.push(newEmbed)

      }
    }
  }
  return embeds;
}

let embeds = embedPages(2)

const pages = {} as { [key: string]: number }

const tempEmbed = new MessageEmbed()
  .setTitle("Desculpe")
  .setColor("RED")
  .setDescription("TEMPO DE TAREFA CANCELADO, DIGITE O COMANDO NOVAMENTE")

const getRow = (id: string, endRow?: boolean) => {

  const row = new MessageActionRow();
  row.addComponents(
    new MessageButton()
      .setCustomId("anterior_embed")
      .setStyle(endRow === true ? "DANGER" : "SECONDARY")
      .setEmoji("⬅️")
      .setDisabled(pages[id] === 0 || endRow === true)
  )
  row.addComponents(
    new MessageButton()
      .setCustomId("proximo_embed")
      .setStyle(endRow === true ? "DANGER" : "SECONDARY")
      .setEmoji("➡️")
      .setDisabled(pages[id] === embeds.length - 1 || endRow === true)
  )
  return row
}

export default {
  category: 'Sim',
  description: 'FAZ TESTE PORRAAAAA',
  slash: 'both',

  callback: async ({ user, channel }) => {
    embeds = embedPages(2)
    let reply: Message | undefined

    let collector

    const id = user.id
    pages[id] = pages[id] || 0

    const embed = embeds[pages[id]]


    const filter = (i: Interaction) => i.user.id === user.id


    const time = 30000

    reply = await channel.send({ embeds: [embed], components: [getRow(id)] });

    collector = reply.createMessageComponentCollector({ filter, time })

    collector.on("collect", (btnInt) => {
      if (!btnInt) return;

      btnInt.deferUpdate()

      if (btnInt.customId !== "anterior_embed" && btnInt.customId !== "proximo_embed") return;

      if (btnInt.customId === "anterior_embed" && pages[id] > 0) --pages[id];
      if (btnInt.customId === "proximo_embed" && pages[id] < embeds.length - 1) ++pages[id];


      if (reply) {
        reply.edit({
          embeds: [embeds[pages[id]]],
          components: [getRow(id)],
        })
      }
    })
    collector.on("end", (r, reason) => {
      if (reason == 'time') {
        reply?.edit({
          embeds: [tempEmbed],
          components: [getRow(id, true)]
        })

      }
    })
    return "sim";
  },

} as ICommand

